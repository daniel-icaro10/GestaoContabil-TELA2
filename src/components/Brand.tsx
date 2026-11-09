import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export const BRAND_COLORS = [
  { name: 'Azul Royal', hex: '#3b4fd8' },
  { name: 'Verde Esmeralda', hex: '#3f8f63' },
  { name: 'Violeta Tech', hex: '#8b5cf6' },
  { name: 'Âmbar Solar', hex: '#c97a1a' },
  { name: 'Ciano Elétrico', hex: '#3b82c4' },
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

export function BrandProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState(() => load('hub.brand', '#3b4fd8'))
  const [officeName, setOfficeName] = useState(() => load('hub.office', 'HubContábil Financial & Gestão'))

  useEffect(() => {
    document.documentElement.style.setProperty('--brand', color)
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
