import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export type Role = 'admin' | 'escritorio' | 'pj' | 'pf'

/** Logins simples de demonstração (sem backend). */
export const USERS: { role: Role; email: string; password: string; label: string; home: string }[] = [
  { role: 'admin', email: 'admin@hubcontabil.com', password: 'admin123', label: 'Super Admin', home: '/admin' },
  { role: 'escritorio', email: 'escritorio@hubcontabil.com', password: 'escritorio123', label: 'Escritório Contábil', home: '/escritorio' },
  { role: 'pj', email: 'pj@hubcontabil.com', password: 'pj123', label: 'Cliente PJ', home: '/pj' },
  { role: 'pf', email: 'pf@hubcontabil.com', password: 'pf123', label: 'Cliente Pessoa Física', home: '/pf' },
]

/** Quais portais cada perfil pode abrir. */
const ACCESS: Record<Role, Role[]> = {
  admin: ['admin', 'escritorio', 'pj', 'pf'],
  escritorio: ['escritorio', 'pj', 'pf'],
  pj: ['pj'],
  pf: ['pf'],
}

const KEY = 'hub.session'

export function getSession(): Role | null {
  try {
    const v = localStorage.getItem(KEY)
    return v && v in ACCESS ? (v as Role) : null
  } catch {
    return null
  }
}

export function login(email: string, password: string) {
  const u = USERS.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password)
  if (!u) return null
  try {
    localStorage.setItem(KEY, u.role)
  } catch {}
  return u
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
    return <Navigate to={`/login?perfil=${portal}&next=${encodeURIComponent(pathname)}`} replace />
  }
  return <>{children}</>
}
