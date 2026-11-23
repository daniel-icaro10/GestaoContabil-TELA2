import { cn } from '../lib/utils'

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect x="2" y="15" width="8" height="13" rx="4" fill="var(--secondary)" />
      <rect x="12" y="8" width="8" height="20" rx="4" fill="var(--primary)" />
      <rect x="22" y="3" width="8" height="25" rx="4" fill="var(--primary-hover)" />
    </svg>
  )
}

export function Logo({ dark, className }: { dark?: boolean; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LogoMark />
      <div className="leading-none">
        <p className={cn('text-[15px] tracking-tight', dark ? 'text-white' : 'text-ink')}>
          <span className="font-extrabold">HUB</span>
          <span className="font-medium">Contábil</span>
        </p>
        <p className={cn('mt-0.5 text-[8px] font-semibold tracking-[0.3em]', dark ? 'text-white/70' : 'text-muted')}>
          FINANCIAL
        </p>
      </div>
    </div>
  )
}
