import { useState } from 'react'
import { UserPlus, CalendarDays, UserMinus, FileText, ChevronRight, Clock, Plus, MessageSquare, Send, Check, Star } from 'lucide-react'
import { Badge, Button, Card, StatCard, Table, Td, Chips, Modal, EmptyRow } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { cn } from '../../lib/utils'
import { solicitacoes as initial, type Solicitacao } from './data'
import { RequestModal } from './RequestModal'

const catalogo = [
  { titulo: 'Admitir Funcionário', desc: 'Envio de ficha cadastral e CTPS digital', tag: 'DP / RH', icon: UserPlus, cls: 'bg-indigo-50 text-indigo-500', link: 'text-brand' },
  { titulo: 'Programar Férias', desc: 'Aviso prévio e cálculo de 1/3 constitucional', tag: 'DP / RH', icon: CalendarDays, cls: 'bg-violet-50 text-violet-500', link: 'text-violet-600' },
  { titulo: 'Rescisão de Contrato', desc: 'Cálculo de verbas rescisórias e aviso', tag: 'DP / RH', icon: UserMinus, cls: 'bg-red-50 text-red-400', link: 'text-red-500' },
  { titulo: 'Certidões & Declarações', desc: 'Declaração de faturamento e certidões', tag: 'Fiscal', icon: FileText, cls: 'bg-sky-50 text-sky-500', link: 'text-brand' },
]

type F = 'todas' | 'andamento' | 'concluidas'

function StatusBadge({ s }: { s: Solicitacao['status'] }) {
  if (s === 'analise') return <Badge tone="amber" dot>Em Análise Contábil</Badge>
  if (s === 'assinatura') return <Badge tone="sky" dot>Aguardando Assinatura</Badge>
  return <Badge tone="green"><Check size={11} /> Concluído &amp; Arquivado</Badge>
}

