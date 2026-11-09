import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '../lib/utils'

type ToastKind = 'success' | 'info' | 'warning'
type Toast = { id: number; message: string; kind: ToastKind }

const ToastCtx = createContext<(message: string, kind?: ToastKind) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map((t) => {
          const Icon = t.kind === 'success' ? CheckCircle2 : t.kind === 'warning' ? AlertTriangle : Info
          return (
            <div
              key={t.id}
              className="animate-toast flex min-w-72 max-w-sm items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-lg"
            >
              <Icon
                size={18}
                className={cn(
                  'mt-0.5 shrink-0',
                  t.kind === 'success' && 'text-emerald-500',
                  t.kind === 'info' && 'text-brand',
                  t.kind === 'warning' && 'text-amber-500',
                )}
              />
              <p className="flex-1 text-[13px] text-ink">{t.message}</p>
              <button
                onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
                className="text-muted hover:text-ink"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
