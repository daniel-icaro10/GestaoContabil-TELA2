import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import { Bell, ArrowRight, ArrowLeft, LogOut, Menu, X, ChevronDown, Check, type LucideIcon } from 'lucide-react'
import { cn } from '../lib/utils'
import { Logo } from './Logo'
import { Avatar } from './ui'
import { useToast } from './Toast'
import { logout } from '../lib/auth'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  /** número exibido no cabeçalho: "01" */
  num?: string
  /** título do cabeçalho (padrão = label) */
  title?: string
  subtitle: string
  /** quando true, o cabeçalho não mostra o prefixo do portal */
  noPrefix?: boolean
}

export type SwitchLink = { label: string; to: string; tone: 'green' | 'sky' | 'violet' | 'brand'; back?: boolean }

export type SelectorOption = { id: string; name: string; doc: string; initials: string }

export type PortalConfig = {
  variant: 'light' | 'dark'
  prefix: string
  logoTag?: { label: string; className: string }
  headerBadge?: { label: string; className: string; dot: string }
  sections: { label: string; items: NavItem[] }[]
  selector?: { options: SelectorOption[]; avatarClass?: string; round?: boolean }
  user: { name: string; role: string; initials: string }
  switches: SwitchLink[]
  showFooter?: boolean
  notifications: { title: string; text: string; time: string }[]
}

const switchCls = {
  green: 'border-emerald-200 bg-emerald-50/60 text-emerald-800',
  sky: 'border-sky-200 bg-sky-50/60 text-sky-800',
  violet: 'border-violet-200 bg-violet-50/70 text-violet-800',
  brand: 'border-brand/25 bg-brand/5 text-brand',
}
const switchDot = { green: 'bg-emerald-500', sky: 'bg-sky-500', violet: 'bg-violet-500', brand: 'bg-brand' }

function useClickOutside(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && close()
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open, close])
  return ref
}

