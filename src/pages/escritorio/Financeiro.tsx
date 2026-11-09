import { useMemo, useState } from 'react'
import { Badge, Button, Card, Chips, EmptyRow, InfoRow, Modal, PageTitle, StatCard, Table, Td } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { brl, cn, copyText, downloadCsv, downloadFile } from '../../lib/utils'
import { cobrancasIniciais, cobStatusTone, receitaMensal, type Cobranca, type CobStatus } from './data2'

const kfmt = (v: number) => `R$ ${(v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k`

export default function Financeiro() {
  const toast = useToast()
  const [cobs, setCobs] = useState<Cobranca[]>(cobrancasIniciais)
  const [filtro, setFiltro] = useState<'Todos' | CobStatus>('Todos')
  const [sel, setSel] = useState<Cobranca | null>(null)

  const lista = useMemo(() => cobs.filter((c) => filtro === 'Todos' || c.status === filtro), [cobs, filtro])
  const recebido = 17800 + cobs.filter((c, i) => c.status === 'Pago' && cobrancasIniciais[i]?.status !== 'Pago').reduce((s, c) => s + c.valor, 0)
  const aReceber = cobs.filter((c) => c.status === 'Pendente').reduce((s, c) => s + c.valor, 0) + 530
  const inad = cobs.filter((c) => c.status === 'Em atraso').reduce((s, c) => s + c.valor, 0)
  const max = Math.max(...receitaMensal.map((r) => r.valor))

  const marcarPago = (c: Cobranca) => {
    setCobs((all) => all.map((x) => (x.id === c.id ? { ...x, status: 'Pago' } : x)))
    setSel(null)
    toast(`Pagamento de ${c.cliente} registrado`)
  }

  return (
    <div className="space-y-5">
      <PageTitle
        title="Financeiro do Escritório"
        subtitle="Faturamento, inadimplência e recebimentos"
        actions={
          <Button
            variant="outline"
            onClick={() => {
              downloadCsv(
                'relatorio_financeiro_out2024.csv',
                cobs.map((c) => ({ Cliente: c.cliente, Tipo: c.tipo, Plano: c.plano, Valor: c.valor, Vencimento: c.vencimento, Status: c.status })),
              )
              toast('Relatório financeiro exportado')
            }}
          >
            Exportar relatório
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="MRR (Recorrente)" value="R$ 21.500" progress={70} progressColor="bg-emerald-500" />
        <StatCard label="Recebido (out)" value={brl(recebido).replace(',00', '')} progress={70} />
        <StatCard label="A receber" value={brl(aReceber).replace(',00', '')} progress={70} progressColor="bg-amber-600" />
        <StatCard label="Inadimplência" value={brl(inad).replace(',00', '')} progress={70} progressColor="bg-red-600" />
      </div>

      <Card className="p-5">
        <h3 className="text-[15px] font-bold text-ink">Receita Mensal</h3>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {receitaMensal.map((r, i) => {
            const last = i === receitaMensal.length - 1
            return (
              <button
                key={r.mes}
                onClick={() => toast(`Receita de ${r.mes}/2024: ${brl(r.valor)}`, 'info')}
                className="group flex cursor-pointer flex-col items-center"
              >
                <span className="num mb-1 text-[11px] text-slate-400">{kfmt(r.valor)}</span>
                <div className="flex h-16 w-full items-end">
                  <div
                    className={cn('w-full rounded-md transition group-hover:brightness-110', last ? 'bg-emerald-400/70' : 'bg-brand/85')}
                    style={{ height: `${(r.valor / max) * 100}%` }}
                  />
                </div>
                <span className="mt-2 text-[11px] text-slate-400">{r.mes}</span>
              </button>
            )
          })}
        </div>
      </Card>

      <Chips
        value={filtro}
        onChange={setFiltro}
        options={[
          { value: 'Todos' as const, label: 'Todos' },
          { value: 'Pago' as const, label: 'Pagos' },
          { value: 'Pendente' as const, label: 'Pendentes' },
          { value: 'Em atraso' as const, label: 'Em atraso' },
        ]}
      />

      <Card className="overflow-hidden">
        <Table head={['Cliente', 'Tipo', 'Plano', 'Valor', 'Vencimento', 'Status', 'Ações']}>
          {lista.length === 0 && <EmptyRow cols={7} />}
          {lista.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50/60">
              <Td className="font-bold text-ink">{c.cliente}</Td>
              <Td>
                <Badge tone={c.tipo === 'PJ' ? 'blue' : 'sky'}>{c.tipo}</Badge>
              </Td>
              <Td className="text-slate-500">{c.plano}</Td>
              <Td className="num font-medium text-ink">{brl(c.valor)}</Td>
              <Td className="num text-slate-400">{c.vencimento}</Td>
              <Td>
                <Badge tone={cobStatusTone[c.status]}>{c.status}</Badge>
              </Td>
              <Td right>
                <Button size="sm" variant="soft" onClick={() => setSel(c)}>
                  Detalhes
                </Button>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal
        open={!!sel}
        onClose={() => setSel(null)}
        title={sel ? `Cobrança · ${sel.cliente}` : ''}
        subtitle="Honorários contábeis — Outubro/2024"
        footer={
          sel && (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  downloadFile(`fatura_${sel.cliente.replace(/\s+/g, '_')}.pdf`)
                  toast('Fatura baixada')
                }}
              >
                Baixar fatura
              </Button>
              {sel.status !== 'Pago' ? (
                <>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await copyText(`https://pagar.hubcontabil.com.br/fatura/${sel.id}`)
                      toast(`Link de cobrança enviado para ${sel.cliente} e copiado`)
                    }}
                  >
                    Reenviar cobrança
                  </Button>
                  <Button variant="success" onClick={() => marcarPago(sel)}>
                    Marcar como pago
                  </Button>
                </>
              ) : (
                <Button onClick={() => setSel(null)}>Fechar</Button>
              )}
            </>
          )
        }
      >
        {sel && (
          <div>
            <InfoRow label="Cliente" value={sel.cliente} />
            <InfoRow label="Tipo" value={sel.tipo === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'} />
            <InfoRow label="Plano" value={sel.plano} />
            <InfoRow label="Valor" value={<span className="num">{brl(sel.valor)}</span>} />
            <InfoRow label="Vencimento" value={sel.vencimento} />
            <InfoRow label="Forma de pagamento" value="Boleto / PIX" />
            <InfoRow label="Status" value={<Badge tone={cobStatusTone[sel.status]}>{sel.status}</Badge>} />
          </div>
        )}
      </Modal>
    </div>
  )
}