export default function Solicitacoes() {
  const toast = useToast()
  const [rows, setRows] = useState(initial)
  const [f, setF] = useState<F>('todas')
  const [form, setForm] = useState<{ open: boolean; subject: string; tipo?: string }>({ open: false, subject: '' })
  const [chatId, setChatId] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  const andamento = rows.filter((r) => r.status !== 'concluido')
  const concl = rows.filter((r) => r.status === 'concluido')
  const filtered = f === 'todas' ? rows : f === 'andamento' ? andamento : concl
  const chat = rows.find((r) => r.id === chatId) ?? null

  const send = () => {
    if (!msg.trim() || !chat) return
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    setRows((rs) => rs.map((r) => (r.id === chat.id ? { ...r, mensagens: [...r.mensagens, { de: 'cliente', texto: msg, hora }] } : r)))
    setMsg('')
    const id = chat.id
    setTimeout(() => {
      setRows((rs) =>
        rs.map((r) =>
          r.id === id
            ? { ...r, mensagens: [...r.mensagens, { de: 'contador', texto: 'Mensagem recebida! Carlos Eduardo responderá em breve.', hora }] }
            : r,
        ),
      )
    }, 1200)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-bold">Catálogo de Serviços Contábeis</h2>
          <p className="text-xs text-muted">Selecione o serviço desejado para preencher a solicitação guiada</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-brand">
          <Clock size={14} /> SLA Médio de Resposta: 4h úteis
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {catalogo.map((c) => (
          <Card key={c.titulo} className="flex flex-col p-4">
            <div className="flex items-start justify-between">
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', c.cls)}>
                <c.icon size={17} />
              </div>
              <span className="rounded-md border border-line px-1.5 py-0.5 text-[9px] font-bold text-slate-500">{c.tag}</span>
            </div>
            <p className="mt-4 text-[13px] font-bold">{c.titulo}</p>
            <p className="mt-0.5 flex-1 text-[11px] text-slate-500">{c.desc}</p>
            <button
              onClick={() => setForm({ open: true, subject: c.titulo, tipo: c.titulo })}
              className={cn('mt-4 flex cursor-pointer items-center justify-between border-t border-line pt-3 text-[11px] font-semibold underline-offset-2 hover:underline', c.link)}
            >
              Iniciar Solicitação <ChevronRight size={14} />
            </button>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Solicitações em Aberto" value={`${andamento.length} Pedidos`} badge={<Badge tone="amber">{andamento.length} ativas</Badge>} sub="Em processamento pela equipe contábil" />
        <StatCard label="Concluídas no Mês" value="14 Demandas" valueClass="text-emerald-600" badge={<Badge tone="green">100% no prazo</Badge>} sub="Histórico arquivado no cofre" />
        <StatCard
          label="Satisfação do Atendimento"
          value="4.9 / 5.0"
          icon={
            <span className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} fill="currentColor" />
              ))}
            </span>
          }
          sub="Avaliação da titular Sheila Rozendo"
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Chips
            value={f}
            onChange={setF}
            options={[
              { value: 'todas', label: `Todas (${rows.length})` },
              { value: 'andamento', label: `Em Andamento (${andamento.length})` },
              { value: 'concluidas', label: `Concluídas (${concl.length})` },
            ]}
          />
          <Button icon={<Plus size={15} />} onClick={() => setForm({ open: true, subject: '' })}>
            Nova Solicitação Avulsa
          </Button>
        </div>
        <Table head={['Protocolo', 'Assunto / Demanda', 'Solicitante', 'Abertura', 'Status do Pedido', 'Ações']}>
          {filtered.length === 0 && <EmptyRow cols={6} />}
          {filtered.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50/50">
              <Td className="num text-brand">{r.protocolo}</Td>
              <Td>
                <p className="font-semibold text-ink">{r.assunto}</p>
                <p className="text-[11px] text-muted">{r.detalhe}</p>
              </Td>
              <Td className="font-medium text-ink">{r.solicitante}</Td>
              <Td className="text-[12px]">{r.abertura}</Td>
              <Td><StatusBadge s={r.status} /></Td>
              <Td right>
                <Button variant="outline" size="sm" icon={<MessageSquare size={13} />} onClick={() => setChatId(r.id)}>
                  Ver Chat / Detalhes
                </Button>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <RequestModal
        open={form.open}
        onClose={() => setForm({ open: false, subject: '' })}
        title={form.tipo ? `Solicitação: ${form.tipo}` : 'Nova Solicitação Avulsa'}
        subtitle="Preencha as informações e a equipe contábil dará andamento"
        defaultSubject={form.subject}
        types={form.tipo ? undefined : ['Dúvida fiscal', 'Departamento Pessoal', 'Certidões', 'Societário', 'Outros']}
        onSubmit={(d) =>
          setRows((rs) => [
            {
              id: 's' + Date.now(),
              protocolo: d.protocolo,
              assunto: d.assunto,
              detalhe: d.descricao || d.tipo || 'Solicitação avulsa',
              solicitante: 'Sheila Rozendo (Você)',
              abertura: 'Agora',
              status: 'analise',
              mensagens: d.descricao ? [{ de: 'cliente', texto: d.descricao, hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }] : [],
            },
            ...rs,
          ])
        }
      />

      <Modal
        open={!!chat}
        onClose={() => setChatId(null)}
        title={chat ? `${chat.protocolo} · ${chat.assunto}` : ''}
        subtitle={chat?.detalhe}
        width="max-w-xl"
        footer={
          chat && chat.status === 'assinatura' ? (
            <Button
              onClick={() => {
                setRows((rs) => rs.map((r) => (r.id === chat.id ? { ...r, status: 'concluido' } : r)))
                toast('Documento assinado digitalmente!')
              }}
            >
              Assinar documento
            </Button>
          ) : undefined
        }
      >
        {chat && (
          <>
            <div className="mb-3"><StatusBadge s={chat.status} /></div>
            <div className="space-y-2.5 rounded-xl bg-slate-50 p-3">
              {chat.mensagens.length === 0 && <p className="py-4 text-center text-xs text-muted">Nenhuma mensagem ainda.</p>}
              {chat.mensagens.map((m, i) => (
                <div key={i} className={cn('flex', m.de === 'cliente' ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[80%] rounded-xl px-3 py-2 text-[12px]', m.de === 'cliente' ? 'bg-brand text-white' : 'border border-line bg-white text-ink')}>
                    <p>{m.texto}</p>
                    <p className={cn('mt-1 text-[10px]', m.de === 'cliente' ? 'text-white/70' : 'text-muted')}>
                      {m.de === 'cliente' ? 'Você' : 'Carlos Eduardo'} · {m.hora}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Escreva uma mensagem..."
                className="h-10 flex-1 rounded-lg border border-line px-3 text-[13px] outline-none focus:border-brand/50"
              />
              <Button onClick={send} icon={<Send size={14} />}>Enviar</Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
