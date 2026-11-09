import { useEffect, useRef, useState, type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes } from 'react'
import { Search, X, UploadCloud } from 'lucide-react'
import { cn } from '../lib/utils'

/* ---------------- Card ---------------- */
export function Card({ className, children, onClick }: { className?: string; children: ReactNode; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn('rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]', className)}
    >
      {children}
    </div>
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
    <div className={cn('flex items-start justify-between gap-3 px-5 pt-5 pb-3', className)}>
      <div>
        <h3 className="text-[15px] font-bold text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}

/* ---------------- Badge ---------------- */
export type Tone = 'green' | 'amber' | 'red' | 'blue' | 'violet' | 'sky' | 'gray' | 'brand'

const toneCls: Record<Tone, string> = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  red: 'bg-red-50 text-red-600 border-red-100',
  blue: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  violet: 'bg-violet-50 text-violet-600 border-violet-100',
  sky: 'bg-sky-50 text-sky-600 border-sky-100',
  gray: 'bg-slate-100 text-slate-500 border-slate-200',
  brand: 'bg-brand/10 text-brand border-brand/20',
}

const dotCls: Record<Tone, string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  blue: 'bg-indigo-500',
  violet: 'bg-violet-500',
  sky: 'bg-sky-500',
  gray: 'bg-slate-400',
  brand: 'bg-brand',
}

export function Badge({
  tone = 'gray',
  dot,
  children,
  className,
}: {
  tone?: Tone
  dot?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
        toneCls[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotCls[tone])} />}
      {children}
    </span>
  )
}

export function Dot({ tone = 'gray', className }: { tone?: Tone; className?: string }) {
  return <span className={cn('inline-block h-2 w-2 shrink-0 rounded-full', dotCls[tone], className)} />
}

/** Código de tributo (DAS, FGTS...) estilo "tag" */
export function CodeTag({ children, tone = 'blue' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={cn('inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wide', toneCls[tone])}>
      {children}
    </span>
  )
}

/* ---------------- Button ---------------- */
type BtnVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft' | 'danger' | 'success' | 'warning' | 'dangerOutline'

const btnCls: Record<BtnVariant, string> = {
  primary: 'bg-brand text-white hover:brightness-110 shadow-sm',
  secondary: 'bg-white text-ink border border-line hover:bg-slate-50',
  outline: 'bg-white text-brand border border-brand/30 hover:bg-brand/5',
  soft: 'bg-brand/10 text-brand border border-brand/20 hover:bg-brand/15',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  dangerOutline: 'bg-white text-red-500 border border-red-200 hover:bg-red-50',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  warning: 'bg-amber-600 text-white hover:bg-amber-700',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
}) {
  return (
    <button
      {...rest}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' && 'h-8 px-3 text-xs',
        size === 'md' && 'h-9 px-4 text-[13px]',
        size === 'lg' && 'h-11 px-5 text-sm',
        btnCls[variant],
        className,
      )}
    >
      {icon}
      {children}
    </button>
  )
}

export function IconButton({
  children,
  className,
  title,
  onClick,
}: {
  children: ReactNode
  className?: string
  title?: string
  onClick?: () => void
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={cn(
        'inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-line bg-white text-slate-500 transition hover:bg-slate-50 hover:text-brand',
        className,
      )}
    >
      {children}
    </button>
  )
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
    <div className={cn('flex gap-1 overflow-x-auto border-b border-line', className)}>
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            '-mb-px cursor-pointer whitespace-nowrap border-b-2 px-3 py-2.5 text-[13px] font-medium transition',
            value === t.value ? 'border-brand text-brand font-semibold' : 'border-transparent text-slate-500 hover:text-ink',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/** Filtros em formato de "chips" (Todos / Ativo / Teste ...) */
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
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'h-8 cursor-pointer rounded-lg border px-3 text-xs font-medium transition',
            value === o.value
              ? 'border-brand/40 bg-brand/10 text-brand font-semibold'
              : 'border-line bg-white text-slate-600 hover:bg-slate-50',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/* ---------------- Inputs ---------------- */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar...',
  className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-[13px] outline-none placeholder:text-muted focus:border-brand/50 focus:ring-2 focus:ring-brand/10"
      />
    </div>
  )
}

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-muted">{hint}</span>}
    </label>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'h-10 w-full rounded-lg border border-line bg-slate-50/60 px-3 text-[13px] text-ink outline-none placeholder:text-muted focus:border-brand/50 focus:bg-white focus:ring-2 focus:ring-brand/10',
        props.className,
      )}
    />
  )
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'min-h-20 w-full rounded-lg border border-line bg-slate-50/60 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-muted focus:border-brand/50 focus:bg-white focus:ring-2 focus:ring-brand/10',
        props.className,
      )}
    />
  )
}

export function Select({
  value,
  onChange,
  options,
  className,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[] | string[]
  className?: string
}) {
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'h-9 cursor-pointer rounded-lg border border-line bg-white px-3 text-[13px] text-ink outline-none focus:border-brand/50',
        className,
      )}
    >
      {opts.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

/** Campo somente leitura usado nas telas de cadastro (Dados da Empresa / Dados Pessoais) */
export function ReadField({ label, value, className }: { label: string; value: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted">{label}</p>
      <div className="rounded-lg border border-line bg-slate-50/70 px-3 py-2.5 text-[13px] font-medium text-ink">{value}</div>
    </div>
  )
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition',
        checked ? 'bg-brand' : 'bg-slate-200',
      )}
    >
      <span
        className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all', checked ? 'left-[18px]' : 'left-0.5')}
      />
    </button>
  )
}

