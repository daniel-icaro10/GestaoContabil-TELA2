import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '../lib/utils'

type Theme = 'light' | 'dark'
const KEY = 'hub.theme'

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>(null!)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem(KEY, theme)
    } catch {}
  }, [theme])

  return (
    <ThemeCtx.Provider value={{ theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)

/** Botão de alternar modo claro / escuro */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      onClick={toggle}
      title={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      className={cn(
        'relative flex h-9 w-16 cursor-pointer items-center rounded-full border border-line bg-slate-100 p-1 transition',
        className,
      )}
    >
      <span
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-full bg-surface shadow-sm transition-all duration-300',
          dark ? 'translate-x-7 text-violet-400' : 'translate-x-0 text-amber-500',
        )}
      >
        {dark ? <Moon size={14} /> : <Sun size={14} />}
      </span>
    </button>
  )
}
