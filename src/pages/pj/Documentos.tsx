import { useState } from 'react'
import { Shield, Folder, Eye, Download, X } from 'lucide-react'
import { Banner, Badge, Button, Card, Chips, Dropzone, Table, Td, EmptyRow, Modal, InfoRow, CodeTag } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { cn, downloadFile } from '../../lib/utils'
import { arquivos as initial, type Arquivo } from './data'

const pastas = [
  { key: 'Fiscal' as const, nome: 'Fiscal & Tributário', qtd: 148, ultimo: 'DAS_092024.pdf', cls: 'bg-indigo-50 text-indigo-500' },
  { key: 'Pessoal' as const, nome: 'Departamento Pessoal', qtd: 34, ultimo: 'Folha_Set2024.pdf', cls: 'bg-violet-50 text-violet-500' },
  { key: 'Contábil' as const, nome: 'Contábil & Bancário', qtd: 82, ultimo: 'Extrato_Itau_Set.ofx', cls: 'bg-sky-50 text-sky-500' },
  { key: 'Societário' as const, nome: 'Societário & Licenças', qtd: 12, ultimo: 'Contrato_Social_Consolidado.pdf', cls: 'bg-emerald-50 text-emerald-600' },
]

type Filtro = 'todos' | 'meus' | 'escritorio'

