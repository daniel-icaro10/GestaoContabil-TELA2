import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export type Role = 'admin' | 'escritorio' | 'pj' | 'pf'

/**
 * Acessos de demonstração (sem backend).
 * Nenhum e-mail ou senha fica no código: guardamos apenas o hash SHA-256 de "email:senha".
 * As credenciais estão documentadas fora do front-end (README / com o responsável).
 * Quando houver backend, esta verificação deve ser substituída por uma API de autenticação.
 */
const ACCOUNTS: { role: Role; hash: string; label: string; home: string }[] = [
  { role: 'admin', label: 'Super Admin', home: '/admin', hash: 'a0155b5049403dc02a249908a37188195cc5266af117d45cc10c506d53fd5141' },
  { role: 'escritorio', label: 'Escritório Contábil', home: '/escritorio', hash: '416c2e7a32bb266017bdf20b6284c150e644d6d206c3a7e64916b100c5bebd8b' },
  { role: 'pj', label: 'Cliente PJ', home: '/pj', hash: '2be3884073fe45482de14bdd530ffd5a62f966cb8e0e926d8fbe19a452d9cb1a' },
  { role: 'pf', label: 'Cliente Pessoa Física', home: '/pf', hash: '4b100dc179bfabbac1bf3e33228ae1168d56bc8b378bf85a93a2891e3ccfaff1' },
]

/** Quais portais cada perfil pode abrir. */
const ACCESS: Record<Role, Role[]> = {
  admin: ['admin', 'escritorio', 'pj', 'pf'],
  escritorio: ['escritorio', 'pj', 'pf'],
  pj: ['pj'],
  pf: ['pf'],
}

const KEY = 'hub.session'

async function sha256(text: string) {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function getSession(): Role | null {
  try {
    const v = localStorage.getItem(KEY)
    return v && v in ACCESS ? (v as Role) : null
  } catch {
    return null
  }
}

export async function login(email: string, password: string) {
  if (!crypto?.subtle) throw new Error('Ambiente sem suporte a criptografia (use HTTPS).')
  const hash = await sha256(`${email.trim().toLowerCase()}:${password}`)
  const account = ACCOUNTS.find((a) => a.hash === hash)
  if (!account) return null
  try {
    localStorage.setItem(KEY, account.role)
  } catch {}
  return account
}

export function logout() {
  try {
    localStorage.removeItem(KEY)
  } catch {}
}

export function canAccess(role: Role | null, portal: Role) {
  return !!role && ACCESS[role].includes(portal)
}

/** Protege as rotas de um portal: sem sessão/permissão volta ao login. */
export function RequireAuth({ portal, children }: { portal: Role; children: ReactNode }) {
  const { pathname } = useLocation()
  if (!canAccess(getSession(), portal)) {
    return <Navigate to={`/login?next=${encodeURIComponent(pathname)}`} replace />
  }
  return <>{children}</>
}
