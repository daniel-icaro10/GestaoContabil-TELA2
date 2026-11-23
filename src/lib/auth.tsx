import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export type Role = 'admin' | 'escritorio' | 'pj' | 'pf'

type Account = { role: Role; label: string; home: string }

const LABELS: Record<Role, Account> = {
  admin: { role: 'admin', label: 'Super Admin', home: '/admin' },
  escritorio: { role: 'escritorio', label: 'Escritório Contábil', home: '/escritorio' },
  pj: { role: 'pj', label: 'Cliente PJ', home: '/pj' },
  pf: { role: 'pf', label: 'Cliente Pessoa Física', home: '/pf' },
}

/**
 * Contas de TESTE (sem backend próprio): guardamos só o hash SHA-256 de "email:senha".
 * Contas reais (como o admin) ficam no banco e são conferidas pelo servidor em /api/auth/login.
 * O hash do admin só é aceito em desenvolvimento local, onde pode não haver banco rodando.
 */
const DEMO_ACCOUNTS: { role: Role; hash: string }[] = [
  ...(import.meta.env.DEV ? [{ role: 'admin' as Role, hash: 'a0155b5049403dc02a249908a37188195cc5266af117d45cc10c506d53fd5141' }] : []),
  { role: 'escritorio', hash: '416c2e7a32bb266017bdf20b6284c150e644d6d206c3a7e64916b100c5bebd8b' },
  { role: 'pj', hash: '2be3884073fe45482de14bdd530ffd5a62f966cb8e0e926d8fbe19a452d9cb1a' },
  { role: 'pf', hash: '4b100dc179bfabbac1bf3e33228ae1168d56bc8b378bf85a93a2891e3ccfaff1' },
]

/** Quais portais cada perfil pode abrir. */
const ACCESS: Record<Role, Role[]> = {
  admin: ['admin', 'escritorio', 'pj', 'pf'],
  escritorio: ['escritorio', 'pj', 'pf'],
  pj: ['pj'],
  pf: ['pf'],
}

const KEY = 'hub.session'
const SRC_KEY = 'hub.session.src' // 'api' (banco) ou 'demo' (conta de teste)

/* ---------------- SHA-256 ----------------
 * crypto.subtle só existe em HTTPS/localhost. Sem ele (site em http://IP),
 * usamos esta implementação em JavaScript puro.
 */
const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
  0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
  0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
])

function sha256Js(bytes: Uint8Array) {
  const bitLen = bytes.length * 8
  const padded = new Uint8Array(((bytes.length + 9 + 63) >> 6) << 6)
  padded.set(bytes)
  padded[bytes.length] = 0x80
  const view = new DataView(padded.buffer)
  view.setUint32(padded.length - 8, Math.floor(bitLen / 0x100000000))
  view.setUint32(padded.length - 4, bitLen >>> 0)

  const h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19])
  const w = new Uint32Array(64)
  const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n))

  for (let off = 0; off < padded.length; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(off + i * 4)
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3)
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10)
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0
    }
    let [a, b, c, d, e, f, g, hh] = h
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)
      const t1 = (hh + S1 + ((e & f) ^ (~e & g)) + K[i] + w[i]) >>> 0
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)
      const t2 = (S0 + ((a & b) ^ (a & c) ^ (b & c))) >>> 0
      hh = g
      g = f
      f = e
      e = (d + t1) >>> 0
      d = c
      c = b
      b = a
      a = (t1 + t2) >>> 0
    }
    h[0] += a
    h[1] += b
    h[2] += c
    h[3] += d
    h[4] += e
    h[5] += f
    h[6] += g
    h[7] += hh
  }
  return Array.from(h, (x) => x.toString(16).padStart(8, '0')).join('')
}

async function sha256(text: string) {
  const data = new TextEncoder().encode(text)
  if (globalThis.crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')
  }
  return sha256Js(data)
}

/* ---------------- Sessão ---------------- */
function saveSession(role: Role, src: 'api' | 'demo') {
  try {
    localStorage.setItem(KEY, role)
    localStorage.setItem(SRC_KEY, src)
  } catch {}
}

export function getSession(): Role | null {
  try {
    const v = localStorage.getItem(KEY)
    return v && v in ACCESS ? (v as Role) : null
  } catch {
    return null
  }
}

function sessionSource() {
  try {
    return localStorage.getItem(SRC_KEY)
  } catch {
    return null
  }
}

/**
 * 1) Tenta o servidor (contas do banco).
 * 2) Se o servidor não reconhecer (ou não existir, em dev), tenta as contas de teste.
 */
export async function login(email: string, password: string): Promise<Account | null> {
  let limitError: string | null = null
  try {
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ email, password }),
    })
    if (r.ok) {
      const data = (await r.json()) as { perfil: Role }
      if (data.perfil in ACCESS) {
        saveSession(data.perfil, 'api')
        return LABELS[data.perfil]
      }
    } else if (r.status === 429) {
      const data = await r.json().catch(() => ({}))
      limitError = data.error ?? 'Muitas tentativas. Aguarde alguns minutos.'
    }
  } catch (err) {
    // erro de rede = servidor indisponível (ex.: só o Vite rodando); segue para as contas de teste
    if (!(err instanceof TypeError)) throw err
  }

  const hash = await sha256(`${email.trim().toLowerCase()}:${password}`)
  const demo = DEMO_ACCOUNTS.find((a) => a.hash === hash)
  if (!demo) {
    if (limitError) throw new Error(limitError)
    return null
  }
  saveSession(demo.role, 'demo')
  return LABELS[demo.role]
}

export function logout() {
  if (sessionSource() === 'api') {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {})
  }
  try {
    localStorage.removeItem(KEY)
    localStorage.removeItem(SRC_KEY)
  } catch {}
}

export function canAccess(role: Role | null, portal: Role) {
  return !!role && ACCESS[role].includes(portal)
}

/** Protege as rotas de um portal: sem sessão/permissão volta ao login. */
export function RequireAuth({ portal, children }: { portal: Role; children: ReactNode }) {
  const { pathname } = useLocation()
  const [expired, setExpired] = useState(false)
  const role = getSession()

  // Sessões do banco são conferidas no servidor (cookie httpOnly); se expirou, volta ao login.
  useEffect(() => {
    if (sessionSource() !== 'api') return
    let alive = true
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then((r) => {
        if (alive && r.status === 401) {
          logout()
          setExpired(true)
        }
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [portal])

  if (expired || !canAccess(role, portal)) {
    return <Navigate to={`/login?next=${encodeURIComponent(pathname)}`} replace />
  }
  return <>{children}</>
}
