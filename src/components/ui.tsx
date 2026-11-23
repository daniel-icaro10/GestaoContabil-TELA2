import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Inbox,
  Info,
  Loader2,
  RotateCw,
  Search,
  UploadCloud,
  X,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../lib/utils'

/* ============================================================
   Componentes base do HUBContábil.
   Todas as cores vêm dos tokens em src/index.css.
   ============================================================ */

/* ---------------- Card ---------------- */
export function Card({
  className,
  children,
  onClick,
  as: Tag = 'div',
}: {
  className?: string
  children: ReactNode
  onClick?: () => void
  as?: 'div' | 'section' | 'article'
}) {
  const interactive = !!onClick
  return (
    <Tag
      onClick={onClick}
      onKeyDown={interactive ? (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onClick()) : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        'rounded-xl border border-line bg-surface shadow-card',
        interactive && 'cursor-pointer transition-colors hover:border-primary/40',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({
  title,
  subtitle,
  right,
  className,
}: {
  title: ReactNode
  subtitle?: ReactNode
  right?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-3 px-5 pt-5 pb-3', className)}>
      <div className="min-w-0">
        <h3 className="text-title-3 text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-label text-muted">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

/* ---------------- Badge ---------------- */
/** Tons semânticos. Os nomes antigos (green, amber...) continuam aceitos. */
export type Tone =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'primary'
  // legado
  | 'green'
  | 'amber'
  | 'red'
  | 'blue'
  | 'violet'
  | 'sky'
  | 'gray'
  | 'brand'

type SemanticTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary'

const toneAlias: Record<Tone, SemanticTone> = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
  neutral: 'neutral',
  primary: 'primary',
  green: 'success',
  amber: 'warning',
  red: 'danger',
  blue: 'primary',
  brand: 'primary',
  violet: 'info',
  sky: 'info',
  gray: 'neutral',
}

const toneCls: Record<SemanticTone, string> = {
  success: 'bg-success/10 text-success-text border-success/25',
  warning: 'bg-warning/10 text-warning-text border-warning/25',
  danger: 'bg-danger/10 text-danger-text border-danger/25',
  info: 'bg-secondary/12 text-info-text border-secondary/30',
  neutral: 'bg-surface-alt text-subtle border-line',
  primary: 'bg-primary-soft text-primary-text border-primary/25',
}

const dotCls: Record<SemanticTone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-secondary',
  neutral: 'bg-muted',
  primary: 'bg-primary',
}

/** Ícone padrão de cada status: status nunca é comunicado só pela cor. */
const toneIcon: Partial<Record<SemanticTone, LucideIcon>> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
  info: Info,
}

export function Badge({
  tone = 'neutral',
  dot,
  icon,
  children,
  className,
}: {
  tone?: Tone
  dot?: boolean
  /** Ícone customizado; `false` remove o ícone padrão do status. */
  icon?: ReactNode | false
  children: ReactNode
  className?: string
}) {
  const t = toneAlias[tone]
  const DefaultIcon = toneIcon[t]
  const iconNode =
    icon === false ? null : icon !== undefined ? icon : dot ? null : DefaultIcon ? <DefaultIcon size={13} aria-hidden /> : null
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-label font-medium',
        toneCls[t],
        className,
      )}
    >
      {dot && <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full', dotCls[t])} />}
      {iconNode}
      {children}
    </span>
  )
}

export function Dot({ tone = 'neutral', className }: { tone?: Tone; className?: string }) {
  return <span aria-hidden className={cn('inline-block h-2 w-2 shrink-0 rounded-full', dotCls[toneAlias[tone]], className)} />
}

/** Código de tributo (DAS, FGTS...) estilo "tag" */
export function CodeTag({ children, tone = 'primary' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={cn('inline-flex rounded-md border px-1.5 py-0.5 text-[11px] font-semibold tracking-wide', toneCls[toneAlias[tone]])}>
      {children}
    </span>
  )
}

/* ---------------- Spinner ---------------- */
export function Spinner({ size = 16, className, label = 'Carregando' }: { size?: number; className?: string; label?: string }) {
  return <Loader2 size={size} className={cn('animate-spin', className)} role="status" aria-label={label} />
}

/* ---------------- Button ---------------- */
type BtnVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft' | 'danger' | 'success' | 'warning' | 'dangerOutline'

