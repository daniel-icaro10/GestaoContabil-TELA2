import { useState } from 'react'
import { Badge, Button, Card, PageTitle, Progress, Table, Td, Tabs, EmptyRow } from '../../components/ui'
import { brl, downloadFile } from '../../lib/utils'
import { faturas as initial, type Fatura } from './data'
import { PayModal } from './shared'

export default function Financeiro() {
  const [list, setList] = useState(initial)
  const [tab, setTab] = useState<'todas' | 'pendentes' | 'pagas'>('todas')
  const [paying, setPaying] = useState<Fatura | null>(null)

  const pendente = list.find((f) => f.status === 'Pendente')
  const pagas = list.filter((f) => f.status === 'Pago').length
  const totalPago = 7110 + (pagas - 2) * 790
  const rows = list.filter((f) => (tab === 'todas' ? true : tab === 'pendentes' ? f.status === 'Pendente' : f.status === 'Pago'))

  return (
    <div className="max-w-[900px] space-y-5">
      <PageTitle title="Financeiro" subtitle="Honorários e faturas do escritório contábil" />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-slate-500">Mensalidade atual</p>
          <p className="num mt-2 text-xl">{brl(790)}</p>
          <p className="mt-1 text-xs text-muted">Plano Pessoa Física</p>
          <Progress value={60} className="mt-3" />
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500">Próx. vencimento</p>
          <p className="num mt-2 text-xl">{pendente ? '05 Out' : '05 Nov'}</p>
          <p className="mt-1 text-xs text-muted">{pendente ? 'Em 5 dias' : 'Em 36 dias'}</p>
          <Progress value={60} color="bg-amber-600" className="mt-3" />
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500">Total pago em 2024</p>
          <p className="num mt-2 text-xl">{brl(totalPago)}</p>
          <p className="mt-1 text-xs text-muted">{9 + (pagas - 2)} faturas pagas</p>
          <Progress value={60} color="bg-emerald-500" className="mt-3" />
        </Card>
      </div>

      {pendente && (
        <Card className="flex flex-wrap items-center gap-4 border-amber-200 bg-amber-50/70 px-5 py-4">
          <div className="flex-1">
            <p className="text-[14px] font-bold text-ink">Fatura de {pendente.comp}</p>
            <p className="text-xs text-slate-500">Vencimento: {pendente.venc} · Plano Pessoa Física</p>
          </div>
          <p className="num text-xl text-amber-800">{brl(pendente.valor)}</p>
          <Button variant="warning" onClick={() => setPaying(pendente)}>
            Pagar agora
          </Button>
          <Button
            variant="secondary"
            className="border-amber-300 bg-transparent"
            onClick={() => downloadFile(`NF_Honorarios_${pendente.comp.replace(' ', '_')}.pdf`)}
          >
            Baixar NF
          </Button>
        </Card>
      )}

      <Card>
        <div className="px-5 pt-5">
          <h3 className="text-[15px] font-bold">Histórico de Faturas</h3>
          <Tabs
            className="mt-3 border-0"
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'todas', label: 'Todas' },
              { value: 'pendentes', label: 'Pendentes' },
              { value: 'pagas', label: 'Pagas' },
            ]}
          />
        </div>
        <Table head={['Competência', 'Vencimento', 'Valor', 'Situação', 'Ações']}>
          {rows.length === 0 && <EmptyRow cols={5} />}
          {rows.map((f) => (
            <tr key={f.id}>
              <Td className="font-bold text-ink">{f.comp}</Td>
              <Td className="num text-xs">{f.venc}</Td>
              <Td className="num text-ink">{brl(f.valor)}</Td>
              <Td>
                <Badge tone={f.status === 'Pago' ? 'green' : 'amber'}>{f.status}</Badge>
              </Td>
              <Td right>
                {f.status === 'Pendente' ? (
                  <Button size="sm" variant="outline" onClick={() => setPaying(f)}>
                    Pagar
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => downloadFile(`Comprovante_${f.comp.replace(' ', '_')}.pdf`)}>
                    Comprovante
                  </Button>
                )}
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <PayModal
        open={!!paying}
        onClose={() => setPaying(null)}
        title={paying ? `Honorários contábeis · ${paying.comp}` : ''}
        valor={paying?.valor ?? 0}
        venc={paying?.venc ?? ''}
        onPaid={() => paying && setList((l) => l.map((f) => (f.id === paying.id ? { ...f, status: 'Pago' } : f)))}
      />
    </div>
  )
}
