export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function brl(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

/** Gera um arquivo de demonstração e dispara o download no navegador. */
export function downloadFile(filename: string, content?: string, mime = 'text/plain') {
  const body =
    content ??
    `HUBContábil Financial\n\nArquivo de demonstração: ${filename}\nGerado em: ${new Date().toLocaleString('pt-BR')}\n`
  const blob = new Blob([body], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Exporta linhas como CSV (abre no Excel). */
export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return downloadFile(filename, '')
  const headers = Object.keys(rows[0])
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [headers.join(';'), ...rows.map((r) => headers.map((h) => esc(r[h])).join(';'))].join('\n')
  downloadFile(filename, '﻿' + csv, 'text/csv;charset=utf-8')
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function matches(query: string, ...fields: (string | number | undefined)[]) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return fields.some((f) => String(f ?? '').toLowerCase().includes(q))
}
