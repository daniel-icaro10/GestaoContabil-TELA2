import { useState } from 'react'
import { FileText, Eye, Download, CheckCircle2, X } from 'lucide-react'
import {
  Badge,
  Banner,
  Button,
  Card,
  StatCard,
  Table,
  Tabs,
  Td,
  EmptyRow,
  SearchInput,
  Modal,
  Field,
  Input,
  Textarea,
  InfoRow,
  MiniBars,
} from '../../components/ui'
import { useToast } from '../../components/Toast'
import { brl, downloadCsv, downloadFile, matches } from '../../lib/utils'
import { notas as initial, type Nota } from './data'

type Tab = 'todas' | 'autorizada' | 'pendente' | 'cancelada'

function StatusBadge({ s }: { s: Nota['status'] }) {
  if (s === 'autorizada') return <Badge tone="green"><CheckCircle2 size={11} /> Autorizada</Badge>
  if (s === 'pendente') return <Badge tone="amber" dot>Aguardando SEFAZ</Badge>
  return <Badge tone="red" dot>Cancelada</Badge>
}

export default function NotasFiscais() {
  const toast = useToast()
  const [rows, setRows] = useState(initial)
  const [tab, setTab] = useState<Tab>('todas')
  const [q, setQ] = useState('')
  const [view, setView] = useState<Nota | null>(null)
  const [emit, setEmit] = useState(false)
  const [form, setForm] = useState({ tomador: '', cnpj: '', servico: '', valor: '' })

  const count = (s: Nota['status']) => rows.filter((n) => n.status === s).length
  const filtered = rows.filter((n) => (tab === 'todas' || n.status === tab) && matches(q, n.tomador, n.numero, n.cnpj, n.servico))
  const autorizadas = rows.filter((n) => n.status === 'autorizada')
  const fat = autorizadas.reduce((s, n) => s + n.valor, 0)
  const pend = rows.filter((n) => n.status === 'pendente')

  const submit = () => {
    const valor = Number(form.valor.replace(/\./g, '').replace(',', '.'))
    if (!form.tomador || !form.servico || !valor) {
      toast('Preencha tomador, serviço e valor.', 'warning')
      return
    }
    const next = String(Math.max(...rows.map((r) => Number(r.numero))) + 1).padStart(6, '0')
    setRows((r) => [
      {
        id: 'n' + Date.now(),
        numero: next,
        tomador: form.tomador,
        cnpj: form.cnpj || '—',
        servico: form.servico,
        comp: '10/2024',
        emissao: new Date().toLocaleDateString('pt-BR'),
        valor,
        status: 'pendente',
      },
      ...r,
    ])
    setEmit(false)
    setForm({ tomador: '', cnpj: '', servico: '', valor: '' })
    toast(`NFS-e ${next} enviada para autorização da prefeitura`)
  }

  return (
    <div className="space-y-5">
      <Banner
        tone="brand"
        icon={<FileText size={18} />}
        title="Integração NFS-e ativa — Prefeitura de São Paulo"
        text="Emissão automatizada via webservice municipal · ISS retido na fonte calculado automaticamente"
        action={<Button onClick={() => setEmit(true)}>Emitir Nova NFS-e</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Faturamento Autorizado" value={brl(fat)} sub={`${autorizadas.length} NFS-e autorizadas · Out/2024`} />
        <StatCard label="ISS Retido" value={brl(fat * 0.05)} valueClass="text-brand" badge={<Badge tone="blue">5%</Badge>} sub="Retido na fonte automaticamente" />
        <StatCard
          label="Aguardando Autorização"
          value={brl(pend.reduce((s, n) => s + n.valor, 0))}
          valueClass="text-amber-600"
          badge={<Badge tone="amber">Pendente</Badge>}
          sub={`${pend.length} NFS-e aguardando SEFAZ`}
        />
        <StatCard label="Notas Emitidas" value={`${rows.length} NFS-e`}>
          <MiniBars values={[3, 5, 4, 7, 5, 8, 6]} highlight={1} />
        </StatCard>
      </div>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-3 px-5 pt-4 pb-1">
          <Tabs
            className="border-0"
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'todas', label: `Todas (${rows.length})` },
              { value: 'autorizada', label: `Autorizadas (${count('autorizada')})` },
              { value: 'pendente', label: `Pendentes (${count('pendente')})` },
              { value: 'cancelada', label: `Canceladas (${count('cancelada')})` },
            ]}
          />
          <SearchInput value={q} onChange={setQ} placeholder="Buscar tomador ou número..." className="mb-2 w-full sm:w-64" />
        </div>
        <Table head={['Número / Tomador', 'Serviço Prestado', 'Emissão', 'Valor Bruto', 'ISS', 'Status', 'Ações']}>
          {filtered.length === 0 && <EmptyRow cols={7} />}
          {filtered.map((n) => (
            <tr key={n.id} className="hover:bg-slate-50/50">
              <Td>
                <p className="num text-[13px] text-brand">NFS-e {n.numero}</p>
                <p className="font-semibold text-ink">{n.tomador}</p>
                <p className="num text-[11px] text-muted">{n.cnpj}</p>
              </Td>
              <Td>
                <p className="max-w-[180px] truncate">{n.servico}</p>
                <p className="num text-[11px] text-muted">{n.comp}</p>
              </Td>
              <Td className="num text-ink">{n.emissao}</Td>
              <Td className="num font-medium text-ink">{brl(n.valor)}</Td>
              <Td className="num">{brl(n.valor * 0.05)}</Td>
              <Td><StatusBadge s={n.status} /></Td>
              <Td right>
                {n.status === 'cancelada' ? (
                  <span className="text-[11px] text-muted">Cancelada</span>
                ) : (
                  <div className="flex justify-end gap-2">
                    <button
                      title="Visualizar"
                      onClick={() => setView(n)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-line text-slate-500 hover:text-brand"
                    >
                      <Eye size={14} />
                    </button>
                    <Button variant="outline" size="sm" icon={<Download size={13} />} onClick={() => { downloadFile(`NFS-e_${n.numero}.pdf`); toast('PDF da NFS-e baixado') }}>
                      PDF
                    </Button>
                  </div>
                )}
              </Td>
            </tr>
          ))}
        </Table>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4">
          <p className="text-xs text-muted">Exibindo {filtered.length} de {rows.length} notas fiscais</p>
          <Button
            variant="soft"
            icon={<Download size={14} />}
            onClick={() => {
              downloadCsv(
                'notas_fiscais.csv',
                filtered.map((n) => ({ Numero: n.numero, Tomador: n.tomador, CNPJ: n.cnpj, Servico: n.servico, Emissao: n.emissao, Valor: n.valor, ISS: n.valor * 0.05, Status: n.status })),
              )
              toast('Exportação XML / CSV concluída')
            }}
          >
            Exportar XML / CSV
          </Button>
        </div>
      </Card>

      <Modal
        open={!!view}
        onClose={() => setView(null)}
        title={`NFS-e ${view?.numero}`}
        subtitle={view?.tomador}
        footer={
          <>
            {view?.status === 'autorizada' && (
              <Button
                variant="dangerOutline"
                icon={<X size={14} />}
                onClick={() => {
                  setRows((r) => r.map((x) => (x.id === view!.id ? { ...x, status: 'cancelada' } : x)))
                  setView(null)
                  toast('Solicitação de cancelamento enviada', 'info')
                }}
              >
                Cancelar nota
              </Button>
            )}
            <Button variant="secondary" onClick={() => { downloadFile(`NFS-e_${view?.numero}.xml`, '<NFSe/>', 'application/xml'); toast('XML baixado') }}>
              XML
            </Button>
            <Button onClick={() => { downloadFile(`NFS-e_${view?.numero}.pdf`); toast('PDF baixado') }}>Baixar PDF</Button>
          </>
        }
      >
        {view && (
          <>
            <InfoRow label="Tomador" value={view.tomador} />
            <InfoRow label="CNPJ" value={view.cnpj} />
            <InfoRow label="Serviço" value={view.servico} />
            <InfoRow label="Competência" value={view.comp} />
            <InfoRow label="Emissão" value={view.emissao} />
            <InfoRow label="Valor bruto" value={brl(view.valor)} />
            <InfoRow label="ISS (5%)" value={brl(view.valor * 0.05)} />
            <InfoRow label="Status" value={<StatusBadge s={view.status} />} />
          </>
        )}
      </Modal>

      <Modal
        open={emit}
        onClose={() => setEmit(false)}
        title="Emitir Nova NFS-e"
        subtitle="Prefeitura de São Paulo · ISS 5% retido na fonte"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEmit(false)}>Cancelar</Button>
            <Button onClick={submit}>Emitir NFS-e</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tomador (Razão Social)" className="sm:col-span-2">
            <Input value={form.tomador} onChange={(e) => setForm({ ...form, tomador: e.target.value })} placeholder="Ex.: Acme Soluções Ltda" />
          </Field>
          <Field label="CNPJ do Tomador">
            <Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} placeholder="00.000.000/0001-00" />
          </Field>
          <Field label="Valor Bruto (R$)">
            <Input value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} placeholder="1.500,00" />
          </Field>
          <Field label="Descrição do Serviço" className="sm:col-span-2">
            <Textarea value={form.servico} onChange={(e) => setForm({ ...form, servico: e.target.value })} placeholder="Ex.: Consultoria em TI" />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
