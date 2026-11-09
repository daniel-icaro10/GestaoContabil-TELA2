import { useState } from 'react'
import { Plus, File, Download, UploadCloud, Trash2 } from 'lucide-react'
import { Badge, Button, Card, PageTitle, SearchInput } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { cn, downloadFile, matches } from '../../lib/utils'
import { categoriasDoc, categoriaTotais, documentos as initial, type Doc } from './data'
import { UploadModal } from './shared'

function hoje() {
  return new Date().toLocaleDateString('pt-BR')
}

export default function Documentos() {
  const toast = useToast()
  const [docs, setDocs] = useState<Doc[]>(initial)
  const [cat, setCat] = useState<string>('Todos')
  const [q, setQ] = useState('')
  const [upload, setUpload] = useState(false)
  const [over, setOver] = useState(false)
  const [extra, setExtra] = useState<Record<string, number>>({})

  const addFiles = (files: File[], categoria = 'Outros') => {
    if (!files.length) return
    const novos: Doc[] = files.map((f, i) => ({
      id: Date.now() + i,
      nome: f.name.replace(/\.[^.]+$/, ''),
      categoria,
      data: hoje(),
      ext: (f.name.split('.').pop() ?? 'PDF').toUpperCase(),
      status: 'Pendente',
    }))
    setDocs((d) => [...novos, ...d])
    setExtra((e) => ({ ...e, [categoria]: (e[categoria] ?? 0) + files.length }))
    toast(`${files.length} documento(s) enviado(s) — aguardando revisão do contador`)
  }

  const total = (k: string) => (categoriaTotais[k] ?? 0) + (extra[k] ?? 0)
  const rows = docs.filter((d) => (cat === 'Todos' || d.categoria === cat) && matches(q, d.nome, d.categoria))

  return (
    <div className="max-w-[960px] space-y-5">
      <PageTitle
        title="Documentos"
        subtitle="Cofre pessoal de documentos"
        actions={
          <Button size="lg" icon={<Plus size={16} />} onClick={() => setUpload(true)}>
            Enviar documento
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <button
          onClick={() => setCat('Todos')}
          className={cn(
            'flex cursor-pointer items-center justify-between rounded-xl border px-3 py-3 text-left text-[12px] font-semibold transition',
            cat === 'Todos' ? 'border-slate-300 bg-slate-200/70 text-ink' : 'border-line bg-surface text-slate-600 hover:bg-slate-50',
          )}
        >
          Todos <span className="num text-slate-500">{docs.length}</span>
        </button>
        {categoriasDoc.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={cn(
              'flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left text-[12px] font-semibold transition',
              cat === c.key ? 'border-brand/40 bg-brand/10 text-brand' : 'border-line bg-surface text-slate-700 hover:bg-slate-50',
            )}
          >
            <span className="leading-tight">{c.key}</span>
            <span className={cn('num', c.tone)}>{total(c.key)}</span>
          </button>
        ))}
      </div>

      <SearchInput value={q} onChange={setQ} placeholder="Buscar documento..." className="[&_input]:h-10" />

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          addFiles(Array.from(e.dataTransfer.files), cat === 'Todos' ? 'Outros' : cat)
        }}
        className={cn(
          'flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-7 text-center transition',
          over ? 'border-brand bg-brand/5' : 'border-slate-200 bg-slate-50/50',
        )}
      >
        <UploadCloud size={20} className="text-slate-400" />
        <p className="mt-2 text-[13px] text-slate-500">
          Arraste arquivos aqui ou{' '}
          <button onClick={() => setUpload(true)} className="cursor-pointer font-semibold text-brand hover:underline">
            selecione
          </button>
        </p>
        <p className="mt-1 text-[11px] text-muted">PDF, PNG, JPG até 20 MB</p>
      </div>

      <Card>
        <div className="border-b border-line px-5 py-4">
          <p className="text-[14px] font-bold">{rows.length} documentos</p>
        </div>
        {rows.length === 0 && <p className="px-5 py-10 text-center text-[13px] text-muted">Nenhum documento encontrado.</p>}
        <div className="divide-y divide-line">
          {rows.map((d) => (
            <div key={d.id} className="flex items-center gap-3 px-5 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <File size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-ink">{d.nome}</p>
                <p className="text-[11px] text-muted">
                  {d.categoria} · <span className="num">{d.data}</span>
                </p>
              </div>
              <Badge tone="gray">{d.ext}</Badge>
              <Badge tone={d.status === 'Ok' ? 'green' : 'amber'}>{d.status}</Badge>
              <button
                title="Baixar"
                onClick={() => downloadFile(`${d.nome}.${d.ext.toLowerCase()}`)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-line text-brand hover:bg-brand/5"
              >
                <Download size={14} />
              </button>
              {d.status === 'Pendente' && (
                <button
                  title="Remover"
                  onClick={() => {
                    setDocs((all) => all.filter((x) => x.id !== d.id))
                    setExtra((e) => ({ ...e, [d.categoria]: Math.max(0, (e[d.categoria] ?? 0) - 1) }))
                    toast('Documento removido', 'info')
                  }}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-line text-slate-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <UploadModal open={upload} onClose={() => setUpload(false)} onUpload={addFiles} />
    </div>
  )
}