/* ---------------- Progress / Avatar ---------------- */
export function Progress({ value, color = 'bg-brand', className }: { value: number; color?: string; className?: string }) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-slate-100', className)}>
      <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  )
}

const avatarTones = [
  'bg-indigo-100 text-indigo-600',
  'bg-violet-100 text-violet-600',
  'bg-sky-100 text-sky-600',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-600',
]

export function Avatar({
  text,
  size = 36,
  gradient,
  className,
  tone,
}: {
  text: string
  size?: number
  gradient?: boolean
  className?: string
  tone?: number
}) {
  const idx = tone ?? text.charCodeAt(0) % avatarTones.length
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.33 }}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-bold',
        gradient ? 'bg-gradient-to-br from-brand to-violet-500 text-white' : avatarTones[idx],
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
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {badge}
        {icon}
      </div>
      <p className={cn('num mt-3 text-[26px] leading-tight text-ink', valueClass)}>{value}</p>
      {sub && <p className="mt-1.5 text-xs text-muted">{sub}</p>}
      {progress !== undefined && <Progress value={progress} color={progressColor} className="mt-4" />}
      {children}
    </Card>
  )
}

/* ---------------- Table ---------------- */
export function Table({ head, children, className }: { head: ReactNode[]; children: ReactNode; className?: string }) {
  return (
    <div className={cn('scroll-thin overflow-x-auto', className)}>
      <table className="w-full min-w-[720px] text-left">
        <thead>
          <tr className="border-y border-line bg-slate-50/70">
            {head.map((h, i) => (
              <th
                key={i}
                className={cn(
                  'px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted',
                  i === head.length - 1 && 'text-right',
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  )
}

export function Td({ children, className, right }: { children?: ReactNode; className?: string; right?: boolean }) {
  return <td className={cn('px-5 py-3.5 text-[13px] text-slate-600', right && 'text-right', className)}>{children}</td>
}

export function EmptyRow({ cols, text = 'Nenhum registro encontrado.' }: { cols: number; text?: string }) {
  return (
    <tr>
      <td colSpan={cols} className="px-5 py-10 text-center text-[13px] text-muted">
        {text}
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
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="animate-fade fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn('flex max-h-[90vh] w-full flex-col rounded-2xl bg-white shadow-2xl', width)}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-ink">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-1 text-muted hover:bg-slate-100 hover:text-ink">
            <X size={18} />
          </button>
        </div>
        <div className="scroll-thin flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-line px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}

/** Linha "rótulo: valor" usada dentro de modais de detalhes */
export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-2.5 last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-right text-[13px] font-semibold text-ink">{value}</span>
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
  tone?: 'brand' | 'green' | 'amber' | 'red' | 'sky'
  icon?: ReactNode
  title: ReactNode
  text?: ReactNode
  action?: ReactNode
  onClose?: () => void
}) {
  const cls = {
    brand: 'bg-brand/5 border-brand/20',
    green: 'bg-emerald-50 border-emerald-200',
    amber: 'bg-amber-50 border-amber-200',
    red: 'bg-red-50 border-red-200',
    sky: 'bg-sky-50 border-sky-200',
  }[tone]
  const iconCls = {
    brand: 'bg-brand/10 text-brand',
    green: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-500',
    sky: 'bg-sky-100 text-sky-600',
  }[tone]
  return (
    <div className={cn('flex flex-wrap items-center gap-4 rounded-2xl border px-5 py-3.5', cls)}>
      {icon && <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', iconCls)}>{icon}</div>}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold text-ink">{title}</p>
        {text && <p className="mt-0.5 text-xs text-slate-500">{text}</p>}
      </div>
      {action}
      {onClose && (
        <button onClick={onClose} className="cursor-pointer text-slate-400 hover:text-ink">
          <X size={18} />
        </button>
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
}: {
  title: ReactNode
  hint?: ReactNode
  onFiles: (files: File[]) => void
  button?: string
  compact?: boolean
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
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
      onClick={() => !button && ref.current?.click()}
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition',
        compact ? 'px-6 py-6' : 'px-6 py-10',
        over ? 'border-brand bg-brand/5' : 'border-slate-200 bg-white',
        !button && 'cursor-pointer hover:border-brand/40',
      )}
    >
      {!compact && (
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <UploadCloud size={20} />
        </div>
      )}
      <p className="text-sm font-bold text-ink">{title}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {button && (
        <Button variant="soft" className="mt-4" onClick={() => ref.current?.click()}>
          {button}
        </Button>
      )}
      <input
        ref={ref}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          onFiles(Array.from(e.target.files ?? []))
          e.target.value = ''
        }}
      />
    </div>
  )
}

/** Cabeçalho de seção de página (título + subtítulo + ações à direita) */
export function PageTitle({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

/** Mini-gráfico de barras usado nos cards (Notas Fiscais etc.) */
export function MiniBars({ values, highlight = 2 }: { values: number[]; highlight?: number }) {
  const max = Math.max(...values)
  return (
    <div className="mt-4 flex h-8 items-end gap-1.5">
      {values.map((v, i) => (
        <div
          key={i}
          className={cn('flex-1 rounded-sm', i >= values.length - highlight ? 'bg-brand' : 'bg-slate-200')}
          style={{ height: `${(v / max) * 100}%`, opacity: i >= values.length - highlight ? 0.55 + (0.45 * (i - (values.length - highlight) + 1)) / highlight : 1 }}
        />
      ))}
    </div>
  )
}
