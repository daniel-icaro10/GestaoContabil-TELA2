import { useMemo, useState } from 'react'
import { Plus, FileText, FileSpreadsheet, Landmark, Users, Coins, Building, Receipt, ScrollText } from 'lucide-react'
import { Badge, Button, Card, Chips, Dropzone, Field, Modal, PageTitle, SearchInput, Select, StatCard } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { downloadFile, matches } from '../../lib/utils'
import { clientesLista, docCategorias, docsIniciais, docStatusTone, type DocCategoria, type EsDoc } from './data2'

const catIcon: Record<DocCategoria, typeof FileText> = {
  Extrato: FileText,
  Contrato: ScrollText,
  Guia: Receipt,
  'Certidão': Landmark,
  'NF-e/NFS-e': FileSpreadsheet,
  Folha: Users,
  IRPF: Coins,
  'Alvará': Building,
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function guessCategoria(name: string): DocCategoria {
  const n = name.toLowerCase()
  if (n.includes('extrato') || n.endsWith('.ofx')) return 'Extrato'
  if (n.includes('contrato')) return 'Contrato'
  if (n.includes('das') || n.includes('guia') || n.includes('darf')) return 'Guia'
  if (n.includes('certid')) return 'Certidão'
  if (n.endsWith('.xml') || n.includes('nf')) return 'NF-e/NFS-e'
  if (n.includes('folha') || n.includes('holerite')) return 'Folha'
  if (n.includes('irpf')) return 'IRPF'
  if (n.includes('alvar')) return 'Alvará'
  return 'Extrato'
}

const hoje = () => new Date().toLocaleDateString('pt-BR')

export default function Documentos() {
  const toast = useToast()
  const [docs, setDocs] = useState<EsDoc[]>(docsIniciais)
  const [filtro, setFiltro] = useState<'Todos' | DocCategoria>('Todos')
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<{ cliente: string; categoria: DocCategoria; files: File[] }>({
    cliente: clientesLista[0],
    categoria: 'Extrato',
    files: [],
  })

  const lista = useMemo(
    () => docs.filter((d) => (filtro === 'Todos' || d.categoria === filtro) && matches(busca, d.nome, d.cliente)),
    [docs, filtro, busca],
  )

  const addFiles = (files: File[], cliente = clientesLista[0], categoria?: DocCategoria) => {
    if (!files.length) return
    const novos: EsDoc[] = files.map((f, i) => ({
      id: Date.now() + i,
      nome: f.name.replace(/\.[^.]+$/, ''),
      cliente,
      tamanho: formatSize(f.size),
      categoria: categoria ?? guessCategoria(f.name),
      data: hoje(),
      status: 'Novo',
    }))
    setDocs((d) => [...novos, ...d])
    toast(`${files.length} arquivo(s) enviado(s) com sucesso`)
  }

  const novosSemana = 23 + docs.filter((d) => d.data === hoje()).length
  const revisao = 7 - docsIniciais.filter((d) => d.status === 'Revisão').length + docs.filter((d) => d.status === 'Revisão').length

  return (
    <div className="space-y-5">
      <PageTitle
        title="Documentos"
        subtitle={`Central de documentos por cliente · ${docs.length} arquivos recentes`}
        actions={
          <Button icon={<Plus size={15} />} onClick={() => setModal(true)}>
            Enviar documento
          </Button>
        }
      />

      <Dropzone
        compact
        title={<span className="font-semibold text-slate-500">Arraste arquivos aqui para enviar</span>}
        hint="PDF, XML, DOCX, XLSX — máximo 25 MB por arquivo"
        onFiles={(f) => addFiles(f)}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total documentos" value={(1284 + docs.length - docsIniciais.length).toLocaleString('pt-BR')} progress={55} />
        <StatCard label="Novos (semana)" value={novosSemana} progress={55} progressColor="bg-sky-400" />
        <StatCard label="Aguardando revisão" value={revisao} progress={55} progressColor="bg-amber-600" />
        <StatCard label="Espaço usado" value="3.4 GB" progress={55} progressColor="bg-emerald-500" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chips
          value={filtro}
          onChange={setFiltro}
          options={[{ value: 'Todos' as const, label: 'Todos' }, ...docCategorias.map((c) => ({ value: c, label: c }))]}
        />
        <SearchInput value={busca} onChange={setBusca} placeholder="Buscar documento ou cliente..." className="min-w-56 flex-1" />
      </div>

      <Card className="p-3">
        {lista.length === 0 && <p className="py-10 text-center text-[13px] text-muted">Nenhum documento encontrado.</p>}
        {lista.map((d) => {
          const Icon = catIcon[d.categoria]
          return (
            <div key={d.id} className="flex flex-wrap items-center gap-3 rounded-xl px-3 py-3 hover:bg-slate-50">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold text-ink">{d.nome}</p>
                <p className="text-[11px] text-muted">
                  {d.cliente} · {d.tamanho}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500">{d.categoria}</span>
              <span className="num w-28 text-right text-[13px] text-slate-400">{d.data}</span>
              <button
                title="Alterar status"
                onClick={() =>
                  setDocs((all) =>
                    all.map((x) =>
                      x.id === d.id ? { ...x, status: x.status === 'Novo' ? 'Revisão' : x.status === 'Revisão' ? 'OK' : 'Novo' } : x,
                    ),
                  )
                }
                className="cursor-pointer"
              >
                <Badge tone={docStatusTone[d.status]}>{d.status}</Badge>
              </button>
              <Button
                size="sm"
                variant="soft"
                onClick={() => {
                  downloadFile(`${d.nome.replace(/[\s/]+/g, '_')}.pdf`)
                  toast(`Download de "${d.nome}" iniciado`)
                }}
              >
                Baixar
              </Button>
            </div>
          )
        })}
      </Card>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Enviar documento"
        subtitle="O documento ficará disponível no cofre do cliente"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!form.files.length}
              onClick={() => {
                addFiles(form.files, form.cliente, form.categoria)
                setForm((f) => ({ ...f, files: [] }))
                setModal(false)
              }}
            >
              Enviar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Cliente">
            <Select value={form.cliente} onChange={(v) => setForm((f) => ({ ...f, cliente: v }))} options={clientesLista} className="w-full" />
          </Field>
          <Field label="Categoria">
            <Select
              value={form.categoria}
              onChange={(v) => setForm((f) => ({ ...f, categoria: v as DocCategoria }))}
              options={docCategorias}
              className="w-full"
            />
          </Field>
          <Dropzone
            compact
            title="Clique ou arraste os arquivos"
            hint={form.files.length ? form.files.map((f) => f.name).join(', ') : 'PDF, XML, DOCX, XLSX — até 25 MB'}
            onFiles={(files) => setForm((f) => ({ ...f, files }))}
          />
        </div>
      </Modal>
    </div>
  )
}
