import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

/** Cor oficial da Premium Contabilidade — padrão do portal. */
export const DEFAULT_BRAND = '#005690'
/** Padrão anterior do protótipo; quem nunca trocou a cor migra para o novo padrão. */
const LEGACY_DEFAULT = '#3b4fd8'

export const BRAND_COLORS = [
  { name: 'Azul Premium', hex: DEFAULT_BRAND },
  { name: 'Verde Esmeralda', hex: '#3f8f63' },
  { name: 'Violeta Tech', hex: '#7c4ddb' },
  { name: 'Âmbar Solar', hex: '#a8620f' },
  { name: 'Azul Royal', hex: '#3b4fd8' },
]

type BrandState = {
  color: string
  setColor: (c: string) => void
  officeName: string
  setOfficeName: (n: string) => void
}

const BrandCtx = createContext<BrandState>(null!)

function load(key: string, fallback: string) {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

/**
 * Para a cor padrão usamos os tons definidos no guia (index.css).
 * Para cores white-label, derivamos hover e as variações do tema escuro.
 */
function applyBrand(color: string) {
  const s = document.documentElement.style
  const custom = color.toLowerCase() !== DEFAULT_BRAND
  s.setProperty('--brand', color)
  const derived: Record<string, string> = {
    '--brand-hover': `color-mix(in oklab, ${color} 85%, black)`,
    '--brand-dark': `color-mix(in oklab, ${color} 75%, white)`,
    '--brand-dark-hover': `color-mix(in oklab, ${color} 85%, black)`,
    '--brand-dark-solid': color,
    '--brand-dark-text': `color-mix(in oklab, ${color} 50%, white)`,
  }
  for (const [k, v] of Object.entries(derived)) {
    if (custom) s.setProperty(k, v)
    else s.removeProperty(k)
  }
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState(() => {
    const saved = load('hub.brand', DEFAULT_BRAND)
    return saved.toLowerCase() === LEGACY_DEFAULT ? DEFAULT_BRAND : saved
  })
  const [officeName, setOfficeName] = useState(() => load('hub.office', 'Premium Contabilidade'))

  useEffect(() => {
    applyBrand(color)
    try {
      localStorage.setItem('hub.brand', color)
    } catch {}
  }, [color])

  useEffect(() => {
    try {
      localStorage.setItem('hub.office', officeName)
    } catch {}
  }, [officeName])

  return <BrandCtx.Provider value={{ color, setColor, officeName, setOfficeName }}>{children}</BrandCtx.Provider>
}

export const useBrand = () => useContext(BrandCtx)
