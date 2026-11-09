import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Badge, Button, Card, PageTitle, Modal, InfoRow } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { cn } from '../../lib/utils'
import { RequestModal } from './RequestModal'

const socios = [
  { nome: 'João da Silva', ini: 'Jd', cargo: 'Sócio-Administrador', cpf: '123.456.789-00', pct: 60, color: 'bg-brand', text: 'text-brand', box: 'bg-indigo-50 text-brand', email: 'joao@techfounders.com.br', entrada: '01/2022' },
  { nome: 'Maria Fernandes', ini: 'MF', cargo: 'Sócia', cpf: '987.654.321-00', pct: 40, color: 'bg-violet-500', text: 'text-violet-500', box: 'bg-violet-50 text-violet-500', email: 'maria@techfounders.com.br', entrada: '03/2023' },
]

type Hist = { data: string; desc: string; status: 'Concluído' | 'Em análise' }

export default function Socios() {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [sel, setSel] = useState<(typeof socios)[number] | null>(null)
  const [hist, setHist] = useState<Hist[]>([
    { data: '10/2024', desc: 'Alteração de endereço societário', status: 'Concluído' },
    { data: '03/2023', desc: 'Entrada de sócia — Maria Fernandes (40%)', status: 'Concluído' },
    { data: '01/2022', desc: 'Constituição da empresa — João da Silva (100%)', status: 'Concluído' },
  ])

  return (
    <div className="max-w-[680px] space-y-4">
      <PageTitle
        title="Quadro Societário"
        subtitle="Tech Founders Ltda · CNPJ 12.345.678/0001-90"
        actions={<Button icon={<Plus size={15} />} onClick={() => setOpen(true)}>Solicitar alteração</Button>}
      />

      <Card className="p-5">
        <h3 className="text-[14px] font-bold">Distribuição de Capital</h3>
        <div className="mt-4 flex h-2 gap-1">
          {socios.map((s) => (
            <div key={s.nome} className={cn('h-full rounded-full', s.color)} style={{ width: `${s.pct}%` }} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-5">
          {socios.map((s) => (
            <span key={s.nome} className="flex items-center gap-1.5 text-[12px]">
              <span className={cn('h-2 w-2 rounded-full', s.color)} />
              <span className="font-semibold text-ink">{s.nome}</span>
              <span className="num text-slate-400">{s.pct}%</span>
            </span>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {socios.map((s) => (
          <Card key={s.nome} className="cursor-pointer p-5 transition hover:border-brand/30" onClick={() => setSel(s)}>
            <div className="flex items-start gap-3">
              <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl text-[14px] font-bold', s.box)}>{s.ini}</div>
              <div className="flex-1">
                <p className="text-[14px] font-bold">{s.nome}</p>
                <p className="text-[11px] text-muted">{s.cargo}</p>
              </div>
              <Badge tone="green">Ativo</Badge>
            </div>
            <div className="mt-4 flex justify-between text-[12px]">
              <span className="text-muted">CPF</span>
              <span className="num text-ink">{s.cpf}</span>
            </div>
            <div className="mt-2 flex justify-between text-[12px]">
              <span className="text-muted">Participação</span>
              <span className={cn('num', s.text)}>{s.pct}%</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="text-[14px] font-bold">Histórico de Alterações</h3>
        <div className="mt-3 divide-y divide-line">
          {hist.map((h, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <span className="num w-16 text-[12px] text-slate-400">{h.data}</span>
              <span className="flex-1 text-[12px] text-slate-600">{h.desc}</span>
              <Badge tone={h.status === 'Concluído' ? 'green' : 'amber'}>{h.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <RequestModal
        open={open}
        onClose={() => setOpen(false)}
        title="Solicitar alteração societária"
        subtitle="O escritório analisará e retornará com o orçamento e prazos"
        types={['Entrada de sócio', 'Saída de sócio', 'Alteração de participação', 'Alteração de endereço', 'Alteração de capital social', 'Outra']}
        onSubmit={(d) =>
          setHist((h) => [
            { data: new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' }), desc: `${d.tipo} — ${d.assunto}`, status: 'Em análise' },
            ...h,
          ])
        }
      />

      <Modal
        open={!!sel}
        onClose={() => setSel(null)}
        title={sel?.nome ?? ''}
        subtitle={sel?.cargo}
        footer={<Button variant="secondary" onClick={() => { setSel(null); toast('Ficha do sócio exportada', 'info') }}>Exportar ficha</Button>}
      >
        {sel && (
          <>
            <InfoRow label="CPF" value={sel.cpf} />
            <InfoRow label="E-mail" value={sel.email} />
            <InfoRow label="Participação" value={`${sel.pct}%`} />
            <InfoRow label="Entrada na sociedade" value={sel.entrada} />
            <InfoRow label="Situação" value={<Badge tone="green">Ativo</Badge>} />
          </>
        )}
      </Modal>
    </div>
  )
}
