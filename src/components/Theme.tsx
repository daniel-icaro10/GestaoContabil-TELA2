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
  return 'light' // tema claro é o padrão; o escuro é opcional
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
      aria-pressed={dark}
      className={cn(
        'relative flex h-10 w-[68px] cursor-pointer items-center rounded-full border border-line bg-surface-alt p-1 transition',
        className,
      )}
    >
      <span
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full bg-surface shadow-card transition-transform duration-300',
          dark ? 'translate-x-7 text-primary-text' : 'translate-x-0 text-warning',
        )}
      >
        {dark ? <Moon size={14} /> : <Sun size={14} />}
      </span>
    </button>
  )
}