const btnCls: Record<BtnVariant, string> = {
  primary: 'bg-primary-solid text-white hover:bg-primary-hover',
  secondary: 'bg-surface text-ink border border-line hover:bg-surface-alt',
  outline: 'bg-surface text-primary-text border border-primary/50 hover:bg-primary-soft',
  soft: 'bg-primary-soft text-primary-text hover:bg-primary/15',
  ghost: 'text-subtle hover:bg-surface-alt hover:text-ink',
  danger: 'bg-danger-solid text-white hover:brightness-90',
  dangerOutline: 'bg-surface text-danger-text border border-danger/40 hover:bg-danger/10',
  success: 'bg-success-solid text-white hover:brightness-90',
  warning: 'bg-warning-solid text-white hover:brightness-90',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  loading?: boolean
}) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' && 'h-8 px-3 text-label pointer-coarse:h-10',
        size === 'md' && 'h-10 px-4 text-body',
        size === 'lg' && 'h-11 px-5 text-body',
        btnCls[variant],
        className,
      )}
    >
      {loading ? <Spinner size={16} label="Processando" /> : icon}
      {children}
    </button>
  )
}

/* ---------------- Tooltip ---------------- */
/** Tooltip leve em CSS: aparece no hover e no foco do teclado. */
export function Tooltip({
  label,
  children,
  side = 'top',
  className,
}: {
  label: ReactNode
  children: ReactNode
  side?: 'top' | 'bottom'
  className?: string
}) {
  return (
    <span className={cn('group/tt relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-label font-medium text-surface opacity-0 shadow-card transition-opacity delay-150',
          'group-hover/tt:opacity-100 group-focus-within/tt:opacity-100',
          side === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
        )}
      >
        {label}
      </span>
    </span>
  )
}

/**
 * Botão só com ícone. `label` (ou `title`, legado) vira aria-label e tooltip.
 */
export function IconButton({
  children,
  className,
  label,
  title,
  onClick,
  variant = 'outline',
  disabled,
  tooltip = true,
}: {
  children: ReactNode
  className?: string
  label?: string
  title?: string
  onClick?: () => void
  variant?: 'outline' | 'ghost'
  disabled?: boolean
  tooltip?: boolean
}) {
  const text = label ?? title ?? ''
  const btn = (
    <button
      type="button"
      aria-label={text}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-subtle transition-colors hover:text-primary-text disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:h-10 pointer-coarse:w-10',
        variant === 'outline' ? 'border border-line bg-surface hover:bg-surface-alt' : 'hover:bg-surface-alt',
        className,
      )}
    >
      {children}
    </button>
  )
  return tooltip && text ? <Tooltip label={text}>{btn}</Tooltip> : btn
}

/* ---------------- Tabs ---------------- */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { value: T; label: ReactNode }[]
  value: T
  onChange: (v: T) => void
  className?: string
}) {
  return (
    <div role="tablist" className={cn('scroll-thin flex gap-1 overflow-x-auto border-b border-line', className)}>
      {tabs.map((t) => {
        const active = value === t.value
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cn(
              '-mb-px h-10 cursor-pointer whitespace-nowrap border-b-2 px-3 text-body font-medium transition-colors',
              active ? 'border-primary text-primary-text font-semibold' : 'border-transparent text-muted hover:text-ink',
            )}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

/** Filtros em formato de "chips" (Todos / Pagas / Pendentes ...) */
export function Chips<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: ReactNode }[]
  value: T
  onChange: (v: T) => void
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((o) => {
        const active = value === o.value
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'h-8 cursor-pointer rounded-lg border px-3 text-label font-medium transition-colors pointer-coarse:h-10',
              active
                ? 'border-primary/40 bg-primary-soft text-primary-text font-semibold'
                : 'border-line bg-surface text-subtle hover:bg-surface-alt',
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/* ---------------- Inputs ---------------- */
const controlCls =
  'w-full rounded-lg border border-line bg-surface px-3 text-body text-ink transition-colors placeholder:text-muted hover:border-muted/60 focus:border-primary disabled:cursor-not-allowed disabled:bg-surface-alt disabled:text-muted aria-[invalid=true]:border-danger'

export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar...',
  className,
  label,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
  label?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <Search size={16} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        aria-label={label ?? placeholder}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(controlCls, 'h-10 pl-9')}
      />
    </div>
  )
}

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-label font-medium text-subtle">
        {label}
        {required && (
          <span className="ml-0.5 text-danger-text" aria-hidden>
            *
          </span>
        )}
      </span>
      {children}
      {error ? (
        <span role="alert" className="mt-1.5 flex items-center gap-1 text-label text-danger-text">
          <AlertCircle size={13} aria-hidden />
          {error}
        </span>
      ) : (
        hint && <span className="mt-1.5 block text-label text-muted">{hint}</span>
      )}
    </label>
  )
}

