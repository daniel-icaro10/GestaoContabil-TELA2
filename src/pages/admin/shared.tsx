import { cn } from '../../lib/utils'
import { Badge } from '../../components/ui'
import { planTone, type PlanName } from './data'

const letterCls = [
  'bg-violet-50 text-violet-500',
  'bg-indigo-50 text-indigo-500',
  'bg-sky-50 text-sky-500',
]

export function LetterBox({ name, size = 30, className }: { name: string; size?: number; className?: string }) {
  const letter = name.trim()[0]?.toUpperCase() ?? '?'
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-lg text-[11px] font-bold',
        letterCls[name.charCodeAt(0) % letterCls.length],
        className,
      )}
    >
      {letter}
    </div>
  )
}

export function PlanBadge({ plan }: { plan: PlanName }) {
  return (
    <Badge tone={planTone[plan]} className="rounded-md">
      {plan}
    </Badge>
  )
}
