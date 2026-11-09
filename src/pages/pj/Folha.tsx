import { useState } from 'react'
import { FileCheck2, Download } from 'lucide-react'
import { Avatar, Badge, Banner, Button, Card, StatCard, Table, Tabs, Td, Dot, Modal, InfoRow } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { brl, downloadCsv, downloadFile, initials, cn } from '../../lib/utils'
import { colaboradores, type Colaborador } from './data'

type Tab = 'todos' | 'CLT' | 'Pró-labore'

const agenda = [
  { t: 'Folha Processada (Out/2024)', d: '15/10/2024', done: true },
  { t: 'FGTS Recolhido (Out/2024)', d: '07/10/2024', done: true },
  { t: 'eSocial S-1200 Enviado', d: '10/10/2024', done: true },
  { t: 'Fechamento Folha Nov/2024', d: '15/11/2024', tone: 'blue' as const },
  { t: '13º Salário — 1ª Parcela', d: '30/11/2024', tone: 'amber' as const },
]

export default function Folha() {
  const toast = useToast()
  const [tab, setTab] = useState<Tab>('todos')
  const [sel, setSel] = useState<Colaborador | null>(null)
  const rows = tab === 'todos' ? colaboradores : colaboradores.filter((c) => c.regime === tab)
  const clt = colaboradores.filter((c) => c.regime === 'CLT')
  const bruto = 34500
  const fgts = clt.reduce((s, c) => s + (c.fgts ?? 0), 0)
  const encargos = [
    { label: 'INSS Patronal (20%)', v: 2500, tone: 'blue' as const },
    { label: 'FGTS (8%)', v: 1560, tone: 'violet' as const },
    { label: 'IRRF Retido', v: 5333.5, tone: 'sky' as const },
  ]

  return (
    <div className="space-y-5">
      <Banner
        tone="green"
        icon={<FileCheck2 size={18} />}
        title="eSocial S-1200 transmitido com sucesso para Outubro/2024"
        text="4 colaboradores processados · Protocolo ESOCIAL-2024-10-00842 · Sem inconsistências"
        action={
          <Button variant="success" onClick={() => { downloadFile('Recibo_eSocial_S-1200_Out2024.pdf'); toast('Recibo eSocial baixado') }}>
            Baixar Recibo eSocial
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Custo Total da Folha" value={brl(bruto)} sub="Bruto · Outubro / 2024" />
        <StatCard label="Total Líquido Pago" value={brl(25540.65)} valueClass="text-emerald-600" badge={<Badge tone="green">4 pessoas</Badge>} sub="Após descontos legais" />
        <StatCard label="FGTS a Recolher (Nov)" value={brl(fgts)} valueClass="text-amber-600" badge={<Badge tone="amber">Vence 07/11</Badge>} sub="FGTS Digital · 3 colaboradores CLT" />
        <StatCard label="Colaboradores Ativos" value="4 Pessoas">
          <div className="mt-2 flex gap-1.5">
            <Badge tone="blue">3 CLT</Badge>
            <Badge tone="violet">1 Pró-labore</Badge>
          </div>
        </StatCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_240px]">
        <Card className="min-w-0 self-start">
          <div className="flex flex-wrap items-end justify-between gap-3 px-5 pt-4">
            <Tabs
              className="border-0"
              value={tab}
              onChange={setTab}
              tabs={[
                { value: 'todos', label: `Todos (${colaboradores.length})` },
                { value: 'CLT', label: `CLT (${clt.length})` },
                { value: 'Pró-labore', label: `Pró-labore (${colaboradores.length - clt.length})` },
              ]}
            />
            <Button
              variant="soft"
              size="sm"
              className="mb-2"
              icon={<Download size={14} />}
              onClick={() => {
                downloadCsv(
                  'holerites_out2024.csv',
                  rows.map((c) => ({ Colaborador: c.nome, Cargo: c.cargo, Regime: c.regime, Bruto: c.bruto, INSS: c.inss, IRRF: c.irrf, FGTS: c.fgts ?? '-', Liquido: c.bruto - c.inss - c.irrf })),
                )
                toast('Holerites exportados')
              }}
            >
              Exportar Holerites
            </Button>
          </div>
          <Table head={['Colaborador', 'Regime', 'Salário Bruto', 'INSS', 'IRRF', 'FGTS', 'Líquido', 'Ações']}>
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50">
                <Td>
                  <div className="flex items-center gap-2.5">
                    <Avatar text={initials(c.nome)} size={32} gradient />
                    <div>
                      <p className="font-semibold text-ink">{c.nome}</p>
                      <p className="text-[11px] text-muted">{c.cargo}</p>
                    </div>
                  </div>
                </Td>
                <Td><Badge tone={c.regime === 'CLT' ? 'blue' : 'violet'}>{c.regime}</Badge></Td>
                <Td className="num font-medium text-ink">{brl(c.bruto)}</Td>
                <Td className="num">{brl(c.inss)}</Td>
                <Td className="num">{brl(c.irrf)}</Td>
                <Td className="num">{c.fgts ? brl(c.fgts) : '–'}</Td>
                <Td className="num text-emerald-600">{brl(c.bruto - c.inss - c.irrf)}</Td>
                <Td right>
                  <Button variant="outline" size="sm" onClick={() => setSel(c)}>Holerite</Button>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[15px] font-bold">Agenda DP</h3>
                <p className="mt-0.5 text-[10px] tracking-[0.15em] text-slate-300">CALENDÁRIO DE OBRIGAÇÕES</p>
              </div>
              <Badge tone="blue">Out / Nov</Badge>
            </div>
            <div className="mt-4 space-y-3.5">
              {agenda.map((a) => (
                <div key={a.t} className="flex gap-2.5">
                  <Dot tone={a.done ? 'green' : a.tone} className="mt-1.5" />
                  <div>
                    <p className={cn('text-[12px]', a.done ? 'text-slate-400 line-through' : 'font-semibold text-ink')}>{a.t}</p>
                    <p className={cn('num text-[11px]', a.done ? 'text-slate-300 line-through' : 'text-slate-500')}>{a.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-brand/50 p-5">
            <h3 className="text-[15px] font-bold">Encargos do Mês</h3>
            <div className="mt-3 divide-y divide-line">
              {encargos.map((e) => (
                <div key={e.label} className="flex items-center justify-between py-2.5">
                  <span className="flex items-center gap-2 text-[12px] text-slate-600">
                    <Dot tone={e.tone} /> {e.label}
                  </span>
                  <span className="num text-[12px] text-ink">{brl(e.v)}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-3">
              <span className="text-[11px] font-bold">Total Encargos</span>
              <span className="num text-[13px] text-brand">{brl(encargos.reduce((s, e) => s + e.v, 0))}</span>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={!!sel}
        onClose={() => setSel(null)}
        title={`Holerite — ${sel?.nome}`}
        subtitle="Competência Outubro/2024"
        footer={
          <Button icon={<Download size={14} />} onClick={() => { downloadFile(`Holerite_${sel?.nome.replace(/ /g, '_')}_Out2024.pdf`); toast('Holerite baixado') }}>
            Baixar PDF
          </Button>
        }
      >
        {sel && (
          <>
            <InfoRow label="Cargo" value={sel.cargo} />
            <InfoRow label="Regime" value={sel.regime} />
            <InfoRow label="Salário bruto" value={brl(sel.bruto)} />
            <InfoRow label="(-) INSS" value={brl(sel.inss)} />
            <InfoRow label="(-) IRRF" value={brl(sel.irrf)} />
            <InfoRow label="FGTS (depósito)" value={sel.fgts ? brl(sel.fgts) : '—'} />
            <InfoRow label="Líquido a receber" value={<span className="text-emerald-600">{brl(sel.bruto - sel.inss - sel.irrf)}</span>} />
          </>
        )}
      </Modal>
    </div>
  )
}