export function Input({ invalid, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input {...props} aria-invalid={invalid || props['aria-invalid'] || undefined} className={cn(controlCls, 'h-10', className)} />
}

export function Textarea({ invalid, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      {...props}
      aria-invalid={invalid || props['aria-invalid'] || undefined}
      className={cn(controlCls, 'min-h-24 py-2.5', className)}
    />
  )
}

export function Select({
  value,
  onChange,
  options,
  className,
  label,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[] | string[]
  className?: string
  label?: string
}) {
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
  return (
    <select
      value={value}
      aria-label={label}
      onChange={(e) => onChange(e.target.value)}
      className={cn(controlCls, 'h-10 w-auto cursor-pointer pr-8', className)}
    >
      {opts.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

/** Campo somente leitura usado nas telas de cadastro */
export function ReadField({ label, value, className }: { label: string; value: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="mb-1.5 text-label font-medium text-muted">{label}</p>
      <div className="rounded-lg border border-line bg-surface-alt px-3 py-2.5 text-body font-medium text-ink">{value}</div>
    </div>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        // after: amplia a área de toque para 40px sem mudar o visual
        'relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors after:absolute after:-inset-x-1 after:-inset-y-2.5',
        checked ? 'bg-primary-solid' : 'bg-line',
      )}
    >
      <span
        className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-card transition-all', checked ? 'left-[18px]' : 'left-0.5')}
      />
    </button>
  )
}

/* ---------------- Progress / Avatar ---------------- */
export function Progress({
  value,
  color = 'bg-primary',
  className,
  label,
}: {
  value: number
  color?: string
  className?: string
  label?: string
}) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-surface-alt', className)}
    >
      <div className={cn('h-full rounded-full transition-[width] duration-300', color)} style={{ width: `${v}%` }} />
    </div>
  )
}

const avatarTones = ['bg-primary-soft text-primary-text', 'bg-secondary/15 text-info-text', 'bg-surface-alt text-subtle']

export function Avatar({
  text,
  size = 36,
  gradient,
  className,
  tone,
}: {
  text: string
  size?: number
  /** legado: avatar sólido na cor primária */
  gradient?: boolean
  className?: string
  tone?: number
}) {
  const idx = (tone ?? text.charCodeAt(0)) % avatarTones.length
  return (
    <div
      aria-hidden
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.36) }}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold',
        gradient ? 'bg-primary-solid text-white' : avatarTones[idx],
        className,
      )}
    >
      {text}
    </div>
  )
}

/* ---------------- Stat card ---------------- */
export function StatCard({
  label,
  value,
  sub,
  badge,
  progress,
  progressColor,
  valueClass,
  icon,
  children,
  className,
}: {
  label: ReactNode
  value: ReactNode
  sub?: ReactNode
  badge?: ReactNode
  progress?: number
  progressColor?: string
  valueClass?: string
  icon?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-label font-medium text-muted">{label}</p>
        {badge}
        {icon && <span className="text-secondary">{icon}</span>}
      </div>
      <p className={cn('num mt-2 text-title-1 text-ink', valueClass)}>{value}</p>
      {sub && <p className="mt-1 text-label text-muted">{sub}</p>}
      {progress !== undefined && <Progress value={progress} color={progressColor} className="mt-4" />}
      {children}
    </Card>
  )
}

/* ---------------- Skeleton / Empty / Error ---------------- */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('animate-pulse rounded-md bg-surface-alt', className)} />
}

/** Bloco de linhas de texto em skeleton */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  )
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-10 text-center', className)}>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-alt text-secondary">
        <Icon size={22} aria-hidden />
      </div>
      <p className="text-title-3 text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-body text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function ErrorState({
  title = 'Não foi possível carregar',
  message = 'Verifique sua conexão e tente novamente.',
  onRetry,
  className,
}: {
  title?: ReactNode
  message?: ReactNode
  onRetry?: () => void
  className?: string
}) {
  return (
    <div role="alert" className={cn('flex flex-col items-center justify-center px-6 py-10 text-center', className)}>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger-text">
        <AlertTriangle size={22} aria-hidden />
      </div>
      <p className="text-title-3 text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-body text-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-4" icon={<RotateCw size={16} />} onClick={onRetry}>
          Tentar de novo
        </Button>
      )}
    </div>
  )
}