function Selector({ cfg }: { cfg: NonNullable<PortalConfig['selector']> }) {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(cfg.options[0])
  const toast = useToast()
  const ref = useClickOutside(open, () => setOpen(false))
  const many = cfg.options.length > 1
  return (
    <div ref={ref} className="relative mx-3 mb-2">
      <button
        onClick={() => many && setOpen((o) => !o)}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5 text-left shadow-sm',
          many && 'cursor-pointer hover:border-brand/30',
        )}
      >
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center text-[11px] font-bold text-white',
            cfg.round ? 'rounded-full' : 'rounded-lg',
            cfg.avatarClass ?? 'bg-gradient-to-br from-brand to-violet-500',
          )}
        >
          {current.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-bold text-ink">{current.name}</p>
          <p className="truncate text-[10px] tracking-wide text-muted">{current.doc}</p>
        </div>
        {many && <ChevronDown size={15} className="text-muted" />}
      </button>
      {open && (
        <div className="animate-fade absolute left-0 right-0 top-full z-30 mt-1 rounded-xl border border-line bg-white p-1 shadow-xl">
          {cfg.options.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setCurrent(o)
                setOpen(false)
                toast(`Alternado para ${o.name}`, 'info')
              }}
              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-slate-50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-ink">{o.name}</p>
                <p className="truncate text-[10px] text-muted">{o.doc}</p>
              </div>
              {o.id === current.id && <Check size={14} className="text-brand" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Sidebar({ cfg, onNavigate }: { cfg: PortalConfig; onNavigate?: () => void }) {
  const dark = cfg.variant === 'dark'
  const navigate = useNavigate()
  return (
    <aside
      className={cn(
        'flex h-full w-[196px] shrink-0 flex-col border-r',
        dark ? 'border-white/5 bg-navy text-slate-300' : 'border-line bg-white',
      )}
    >
      <div className={cn('px-4 pt-4 pb-3', dark && 'border-b border-white/10 pb-4')}>
        <div className="flex items-center justify-between gap-2">
          <Logo dark={dark} />
          {cfg.logoTag && !dark && (
            <span className={cn('rounded-md border px-1.5 py-0.5 text-[8px] font-bold tracking-wider', cfg.logoTag.className)}>
              {cfg.logoTag.label}
            </span>
          )}
        </div>
        {cfg.logoTag && dark && (
          <span
            className={cn(
              'mt-3 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[9px] font-bold tracking-wider',
              cfg.logoTag.className,
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            {cfg.logoTag.label}
          </span>
        )}
      </div>

      {cfg.selector && <Selector cfg={cfg.selector} />}

      <nav className="scroll-thin flex-1 overflow-y-auto px-2 pb-3">
        {cfg.sections.map((s) => (
          <div key={s.label} className="mt-3">
            <p className={cn('mb-1.5 px-2.5 text-[9px] font-bold tracking-[0.15em]', dark ? 'text-slate-500' : 'text-slate-400')}>
              {s.label}
            </p>
            {s.items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'group mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] transition',
                    dark
                      ? isActive
                        ? 'border border-violet-500/40 bg-violet-500/15 font-semibold text-white'
                        : 'border border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
                      : isActive
                        ? 'bg-brand/10 font-semibold text-brand'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-ink',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <it.icon size={15} strokeWidth={1.8} />
                    <span className="flex-1">{it.label}</span>
                    {isActive && <span className={cn('h-1.5 w-1.5 rounded-full', dark ? 'bg-violet-400' : 'bg-brand')} />}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {cfg.switches.length > 0 && (
        <div className="space-y-1.5 px-2 pb-3">
          {cfg.switches.map((s) => (
            <Link
              key={s.label}
              to={s.to}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[11px] font-semibold transition hover:brightness-95',
                switchCls[s.tone],
              )}
            >
              {s.back ? <ArrowLeft size={12} /> : <span className={cn('h-1.5 w-1.5 rounded-full', switchDot[s.tone])} />}
              <span className="flex-1">{s.label}</span>
              {!s.back && <ArrowRight size={12} />}
            </Link>
          ))}
        </div>
      )}

      <div className={cn('flex items-center gap-2.5 border-t px-3 py-3', dark ? 'border-white/10' : 'border-line')}>
        <Avatar text={cfg.user.initials} size={30} gradient />
        <div className="min-w-0 flex-1">
          <p className={cn('truncate text-[12px] font-bold', dark ? 'text-white' : 'text-ink')}>{cfg.user.name}</p>
          <p className={cn('truncate text-[10px]', dark ? 'text-slate-400' : 'text-muted')}>{cfg.user.role}</p>
        </div>
        {!dark && (
          <button title="Sair" onClick={() => (logout(), navigate('/login'))} className="cursor-pointer text-slate-400 hover:text-red-500">
            <LogOut size={15} />
          </button>
        )}
      </div>
      {dark && (
        <button
          onClick={() => (logout(), navigate('/login'))}
          className="flex cursor-pointer items-center gap-2 px-4 pb-4 text-[12px] text-slate-400 hover:text-white"
        >
          <LogOut size={14} /> Sair
        </button>
      )}
    </aside>
  )
}

function Notifications({ items }: { items: PortalConfig['notifications'] }) {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(items.length > 0)
  const ref = useClickOutside(open, () => setOpen(false))
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o)
          setUnread(false)
        }}
        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-line bg-white text-slate-500 hover:text-brand"
      >
        <Bell size={16} />
        {unread && <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full border border-white bg-red-500" />}
      </button>
      {open && (
        <div className="animate-fade absolute right-0 top-full z-40 mt-2 w-80 rounded-xl border border-line bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-bold">Notificações</p>
            <span className="text-[11px] text-muted">{items.length} recentes</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 && <p className="px-4 py-6 text-center text-xs text-muted">Nenhuma notificação.</p>}
            {items.map((n, i) => (
              <div key={i} className="border-b border-line px-4 py-3 last:border-0 hover:bg-slate-50">
                <div className="flex justify-between gap-2">
                  <p className="text-[13px] font-semibold text-ink">{n.title}</p>
                  <span className="shrink-0 text-[10px] text-muted">{n.time}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function UserMenu({ cfg }: { cfg: PortalConfig }) {
  const [open, setOpen] = useState(false)
  const ref = useClickOutside(open, () => setOpen(false))
  const navigate = useNavigate()
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="cursor-pointer">
        <Avatar text={cfg.user.initials} size={34} gradient />
      </button>
      {open && (
        <div className="animate-fade absolute right-0 top-full z-40 mt-2 w-56 rounded-xl border border-line bg-white p-1 shadow-xl">
          <div className="border-b border-line px-3 py-2.5">
            <p className="text-[13px] font-bold">{cfg.user.name}</p>
            <p className="text-[11px] text-muted">{cfg.user.role}</p>
          </div>
          {cfg.switches.map((s) => (
            <Link key={s.label} to={s.to} className="block rounded-lg px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50">
              {s.label}
            </Link>
          ))}
          <button
            onClick={() => (logout(), navigate('/login'))}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-red-500 hover:bg-red-50"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      )}
    </div>
  )
}

function Footer() {
  const toast = useToast()
  const links = ['Central de Ajuda', 'Política de Privacidade', 'Termos de Uso', 'Contato']
  return (
    <footer className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-line bg-white px-6 py-4">
      <Logo />
      <div className="flex flex-wrap gap-5">
        {links.map((l) => (
          <button key={l} onClick={() => toast(`${l}: página em construção`, 'info')} className="cursor-pointer text-xs text-slate-500 hover:text-brand">
            {l}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Sistema operacional
        </span>
        <span className="text-[11px] text-muted">© 2026 HubContábil</span>
      </div>
    </footer>
  )
}

export function PortalLayout({ cfg, children }: { cfg: PortalConfig; children?: ReactNode }) {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const all = cfg.sections.flatMap((s) => s.items)
  const current =
    all.find((i) => i.to === pathname) ??
    [...all].sort((a, b) => b.to.length - a.to.length).find((i) => pathname.startsWith(i.to + '/')) ??
    all[0]
  const title = current.noPrefix
    ? current.title ?? current.label
    : `${cfg.prefix} / ${current.num ? current.num + ' ' : ''}${current.title ?? current.label}`

  const mainRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex h-full">
      <div className="hidden lg:block">
        <Sidebar cfg={cfg} />
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="h-full">
            <Sidebar cfg={cfg} onNavigate={() => setMobileOpen(false)} />
          </div>
          <div className="flex-1 bg-slate-900/40" onClick={() => setMobileOpen(false)}>
            <button className="m-3 rounded-lg bg-white p-2">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div ref={mainRef} className="scroll-thin flex h-full min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden">
            <Menu size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[17px] font-extrabold tracking-tight text-ink">{title}</h1>
            <p className="truncate text-[11px] text-muted">{current.subtitle}</p>
          </div>
          {cfg.headerBadge && (
            <span
              className={cn(
                'hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold sm:inline-flex',
                cfg.headerBadge.className,
              )}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', cfg.headerBadge.dot)} />
              {cfg.headerBadge.label}
            </span>
          )}
          {cfg.variant === 'light' && <Notifications items={cfg.notifications} />}
          <UserMenu cfg={cfg} />
        </header>

        <main className="w-full flex-1 p-4 sm:p-6">{children ?? <Outlet />}</main>
        {cfg.showFooter && <Footer />}
      </div>
    </div>
  )
}
