import { useState } from 'react'
import { Badge, Button, Card, PageTitle, Progress, Table, Td, Tabs, EmptyRow } from '../../components/ui'
import { brl, downloadFile } from '../../lib/utils'
import { obrigacoes as initial, type Obrigacao } from './data'
import { PayModal } from './shared'

export default function Obrigacoes() {
  const [list, setList] = useState(initial)
  const [tab, setTab] = useState<'todas' | 'pendentes' | 'pagas'>('todas')
  const [paying, setPaying] = useState<Obrigacao | null>(null)

  const pendentes = list.filter((o) => o.status === 'Pendente')
  const totalPago = list.filter((o) => o.status === 'Pago').reduce((s, o) => s + o.valor, 0)
  const totalPendente = pendentes.reduce((s, o) => s + o.valor, 0)
  const rows = list.filter((o) => (tab === 'todas' ? true : tab === 'pendentes' ? o.status === 'Pendente' : o.status === 'Pago'))

  return (
    <div className="max-w-[900px] space-y-5">
      <PageTitle title="Obrigações" subtitle="Carnê-Leão e outras obrigações aplicáveis" />

      {pendentes.length > 0 && (
        <Card className="flex flex-wrap items-center gap-3 border-amber-200 bg-amber-50 px-5 py-3">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <p className="flex-1 text-[13px] text-amber-900">
            Você possui <b>{pendentes.length} obrigação pendente</b> com vencimento em{' '}
            <span className="num">{pendentes[0].venc}</span>.
          </p>
          <Button variant="warning" size="sm" onClick={() => setPaying(pendentes[0])}>
            Ver agora
          </Button>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-slate-500">Total pago 2024</p>
          <p className="num mt-2 text-xl">{brl(totalPago + 0)}</p>
          <Progress value={70} color="bg-emerald-500" className="mt-3" />
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500">Pendente</p>
          <p className="num mt-2 text-xl">{brl(totalPendente)}</p>
          <Progress value={totalPendente ? 65 : 0} color="bg-amber-600" className="mt-3" />
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500">Próx. vencimento</p>
          <p className="num mt-2 text-xl">{pendentes.length ? '20 Out' : '20 Nov'}</p>
          <Progress value={65} className="mt-3" />
        </Card>
      </div>

      <Card>
        <div className="px-5 pt-5">
          <h3 className="text-[15px] font-bold">Histórico de Obrigações</h3>
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
        <Table head={['Tipo', 'Competência', 'Vencimento', 'Valor', 'Situação', 'Ações']}>
          {rows.length === 0 && <EmptyRow cols={6} />}
          {rows.map((o) => (
            <tr key={o.id}>
              <Td className="font-bold text-ink">{o.tipo}</Td>
              <Td className="text-xs">{o.comp}</Td>
              <Td className="num text-xs">{o.venc}</Td>
              <Td className="num text-ink">{brl(o.valor)}</Td>
              <Td>
                <Badge tone={o.status === 'Pago' ? 'green' : 'amber'}>{o.status}</Badge>
              </Td>
              <Td right>
                {o.status === 'Pendente' ? (
                  <Button size="sm" variant="outline" onClick={() => setPaying(o)}>
                    Pagar
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadFile(`Comprovante_${o.tipo.replace(/\W+/g, '_')}_${o.comp.replace('/', '-')}.pdf`)}
                  >
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
        title={paying ? `${paying.tipo} · Competência ${paying.comp}` : ''}
        valor={paying?.valor ?? 0}
        venc={paying?.venc ?? ''}
        onPaid={() => paying && setList((l) => l.map((o) => (o.id === paying.id ? { ...o, status: 'Pago' } : o)))}
      />
    </div>
  )
}