/* ---------------- Table ---------------- */
type Align = 'left' | 'right' | 'center'

const alignCls: Record<Align, string> = { left: 'text-left', right: 'text-right', center: 'text-center' }

/**
 * Tabela padrão. Cabeçalho em superfície alternativa, linhas com hover.
 * Estados: `loading` (skeleton), `error` (+ onRetry) e `empty` (quando não há linhas).
 * Por padrão a última coluna (ações) fica à direita; use `align` para controlar cada coluna.
 */
export function Table({
  head,
  children,
  className,
  align,
  caption,
  loading,
  skeletonRows = 5,
  error,
  onRetry,
  empty,
  minWidth = 720,
}: {
  head: ReactNode[]
  children?: ReactNode
  className?: string
  align?: Align[]
  caption?: string
  loading?: boolean
  skeletonRows?: number
  error?: boolean | string
  onRetry?: () => void
  /** Conteúdo exibido quando `children` está vazio (use <EmptyState/>). */
  empty?: ReactNode
  minWidth?: number
}) {
  const cols = head.length
  const colAlign = (i: number): Align => align?.[i] ?? (i === cols - 1 ? 'right' : 'left')
  const hasRows = Array.isArray(children) ? children.flat().some(Boolean) : !!children

  let body: ReactNode = children
  if (loading) {
    body = Array.from({ length: skeletonRows }).map((_, r) => (
      <tr key={r}>
        {head.map((_, c) => (
          <td key={c} className="px-4 py-3.5">
            <Skeleton className={cn('h-4', c === 0 ? 'w-3/4' : 'w-1/2', colAlign(c) === 'right' && 'ml-auto')} />
          </td>
        ))}
      </tr>
    ))
  } else if (error) {
    body = (
      <tr>
        <td colSpan={cols}>
          <ErrorState message={typeof error === 'string' ? error : undefined} onRetry={onRetry} />
        </td>
      </tr>
    )
  } else if (!hasRows && empty) {
    body = (
      <tr>
        <td colSpan={cols}>{empty}</td>
      </tr>
    )
  }

  return (
    <div className={cn('scroll-thin overflow-x-auto', className)} aria-busy={loading || undefined}>
      <table className="w-full border-collapse" style={{ minWidth }}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="border-y border-line bg-surface-alt">
            {head.map((h, i) => (
              <th key={i} scope="col" className={cn('px-4 py-2.5 text-label font-semibold text-subtle', alignCls[colAlign(i)])}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={cn(
            'divide-y divide-line',
            !loading && !error && hasRows && '[&>tr]:transition-colors [&>tr:hover]:bg-primary-soft/60',
          )}
        >
          {body}
        </tbody>
      </table>
    </div>
  )
}

export function Td({
  children,
  className,
  right,
  align,
  num,
}: {
  children?: ReactNode
  className?: string
  /** legado: alinha à direita */
  right?: boolean
  align?: Align
  /** valor numérico/monetário: alinhado à direita com algarismos tabulares */
  num?: boolean
}) {
  const a: Align = align ?? (right || num ? 'right' : 'left')
  return <td className={cn('px-4 py-3 text-body text-ink', alignCls[a], num && 'num whitespace-nowrap', className)}>{children}</td>
}

/** Ações de linha (ícones com tooltip) alinhadas à direita */
export function RowActions({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-end gap-1">{children}</div>
}

export function EmptyRow({ cols, text = 'Nenhum registro encontrado.' }: { cols: number; text?: string }) {
  return (
    <tr>
      <td colSpan={cols}>
        <EmptyState title={text} />
      </td>
    </tr>
  )
}

/* ---------------- Modal ---------------- */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'max-w-lg',
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  footer?: ReactNode
  width?: string
}) {
  const titleId = useId()
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="animate-fade fixed inset-0 z-50 flex items-end justify-center bg-overlay p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'animate-page flex max-h-[92vh] w-full flex-col rounded-t-xl border border-line bg-surface shadow-xl outline-none sm:rounded-xl',
          width,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-title-2 text-ink">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-body text-muted">{subtitle}</p>}
          </div>
          <IconButton label="Fechar" variant="ghost" tooltip={false} onClick={onClose}>
            <X size={18} />
          </IconButton>
        </div>
        <div className="scroll-thin flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4 sm:px-6">{footer}</div>}
      </div>
    </div>
  )
}

