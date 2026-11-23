// Servidor do HUBContábil: API (/api) + front-end estático (dist/).
// Variáveis: DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, PORT, COOKIE_SECURE, TRUST_PROXY.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const here = dirname(fileURLToPath(import.meta.url))
const env = process.env
const PORT = Number(env.PORT || 3000)
const JWT_SECRET = env.JWT_SECRET
const COOKIE = 'hub_sid'
const SESSION_HOURS = 8

if (!env.DATABASE_URL) throw new Error('Defina DATABASE_URL')
if (!JWT_SECRET || JWT_SECRET.length < 32) throw new Error('Defina JWT_SECRET (mínimo 32 caracteres)')

const db = new pg.Pool({ connectionString: env.DATABASE_URL, max: 10 })

/* ---------------- Banco: schema + conta admin inicial ---------------- */
async function waitForDb(tries = 30) {
  for (let i = 1; ; i++) {
    try {
      await db.query('select 1')
      return
    } catch (err) {
      if (i >= tries) throw err
      await new Promise((r) => setTimeout(r, 1000))
    }
  }
}

async function migrate() {
  await db.query(readFileSync(join(here, 'schema.sql'), 'utf8'))
}

/** Cria o admin só se ainda não existir: trocar a senha depois no banco não é desfeito no próximo deploy. */
async function seedAdmin() {
  const email = env.ADMIN_EMAIL?.trim().toLowerCase()
  const senha = env.ADMIN_PASSWORD
  if (!email || !senha) return
  const hash = await bcrypt.hash(senha, 12)
  const r = await db.query(
    `insert into usuarios (nome, email, senha_hash, perfil)
     values ('Administrador', $1, $2, 'admin')
     on conflict (lower(email)) do nothing`,
    [email, hash],
  )
  if (r.rowCount) console.log(`Conta admin criada: ${email}`)
}

/* ---------------- Sessão (cookie httpOnly com JWT) ---------------- */
function readCookie(req, name) {
  const raw = req.headers.cookie || ''
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return decodeURIComponent(v.join('='))
  }
  return null
}

function setSession(res, user) {
  const token = jwt.sign({ sub: user.id, perfil: user.perfil }, JWT_SECRET, { expiresIn: `${SESSION_HOURS}h` })
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.COOKIE_SECURE === '1', // ligar quando houver HTTPS
    maxAge: SESSION_HOURS * 3600 * 1000,
    path: '/',
  })
}

function sessionUserId(req) {
  const token = readCookie(req, COOKIE)
  if (!token) return null
  try {
    return jwt.verify(token, JWT_SECRET).sub
  } catch {
    return null
  }
}

/* ---------------- Limite de tentativas de login ---------------- */
const attempts = new Map() // chave ip|email -> { n, until }
const MAX_TRIES = 10
const WINDOW_MS = 15 * 60 * 1000

function tooMany(key) {
  const a = attempts.get(key)
  if (!a || a.until < Date.now()) return false
  return a.n >= MAX_TRIES
}
function registerFail(key) {
  const a = attempts.get(key)
  if (!a || a.until < Date.now()) attempts.set(key, { n: 1, until: Date.now() + WINDOW_MS })
  else a.n++
}

// hash fixo para comparar quando o e-mail não existe (tempo de resposta igual)
const DUMMY_HASH = bcrypt.hashSync('usuario-inexistente', 12)

/* ---------------- App ---------------- */
const app = express()
app.disable('x-powered-by')
if (env.TRUST_PROXY === '1') app.set('trust proxy', 1)

app.use((_req, res, next) => {
  res.set({
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  })
  next()
})
app.use('/api', express.json({ limit: '100kb' }))
app.use('/api', (_req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

app.get('/api/health', async (_req, res) => {
  try {
    await db.query('select 1')
    res.json({ ok: true })
  } catch {
    res.status(503).json({ ok: false })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase()
  const senha = String(req.body?.password ?? '')
  const key = `${req.ip}|${email}`
  if (!email || !senha) return res.status(400).json({ error: 'Informe e-mail e senha.' })
  if (tooMany(key)) return res.status(429).json({ error: 'Muitas tentativas. Aguarde 15 minutos.' })

  try {
    const { rows } = await db.query(
      'select id, nome, email, senha_hash, perfil from usuarios where lower(email) = $1 and ativo',
      [email],
    )
    const user = rows[0]
    const ok = await bcrypt.compare(senha, user?.senha_hash ?? DUMMY_HASH)
    if (!user || !ok) {
      registerFail(key)
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' })
    }
    attempts.delete(key)
    await db.query('update usuarios set ultimo_acesso = now() where id = $1', [user.id])
    setSession(res, user)
    res.json({ nome: user.nome, email: user.email, perfil: user.perfil })
  } catch (err) {
    console.error('login:', err)
    res.status(500).json({ error: 'Erro ao entrar. Tente novamente.' })
  }
})

app.get('/api/auth/me', async (req, res) => {
  const id = sessionUserId(req)
  if (!id) return res.status(401).json({ error: 'Sessão expirada.' })
  const { rows } = await db.query('select nome, email, perfil from usuarios where id = $1 and ativo', [id])
  if (!rows[0]) return res.status(401).json({ error: 'Sessão expirada.' })
  res.json(rows[0])
})

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(COOKIE, { path: '/' })
  res.status(204).end()
})

app.use('/api', (_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }))

/* ---------------- Front-end estático (SPA) ---------------- */
const dist = join(here, '..', 'dist')
app.use(
  '/assets',
  express.static(join(dist, 'assets'), { immutable: true, maxAge: '1y', fallthrough: false }),
)
app.use(express.static(dist, { index: false, maxAge: '1h' }))
app.get('*', (_req, res) => {
  res.set('Cache-Control', 'no-cache')
  res.sendFile(join(dist, 'index.html'))
})

await waitForDb()
await migrate()
await seedAdmin()
app.listen(PORT, () => console.log(`HUBContábil ouvindo na porta ${PORT}`))
