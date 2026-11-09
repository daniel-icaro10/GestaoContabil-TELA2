import { useState } from 'react'
import { FileText } from 'lucide-react'
import { Avatar, Badge, Button, Card, PageTitle, StatCard, Table, Tabs, Td, EmptyRow, Modal, Field, Input, Textarea } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { brl, downloadFile } from '../../lib/utils'
import { faturas as initial, type Fatura } from './data'
import { PaymentModal } from './PaymentModal'

type T = 'todas' | 'pendentes' | 'pagas'

export default function Financeiro() {
  const toast = useToast()
  const [rows, setRows] = useState(initial)
  const [tab, setTab] = useState<T>('todas')
  const [pay, setPay] = useState<Fatura | null>(null)
  const [contato, setContato] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const pendente = rows.find((r) => r.status === 'pendente')
  const pagas = rows.filter((r) => r.status === 'pago')
  const filtered = tab === 'todas' ? rows : rows.filter((r) => r.status === (tab === 'pendentes' ? 'pendente' : 'pago'))
  const totalPago = 13410 + (rows.filter((r) => r.status === 'pago').length - 3) * 1490

  const nf = (f: Fatura) => {
    downloadFile(`NFe_Honorarios_${f.comp.replace(' ', '_')}.pdf`)
    toast('NF-e de honorários baixada')
  }

  return (
    <div className="max-w-[680px] space-y-4">
      <PageTitle title="Financeiro" subtitle="Relacionamento financeiro com o escritório contábil" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Mensalidade atual" value={brl(1490)} sub="Plano Profissional" progress={70} />
        <StatCard label="Próximo vencimento" value={pendente ? '05 Out' : '05 Nov'} sub={pendente ? 'Em 5 dias' : 'Em 36 dias'} progress={70} progressColor="bg-amber-600" />
        <StatCard label="Total pago em 2024" value={brl(totalPago)} sub={`${9 + pagas.length - 3} faturas pagas`} progress={70} progressColor="bg-emerald-500" />
      </div>

      {pendente && (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <FileText size={17} />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold">Fatura de {pendente.comp}</p>
            <p className="text-[11px] text-slate-500">Vencimento: {pendente.venc} · Plano Profissional</p>
          </div>
          <span className="num text-xl text-amber-700">{brl(pendente.valor)}</span>
          <Button variant="warning" onClick={() => setPay(pendente)}>Pagar agora</Button>
          <Button variant="secondary" className="border-amber-300 bg-transparent" onClick={() => nf(pendente)}>Baixar NF</Button>
        </div>
      )}

      <Card>
        <div className="px-5 pt-4">
          <h3 className="text-[14px] font-bold">Histórico de Faturas</h3>
          <Tabs
            className="mt-2 border-0"
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'todas', label: 'Todas' },
              { value: 'pendentes', label: 'Pendentes' },
              { value: 'pagas', label: 'Pagas' },
            ]}
          />
        </div>
        <Table head={['Competência', 'Vencimento', 'Valor', 'Situação', 'Ações']} className="[&_table]:min-w-[560px]">
          {filtered.length === 0 && <EmptyRow cols={5} />}
          {filtered.map((f) => (
            <tr key={f.id}>
              <Td className="font-semibold text-ink">{f.comp}</Td>
              <Td className="num">{f.venc}</Td>
              <Td className="num text-ink">{brl(f.valor)}</Td>
              <Td>{f.status === 'pago' ? <Badge tone="green">Pago</Badge> : <Badge tone="amber">Pendente</Badge>}</Td>
              <Td right>
                <div className="flex justify-end gap-2">
                  {f.status === 'pendente' ? (
                    <Button variant="outline" size="sm" onClick={() => setPay(f)}>Pagar</Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => { downloadFile(`Comprovante_${f.comp.replace(' ', '_')}.pdf`); toast('Comprovante baixado') }}>
                      Comprovante
                    </Button>
                  )}
                  <Button variant="secondary" size="sm" onClick={() => nf(f)}>NF-e</Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card className="p-5">
        <h3 className="text-[14px] font-bold">Escritório Contábil</h3>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Avatar text="CC" size={40} gradient className="rounded-xl" />
          <div className="flex-1">
            <p className="text-[13px] font-bold">Contador Central Assessoria</p>
            <p className="text-[11px] text-muted">Plano Profissional · contato@contadorcentral.com.br</p>
          </div>
          <Button variant="soft" onClick={() => setContato(true)}>Contato</Button>
        </div>
      </Card>

      {pay && (
        <PaymentModal
          open
          onClose={() => setPay(null)}
          title={`Fatura de ${pay.comp} · Plano Profissional`}
          valor={pay.valor}
          venc={pay.venc}
          onPaid={() => setRows((r) => r.map((x) => (x.id === pay.id ? { ...x, status: 'pago' } : x)))}
        />
      )}

      <Modal
        open={contato}
        onClose={() => setContato(false)}
        title="Falar com o escritório"
        subtitle="Contador Central Assessoria"
        footer={
          <>
            <Button variant="secondary" onClick={() => window.open('mailto:contato@contadorcentral.com.br')}>Abrir e-mail</Button>
            <Button
              onClick={() => {
                if (!mensagem.trim()) return toast('Escreva uma mensagem.', 'warning')
                setContato(false)
                setMensagem('')
                toast('Mensagem enviada ao financeiro do escritório')
              }}
            >
              Enviar mensagem
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Assunto"><Input defaultValue="Dúvida sobre fatura" /></Field>
          <Field label="Mensagem"><Textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Como podemos ajudar?" /></Field>
        </div>
      </Modal>
    </div>
  )
}