/** Linha "rótulo: valor" usada dentro de modais de detalhes */
export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-2.5 last:border-0">
      <span className="text-body text-muted">{label}</span>
      <span className="text-right text-body font-semibold text-ink">{value}</span>
    </div>
  )
}

/* ---------------- Banner ---------------- */
export function Banner({
  tone = 'brand',
  icon,
  title,
  text,
  action,
  onClose,
}: {
  tone?: 'brand' | 'primary' | 'green' | 'success' | 'amber' | 'warning' | 'red' | 'danger' | 'sky' | 'info'
  icon?: ReactNode
  title: ReactNode
  text?: ReactNode
  action?: ReactNode
  onClose?: () => void
}) {
  const t = toneAlias[tone as Tone]
  const cls: Record<SemanticTone, string> = {
    primary: 'bg-primary-soft border-primary/25',
    success: 'bg-success/8 border-success/30',
    warning: 'bg-warning/8 border-warning/30',
    danger: 'bg-danger/8 border-danger/30',
    info: 'bg-secondary/10 border-secondary/30',
    neutral: 'bg-surface-alt border-line',
  }
  const iconCls: Record<SemanticTone, string> = {
    primary: 'bg-primary/12 text-primary-text',
    success: 'bg-success/15 text-success-text',
    warning: 'bg-warning/15 text-warning-text',
    danger: 'bg-danger/15 text-danger-text',
    info: 'bg-secondary/20 text-info-text',
    neutral: 'bg-surface text-subtle',
  }
  return (
    <div className={cn('flex flex-wrap items-center gap-4 rounded-xl border px-4 py-3.5 sm:px-5', cls[t])}>
      {icon && <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', iconCls[t])}>{icon}</div>}
      <div className="min-w-0 flex-1">
        <p className="text-body font-semibold text-ink">{title}</p>
        {text && <p className="mt-0.5 text-body text-muted">{text}</p>}
      </div>
      {action}
      {onClose && (
        <IconButton label="Dispensar" variant="ghost" tooltip={false} onClick={onClose}>
          <X size={18} />
        </IconButton>
      )}
    </div>
  )
}

/* ---------------- Upload ---------------- */
export function Dropzone({
  title,
  hint,
  onFiles,
  button,
  compact,
  accept,
  multiple = true,
}: {
  title: ReactNode
  hint?: ReactNode
  onFiles: (files: File[]) => void
  button?: string
  compact?: boolean
  accept?: string
  multiple?: boolean
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const open = () => ref.current?.click()
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        onFiles(Array.from(e.dataTransfer.files))
      }}
      onClick={() => !button && open()}
      onKeyDown={(e) => !button && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open())}
      role={button ? undefined : 'button'}
      tabIndex={button ? undefined : 0}
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border-2 border-dashed text-center transition-colors',
        compact ? 'px-6 py-6' : 'px-6 py-10',
        over ? 'border-primary bg-primary-soft' : 'border-line bg-surface',
        !button && 'cursor-pointer hover:border-primary/50 hover:bg-primary-soft/50',
      )}
    >
      {!compact && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary-text">
          <UploadCloud size={22} aria-hidden />
        </div>
      )}
      <p className="text-body font-semibold text-ink">{title}</p>
      {hint && <p className="mt-1 text-label text-muted">{hint}</p>}
      {button && (
        <Button variant="soft" className="mt-4" onClick={open}>
          {button}
        </Button>
      )}
      <input
        ref={ref}
        type="file"
        multiple={multiple}
        accept={accept}
        hidden
        onChange={(e) => {
          onFiles(Array.from(e.target.files ?? []))
          e.target.value = ''
        }}
      />
    </div>
  )
}

/** Cabeçalho de página (título + subtítulo + ações à direita) */
export function PageTitle({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-title-1 text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-body text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

/** Mini-gráfico de barras usado nos cards */
export function MiniBars({ values, highlight = 2 }: { values: number[]; highlight?: number }) {
  const max = Math.max(...values, 1)
  return (
    <div className="mt-4 flex h-8 items-end gap-1.5" aria-hidden>
      {values.map((v, i) => (
        <div
          key={i}
          className={cn('flex-1 rounded-sm', i >= values.length - highlight ? 'bg-primary' : 'bg-secondary/35')}
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  )
}
