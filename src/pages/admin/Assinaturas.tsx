import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { Badge, Button, Card, Chips, EmptyRow, InfoRow, Modal, Select, StatCard, Table, Td } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { brl, downloadCsv, downloadFile } from '../../lib/utils'
import { planPrice, subStatusTone, subscriptions as seed, type PlanName, type SubStatus, type Subscription } from './data'
import { PlanBadge } from './shared'
import { useNavigate } from 'react-router-dom'
import { credentialsComplete, loadCoraConfig } from '../../lib/cora'

type Filter = 'Todos' | SubStatus

export default function Assinaturas() {
  const toast = useToast()
  const [list, setList] = useState(seed)
  const [filter, setFilter] = useState<Filter>('Todos')
  const [selected, setSelected] = useState<Subscription | null>(null)
  const [newPlan, setNewPlan] = useState<PlanName>('Essencial')

  const filtered = useMemo(() => list.filter((s) => filter === 'Todos' || s.status === filter), [list, filter])
  const count = (st: SubStatus) => list.filter((s) => s.status === st).length
  const navigate = useNavigate()
  const cora = loadCoraConfig()
  const coraReady = cora.enabled && credentialsComplete(cora.mode, cora.credentials[cora.activeEnv])

  function update(id: number, patch: Partial<Subscription>, msg: string, kind: 'success' | 'info' | 'warning' = 'success') {
    setList((l) => l.map((s) => (s.id === id ? { ...s, ...patch } : s)))
    setSelected((s) => (s && s.id === id ? { ...s, ...patch } : s))
    toast(msg, kind)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fe3e6d] text-sm font-extrabold text-white">C</div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-ink">Cobrança via Banco Cora</p>
          <p className="text-[11px] text-muted">
            {coraReady
              ? `Boletos e Pix emitidos automaticamente · ambiente ${cora.activeEnv === 'production' ? 'Produção' : 'Stage'}`
              : 'Integração ainda não configurada — as cobranças não estão sendo emitidas.'}
          </p>
        </div>
        <Badge tone={coraReady ? 'green' : 'amber'} dot>
          {coraReady ? 'Conectado' : 'Pendente'}
        </Badge>
        <Button size="sm" variant="outline" onClick={() => navigate('/admin/configuracoes?tab=cora')}>
          Configurar
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Receita Recorrente Mensal" value="R$ 89.340" valueClass="text-violet-500" sub="Outubro 2024" />
        <StatCard label="Assinaturas Ativas" value={count('Ativa')} valueClass="text-indigo-600" sub="em cobrança ativa" />
        <StatCard label="Em Período de Teste" value={count('Trial')} valueClass="text-amber-600" sub="trial de 14 dias" />
        <StatCard label="Inadimplentes" value={count('Inadimplente')} valueClass="text-red-500" sub="em atraso" />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <h3 className="text-[15px] font-bold">Todas as Assinaturas</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Chips
              value={filter}
              onChange={setFilter}
              options={(['Todos', 'Ativa', 'Trial', 'Pendente', 'Inadimplente', 'Cancelada'] as Filter[]).map((v) => ({ value: v, label: v }))}
            />
            <Button
              size="sm"
              variant="secondary"
              icon={<Download size={13} />}
              onClick={() =>
                downloadCsv(
                  'assinaturas.csv',
                  filtered.map((s) => ({
                    Escritório: s.office,
                    Plano: s.plan,
                    Valor: brl(s.value),
                    'Próxima cobrança': s.nextCharge,
                    'Forma de pagamento': s.payment,
                    Status: s.status,
                  })),
                )
              }
            >
              Exportar
            </Button>
          </div>
        </div>
        <Table head={['Escritório', 'Plano', 'Valor', 'Próxima cobrança', 'Forma de pagamento', 'Status', 'Ações']}>
          {filtered.length === 0 && <EmptyRow cols={7} />}
          {filtered.map((s) => (
            <tr key={s.id} className="hover:bg-slate-50/60">
              <Td className="font-bold text-ink">{s.office}</Td>
              <Td>
                <PlanBadge plan={s.plan} />
              </Td>
              <Td className="num text-ink">{brl(s.value)}</Td>
              <Td className="num text-muted">{s.nextCharge}</Td>
              <Td className="text-xs">{s.payment}</Td>
              <Td>
                <Badge tone={subStatusTone[s.status]}>{s.status}</Badge>
              </Td>
              <Td right>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2.5 text-[11px]"
                  onClick={() => {
                    setSelected(s)
                    setNewPlan(s.plan)
                  }}
                >
                  Detalhes
                </Button>
              </Td>
            </tr>
          ))}
        </Table>
        <div className="border-t border-line px-5 py-3 text-[11px] text-muted">{filtered.length} assinaturas encontradas</div>
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.office}
        subtitle="Detalhes da assinatura"
        width="max-w-xl"
        footer={
          selected && (
            <>
              {selected.status !== 'Cancelada' && (
                <Button
                  variant="dangerOutline"
                  onClick={() => update(selected.id, { status: 'Cancelada', nextCharge: '–' }, `Assinatura de ${selected.office} cancelada.`, 'warning')}
                >
                  Cancelar assinatura
                </Button>
              )}
              {selected.status === 'Cancelada' && (
                <Button
                  variant="success"
                  onClick={() => update(selected.id, { status: 'Ativa', nextCharge: '10/12/2024' }, `Assinatura de ${selected.office} reativada.`)}
                >
                  Reativar
                </Button>
              )}
              {(selected.status === 'Inadimplente' || selected.status === 'Pendente') && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (!coraReady)
                      return toast('Configure a integração com o Banco Cora em Configurações › Pagamentos (Cora).', 'warning')
                    toast(`Boleto/Pix de ${brl(selected.value)} emitido via Cora e enviado para ${selected.office}.`)
                  }}
                >
                  Gerar cobrança (Cora)
                </Button>
              )}
              {selected.status !== 'Ativa' && selected.status !== 'Cancelada' && (
                <Button onClick={() => update(selected.id, { status: 'Ativa' }, `Pagamento registrado para ${selected.office}.`)}>
                  Registrar pagamento
                </Button>
              )}
            </>
          )
        }
      >
        {selected && (
          <>
            <InfoRow label="Plano" value={<PlanBadge plan={selected.plan} />} />
            <InfoRow label="Valor mensal" value={brl(selected.value)} />
            <InfoRow label="Próxima cobrança" value={selected.nextCharge} />
            <InfoRow label="Forma de pagamento" value={selected.payment} />
            <InfoRow label="Status" value={<Badge tone={subStatusTone[selected.status]}>{selected.status}</Badge>} />

            <div className="mt-5 rounded-xl border border-line p-4">
              <p className="mb-2 text-xs font-semibold text-slate-600">Alterar plano</p>
              <div className="flex gap-2">
                <Select
                  value={newPlan}
                  onChange={(v) => setNewPlan(v as PlanName)}
                  options={['Essencial', 'Profissional', 'Premium']}
                  className="flex-1"
                />
                <Button
                  variant="soft"
                  disabled={newPlan === selected.plan}
                  onClick={() =>
                    update(selected.id, { plan: newPlan, value: planPrice[newPlan] }, `${selected.office} migrado para o plano ${newPlan}.`)
                  }
                >
                  Aplicar
                </Button>
              </div>
            </div>

            <p className="mb-2 mt-5 text-xs font-semibold text-slate-600">Últimas faturas</p>
            <div className="divide-y divide-line rounded-xl border border-line">
              {['Outubro 2024', 'Setembro 2024', 'Agosto 2024'].map((m, i) => (
                <div key={m} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-[13px]">{m}</span>
                  <div className="flex items-center gap-3">
                    <span className="num text-xs">{brl(selected.value)}</span>
                    <Badge tone={i === 0 && selected.status === 'Inadimplente' ? 'red' : 'green'}>
                      {i === 0 && selected.status === 'Inadimplente' ? 'Em atraso' : 'Pago'}
                    </Badge>
                    <button
                      onClick={() => downloadFile(`fatura-${selected.office}-${m}.txt`.replace(/\s+/g, '_'))}
                      className="cursor-pointer text-slate-400 hover:text-brand"
                      title="Baixar fatura"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
