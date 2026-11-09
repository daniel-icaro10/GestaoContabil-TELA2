import { useState } from 'react'
import { Card, Badge, Button, Chips, SearchInput, Table, Td, EmptyRow, Modal, InfoRow, PageTitle, Progress, Field, Select, type Tone } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { brl, matches, downloadFile, copyText } from '../../lib/utils'
import { obrigacoes as seed, type Obrigacao } from './data'

type Filtro = 'todos' | 'urgentes' | 'avencer' | 'atrasados' | 'pagos'

const statusTone: Record<Obrigacao['status'], Tone> = {
  'Vencendo hoje': 'red',
  'A vencer': 'amber',
  Pendente: 'violet',
  Atrasado: 'red',
  Pago: 'green',
}
const prioTone: Record<Obrigacao['prioridade'], Tone> = { Urgente: 'red', Alta: 'amber', Normal: 'blue' }

export default function Tributos() {
  const toast = useToast()
  const [lista, setLista] = useState<Obrigacao[]>(seed)
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [busca, setBusca] = useState('')
  const [ver, setVer] = useState<Obrigacao | null>(null)
  const [pagar, setPagar] = useState<Obrigacao | null>(null)
  const [forma, setForma] = useState('PIX')

  const filtrados = lista.filter((o) => {
    const f =
      filtro === 'todos' ||
      (filtro === 'urgentes' && o.prioridade === 'Urgente' && o.status !== 'Pago') ||
      (filtro === 'avencer' && (o.status === 'A vencer' || o.status === 'Pendente')) ||
      (filtro === 'atrasados' && o.status === 'Atrasado') ||
      (filtro === 'pagos' && o.status === 'Pago')
    return f && matches(busca, o.cliente, o.codigo, o.referencia)
  })

  const hoje = lista.filter((o) => o.status === 'Vencendo hoje').length
  const aVencer = lista.filter((o) => o.status === 'A vencer' || o.status === 'Pendente').length
  const total = lista.reduce((s, o) => s + o.valor, 0)

  function exportarCalendario() {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HUBContabil//Calendario Fiscal//PT',
      ...lista.flatMap((o) => {
        const [d, m, y] = o.vencimento.split('/')
        return ['BEGIN:VEVENT', `DTSTART;VALUE=DATE:${y}${m}${d}`, `SUMMARY:${o.codigo} — ${o.cliente} (${brl(o.valor)})`, 'END:VEVENT']
      }),
      'END:VCALENDAR',
    ].join('\r\n')
    downloadFile('calendario_fiscal.ics', ics, 'text/calendar')
    toast('Calendário fiscal exportado (.ics)')
  }

  function confirmarPagamento() {
    if (!pagar) return
    setLista((l) => l.map((x) => (x.id === pagar.id ? { ...x, status: 'Pago' } : x)))
    toast(`${pagar.codigo} de ${pagar.cliente} marcada como paga via ${forma}`)
    setPagar(null)
  }

  return (
    <div className="space-y-5">
      <PageTitle
        title="Tributos e Obrigações"
        subtitle="Consolidado de vencimentos por cliente"
        actions={
          <Button variant="outline" onClick={exportarCalendario}>
            Exportar calendário
          </Button>
        }
      />

      {hoje > 0 && (
        <button
          onClick={() => setFiltro('urgentes')}
          className="flex w-full cursor-pointer items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-[13px]"
        >
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="font-semibold text-red-700">{hoje} obrigações urgentes vencendo hoje</span>
          <span className="text-xs text-red-500">— ação imediata necessária</span>
        </button>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total obrigações', value: lista.length, color: 'bg-brand' },
          { label: 'Vencendo hoje', value: hoje, color: 'bg-red-500' },
          { label: 'A vencer (7 dias)', value: aVencer, color: 'bg-amber-600' },
          { label: 'Valor total', value: brl(total), color: 'bg-emerald-500', small: true },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-[11px] text-slate-500">{s.label}</p>
            <p className={`num mt-2 text-ink ${s.small ? 'text-[17px]' : 'text-[24px]'}`}>{s.value}</p>
            <Progress value={60} color={s.color} className="mt-3" />
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Chips
          value={filtro}
          onChange={setFiltro}
          options={[
            { value: 'todos', label: 'Todos' },
            { value: 'urgentes', label: 'Urgentes' },
            { value: 'avencer', label: 'A Vencer' },
            { value: 'atrasados', label: 'Atrasados' },
            { value: 'pagos', label: 'Pagos' },
          ]}
        />
        <SearchInput value={busca} onChange={setBusca} placeholder="Buscar cliente ou código..." className="min-w-56 flex-1" />
      </div>

      <Card className="overflow-hidden">
        <Table head={['Código', 'Cliente', 'Tipo', 'Referência', 'Vencimento', 'Valor', 'Status', 'Prioridade', 'Ações']}>
          {filtrados.length === 0 && <EmptyRow cols={9} />}
          {filtrados.map((o) => (
            <tr key={o.id} className="hover:bg-slate-50/60">
              <Td>
                <span className="num rounded-md bg-brand/5 px-2 py-1 text-xs text-brand">{o.codigo}</span>
              </Td>
              <Td className="font-bold text-ink">{o.cliente}</Td>
              <Td>
                <Badge tone={o.tipo === 'PJ' ? 'blue' : 'sky'}>{o.tipo}</Badge>
              </Td>
              <Td className="num text-xs">{o.referencia}</Td>
              <Td className="num text-xs">{o.vencimento}</Td>
              <Td className="num font-medium text-ink">{brl(o.valor)}</Td>
              <Td>
                <Badge tone={statusTone[o.status]}>{o.status}</Badge>
              </Td>
              <Td>
                <Badge tone={prioTone[o.prioridade]}>{o.prioridade}</Badge>
              </Td>
              <Td right>
                <div className="flex justify-end gap-1.5">
                  {o.status === 'Pago' ? (
                    <Button size="sm" variant="secondary" onClick={() => downloadFile(`comprovante_${o.codigo}_${o.cliente.replace(/ /g, '_')}.pdf`)}>
                      Comprov.
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" className="border-emerald-200! bg-emerald-50! text-emerald-700!" onClick={() => setPagar(o)}>
                      Pagar
                    </Button>
                  )}
                  <Button size="sm" variant="secondary" onClick={() => setVer(o)}>
                    Ver
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal
        open={!!ver}
        onClose={() => setVer(null)}
        title={`${ver?.codigo} — ${ver?.cliente}`}
        subtitle={`Referência ${ver?.referencia}`}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={async () => {
                const ok = await copyText(`00020126580014BR.GOV.BCB.PIX0136${ver?.id}-hubcontabil5204000053039865406${ver?.valor.toFixed(2)}`)
                toast(ok ? 'Código PIX copiado' : 'Não foi possível copiar', ok ? 'success' : 'warning')
              }}
            >
              Copiar PIX
            </Button>
            <Button variant="secondary" onClick={() => ver && toast(`Guia enviada para ${ver.cliente}`, 'info')}>
              Enviar ao cliente
            </Button>
            <Button onClick={() => ver && downloadFile(`${ver.codigo}_${ver.cliente.replace(/ /g, '_')}.pdf`)}>Baixar guia</Button>
          </>
        }
      >
        {ver && (
          <>
            <InfoRow label="Cliente" value={ver.cliente} />
            <InfoRow label="Tipo" value={ver.tipo} />
            <InfoRow label="Vencimento" value={ver.vencimento} />
            <InfoRow label="Valor" value={brl(ver.valor)} />
            <InfoRow label="Status" value={<Badge tone={statusTone[ver.status]}>{ver.status}</Badge>} />
            <InfoRow label="Prioridade" value={<Badge tone={prioTone[ver.prioridade]}>{ver.prioridade}</Badge>} />
          </>
        )}
      </Modal>

      <Modal
        open={!!pagar}
        onClose={() => setPagar(null)}
        title="Registrar pagamento"
        subtitle={`${pagar?.codigo} — ${pagar?.cliente}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setPagar(null)}>Cancelar</Button>
            <Button variant="success" onClick={confirmarPagamento}>Confirmar pagamento</Button>
          </>
        }
      >
        {pagar && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-xs text-muted">Valor da guia</p>
              <p className="num mt-1 text-2xl text-ink">{brl(pagar.valor)}</p>
              <p className="mt-1 text-xs text-muted">Vencimento {pagar.vencimento}</p>
            </div>
            <Field label="Forma de pagamento">
              <Select value={forma} onChange={setForma} options={['PIX', 'Débito automático', 'Boleto', 'Pago pelo cliente']} className="w-full" />
            </Field>
          </div>
        )}
      </Modal>
    </div>
  )
}