function fmtSize(b: number) {
  return b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`
}

function guessPasta(name: string): Arquivo['pasta'] {
  const n = name.toLowerCase()
  if (n.includes('extrato') || n.endsWith('.ofx') || n.includes('balan')) return 'Contábil'
  if (n.includes('folha') || n.includes('holerite') || n.includes('ferias')) return 'Pessoal'
  if (n.includes('contrato') || n.includes('alvara') || n.includes('cnpj')) return 'Societário'
  return 'Fiscal'
}

export default function Documentos() {
  const toast = useToast()
  const [rows, setRows] = useState(initial)
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [pasta, setPasta] = useState<Arquivo['pasta'] | null>(null)
  const [banner, setBanner] = useState(true)
  const [view, setView] = useState<Arquivo | null>(null)

  const filtered = rows.filter(
    (a) => (filtro === 'todos' || (filtro === 'meus' ? a.meu : !a.meu)) && (!pasta || a.pasta === pasta),
  )

  const upload = (files: File[]) => {
    if (!files.length) return
    const novos: Arquivo[] = files.map((f, i) => {
      const ext = (f.name.split('.').pop() ?? 'PDF').toUpperCase()
      return {
        id: `up${Date.now()}${i}`,
        nome: f.name,
        ext: (['PDF', 'XML', 'OFX', 'ZIP', 'PNG', 'DOCX'].includes(ext) ? ext : 'PDF') as Arquivo['ext'],
        pasta: guessPasta(f.name),
        por: 'Sheila Rozendo (Você)',
        meu: true,
        data: 'Agora',
        tamanho: fmtSize(f.size),
      }
    })
    setRows((r) => [...novos, ...r])
    toast(`${files.length} arquivo(s) enviado(s) ao cofre com sucesso`)
  }

  return (
    <div className="space-y-5">
      {banner && (
        <Banner
          tone="amber"
          icon={<Shield size={18} />}
          title={<span className="text-amber-800">Certificado Digital e-CNPJ A1 — <span className="num">expira em 18 dias!</span></span>}
          text="Titular: Tech Founders Ltda • Emissor: Certisign AC • Validade até 18/11/2024"
          action={
            <label className="inline-flex h-8 cursor-pointer items-center rounded-lg bg-brand px-3 text-xs font-semibold text-white hover:brightness-110">
              Upload Novo Certificado (.pfx)
              <input
                type="file"
                accept=".pfx,.p12"
                hidden
                onChange={(e) => {
                  if (e.target.files?.length) {
                    toast(`Certificado ${e.target.files[0].name} enviado para validação`)
                    setBanner(false)
                  }
                }}
              />
            </label>
          }
          onClose={() => setBanner(false)}
        />
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[15px] font-bold">Pastas Organizacionais do Escritório</h3>
          {pasta && (
            <button onClick={() => setPasta(null)} className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-brand">
              <X size={13} /> Limpar filtro de pasta
            </button>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {pastas.map((p) => (
            <Card
              key={p.key}
              onClick={() => setPasta(pasta === p.key ? null : p.key)}
              className={cn('cursor-pointer p-4 transition hover:border-brand/30', pasta === p.key && 'border-brand ring-2 ring-brand/15')}
            >
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', p.cls)}>
                <Folder size={17} />
              </div>
              <p className="mt-4 text-[13px] font-bold">{p.nome}</p>
              <p className="text-[11px] text-muted">{p.qtd + rows.filter((r) => r.pasta === p.key && r.id.startsWith('up')).length} arquivos</p>
              <p className="mt-4 truncate border-t border-line pt-2.5 text-[10px] text-muted">Último: {p.ultimo}</p>
            </Card>
          ))}
        </div>
      </div>

      <Dropzone
        title="Arraste seus extratos bancários, recibos ou contratos aqui"
        hint="Suporta arquivos OFX, PDF, XML e ZIP de até 50 MB"
        button="Selecionar arquivos do computador"
        onFiles={upload}
      />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <h3 className="text-[15px] font-bold">
            Arquivos Recentes no Cofre {pasta && <span className="text-xs font-medium text-brand">· {pasta}</span>}
          </h3>
          <Chips
            value={filtro}
            onChange={setFiltro}
            options={[
              { value: 'todos', label: 'Todos os Arquivos' },
              { value: 'meus', label: 'Enviados por Mim' },
              { value: 'escritorio', label: 'Enviados pelo Escritório' },
            ]}
          />
        </div>
        <Table head={['Nome do Documento', 'Pasta', 'Enviado por', 'Data', 'Tamanho', 'Ações']}>
          {filtered.length === 0 && <EmptyRow cols={6} />}
          {filtered.map((a) => (
            <tr key={a.id} className="hover:bg-slate-50/50">
              <Td>
                <div className="flex items-center gap-2.5">
                  <CodeTag tone={a.ext === 'PDF' ? 'red' : 'blue'}>{a.ext}</CodeTag>
                  <span className="font-semibold text-ink">{a.nome}</span>
                </div>
              </Td>
              <Td><Badge tone="gray">{a.pasta}</Badge></Td>
              <Td className="font-medium text-ink">{a.por}</Td>
              <Td className="text-[12px]">{a.data}</Td>
              <Td className="num text-[12px]">{a.tamanho}</Td>
              <Td right>
                <div className="flex justify-end gap-2">
                  <button title="Visualizar" onClick={() => setView(a)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-line text-slate-500 hover:text-brand">
                    <Eye size={14} />
                  </button>
                  <button
                    title="Baixar"
                    onClick={() => { downloadFile(a.nome); toast('Download iniciado') }}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-brand/30 bg-brand/5 text-brand hover:bg-brand/10"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal
        open={!!view}
        onClose={() => setView(null)}
        title={view?.nome ?? ''}
        subtitle="Visualização do documento"
        footer={
          <>
            {view?.meu && (
              <Button
                variant="dangerOutline"
                onClick={() => {
                  setRows((r) => r.filter((x) => x.id !== view.id))
                  setView(null)
                  toast('Arquivo removido do cofre', 'info')
                }}
              >
                Excluir
              </Button>
            )}
            <Button icon={<Download size={14} />} onClick={() => { downloadFile(view!.nome); toast('Download iniciado') }}>Baixar</Button>
          </>
        }
      >
        {view && (
          <>
            <div className="mb-4 flex h-40 items-center justify-center rounded-xl border border-dashed border-line bg-slate-50 text-xs text-muted">
              Pré-visualização de {view.ext}
            </div>
            <InfoRow label="Pasta" value={view.pasta} />
            <InfoRow label="Enviado por" value={view.por} />
            <InfoRow label="Data" value={view.data} />
            <InfoRow label="Tamanho" value={view.tamanho} />
          </>
        )}
      </Modal>
    </div>
  )
}
