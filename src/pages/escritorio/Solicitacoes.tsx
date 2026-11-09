import { useMemo, useState } from 'react'
import { Plus, Send } from 'lucide-react'
import { Badge, Button, Card, Chips, Field, Input, Modal, PageTitle, SearchInput, Select, StatCard, Textarea } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { cn, matches } from '../../lib/utils'
import {
  clientesLista,
  responsaveis,
  solicitacoesIniciais,
  solPrioridadeTone,
  solStatusTone,
  type EsSolicitacao,
  type SolPrioridade,
  type SolStatus,
} from './data2'

const statusOpts: SolStatus[] = ['Aberto', 'Em andamento', 'Aguardando', 'Resolvido']
const pfClientes = ['Maria Souza', 'João Ferreira']
const agora = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

export default function Solicitacoes() {
  const toast = useToast()
  const [items, setItems] = useState<EsSolicitacao[]>(solicitacoesIniciais)
  const [filtro, setFiltro] = useState<'Todos' | SolStatus>('Todos')
  const [busca, setBusca] = useState('')
  const [abertaId, setAbertaId] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const [nova, setNova] = useState(false)
  const [form, setForm] = useState({ cliente: clientesLista[0], assunto: '', prioridade: 'Normal' as SolPrioridade, responsavel: 'Carlos', descricao: '' })

  const aberta = items.find((i) => i.id === abertaId) ?? null
  const lista = useMemo(
    () => items.filter((i) => (filtro === 'Todos' || i.status === filtro) && matches(busca, i.cliente, i.assunto, i.id)),
    [items, filtro, busca],
  )
  const count = (s: SolStatus) => items.filter((i) => i.status === s).length

  const update = (id: string, patch: Partial<EsSolicitacao>) => setItems((all) => all.map((i) => (i.id === id ? { ...i, ...patch } : i)))

  const enviar = () => {
    if (!aberta || !msg.trim()) return
    update(aberta.id, {
      mensagens: [...aberta.mensagens, { autor: 'Carlos Andrade', texto: msg.trim(), hora: agora(), escritorio: true }],
      status: aberta.status === 'Aberto' ? 'Em andamento' : aberta.status,
    })
    setMsg('')
  }

  const criar = () => {
    if (!form.assunto.trim()) return toast('Informe o assunto da solicitação', 'warning')
    const maxId = Math.max(...items.map((i) => Number(i.id.slice(1))))
    const id = `#${String(maxId + 1).padStart(4, '0')}`
    setItems((all) => [
      {
        id,
        cliente: form.cliente,
        tipo: pfClientes.includes(form.cliente) ? 'PF' : 'PJ',
        assunto: form.assunto,
        responsavel: form.responsavel,
        data: `hoje ${agora()}`,
        prioridade: form.prioridade,
        status: 'Aberto',
        mensagens: form.descricao ? [{ autor: 'Carlos Andrade', texto: form.descricao, hora: agora(), escritorio: true }] : [],
      },
      ...all,
    ])
    setNova(false)
    setForm({ cliente: clientesLista[0], assunto: '', prioridade: 'Normal', responsavel: 'Carlos', descricao: '' })
    toast(`Solicitação ${id} criada`)
  }

  return (
    <div className="space-y-5">
      <PageTitle
        title="Solicitações"
        subtitle={`Central de atendimento · ${items.length} solicitações no mês`}
        actions={
          <Button icon={<Plus size={15} />} className="!bg-violet-500" onClick={() => setNova(true)}>
            Nova solicitação
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Abertos" value={count('Aberto')} progress={60} />
        <StatCard label="Em andamento" value={count('Em andamento')} progress={60} progressColor="bg-amber-600" />
        <StatCard label="Aguardando" value={count('Aguardando')} progress={60} progressColor="bg-violet-500" />
        <StatCard label="Resolvidos (mês)" value={23 + count('Resolvido')} progress={60} progressColor="bg-emerald-500" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chips
          value={filtro}
          onChange={setFiltro}
          options={[
            { value: 'Todos' as const, label: 'Todos' },
            { value: 'Aberto' as const, label: 'Abertos' },
            { value: 'Em andamento' as const, label: 'Em andamento' },
            { value: 'Aguardando' as const, label: 'Aguardando' },
            { value: 'Resolvido' as const, label: 'Resolvidos' },
          ]}
        />
        <SearchInput value={busca} onChange={setBusca} placeholder="Buscar cliente ou assunto..." className="min-w-56 flex-1" />
      </div>

      <Card className="p-4">
        {lista.length === 0 && <p className="py-10 text-center text-[13px] text-muted">Nenhuma solicitação encontrada.</p>}
        {lista.map((s) => (
          <div key={s.id} className="flex flex-wrap items-center gap-4 rounded-xl px-3 py-3.5 hover:bg-slate-50">
            <span className="num w-14 text-[13px] text-slate-400">{s.id}</span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-[13px] font-bold text-ink">
                {s.cliente}
                <Badge tone={s.tipo === 'PJ' ? 'blue' : 'sky'}>{s.tipo}</Badge>
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{s.assunto}</p>
            </div>
            <span className="w-16 text-right text-xs text-slate-400">{s.responsavel}</span>
            <span className="num w-28 text-right text-[12px] text-slate-400">{s.data}</span>
            <Badge tone={solPrioridadeTone[s.prioridade]}>{s.prioridade}</Badge>
            <Badge tone={solStatusTone[s.status]}>{s.status}</Badge>
            <Button size="sm" className="!border-violet-200 !bg-violet-50 !text-violet-600" variant="soft" onClick={() => setAbertaId(s.id)}>
              Abrir
            </Button>
          </div>
        ))}
      </Card>

      {/* Detalhes / chat */}
      <Modal
        open={!!aberta}
        onClose={() => setAbertaId(null)}
        width="max-w-2xl"
        title={aberta ? `${aberta.id} · ${aberta.assunto}` : ''}
        subtitle={aberta ? `${aberta.cliente} (${aberta.tipo}) · aberta ${aberta.data}` : ''}
        footer={
          aberta && (
            <>
              {aberta.status !== 'Resolvido' && (
                <Button
                  variant="success"
                  onClick={() => {
                    update(aberta.id, { status: 'Resolvido' })
                    toast(`Solicitação ${aberta.id} marcada como resolvida`)
                  }}
                >
                  Marcar como resolvida
                </Button>
              )}
              <Button variant="secondary" onClick={() => setAbertaId(null)}>
                Fechar
              </Button>
            </>
          )
        }
      >
        {aberta && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label="Status">
                <Select
                  value={aberta.status}
                  onChange={(v) => {
                    update(aberta.id, { status: v as SolStatus })
                    toast(`Status alterado para "${v}"`, 'info')
                  }}
                  options={statusOpts}
                  className="w-full"
                />
              </Field>
              <Field label="Prioridade">
                <Select
                  value={aberta.prioridade}
                  onChange={(v) => update(aberta.id, { prioridade: v as SolPrioridade })}
                  options={['Normal', 'Alta', 'Urgente']}
                  className="w-full"
                />
              </Field>
              <Field label="Responsável">
                <Select value={aberta.responsavel} onChange={(v) => update(aberta.id, { responsavel: v })} options={responsaveis} className="w-full" />
              </Field>
            </div>

            <div className="scroll-thin max-h-72 space-y-3 overflow-y-auto rounded-xl border border-line bg-slate-50/60 p-4">
              {aberta.mensagens.length === 0 && <p className="text-center text-xs text-muted">Nenhuma mensagem ainda.</p>}
              {aberta.mensagens.map((m, i) => (
                <div key={i} className={cn('flex', m.escritorio ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px]',
                      m.escritorio ? 'rounded-br-sm bg-brand text-white' : 'rounded-bl-sm border border-line bg-surface text-ink',
                    )}
                  >
                    <p className={cn('mb-0.5 text-[10px] font-semibold', m.escritorio ? 'text-white/70' : 'text-muted')}>
                      {m.autor} · {m.hora}
                    </p>
                    {m.texto}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && enviar()}
                placeholder="Escreva uma resposta para o cliente..."
              />
              <Button icon={<Send size={14} />} onClick={enviar} disabled={!msg.trim()}>
                Enviar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Nova solicitação */}
      <Modal
        open={nova}
        onClose={() => setNova(false)}
        title="Nova solicitação"
        subtitle="Abra um ticket em nome de um cliente"
        footer={
          <>
            <Button variant="secondary" onClick={() => setNova(false)}>
              Cancelar
            </Button>
            <Button onClick={criar}>Criar solicitação</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Cliente">
            <Select value={form.cliente} onChange={(v) => setForm((f) => ({ ...f, cliente: v }))} options={clientesLista} className="w-full" />
          </Field>
          <Field label="Assunto">
            <Input value={form.assunto} onChange={(e) => setForm((f) => ({ ...f, assunto: e.target.value }))} placeholder="Ex.: Emissão de certidão" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prioridade">
              <Select
                value={form.prioridade}
                onChange={(v) => setForm((f) => ({ ...f, prioridade: v as SolPrioridade }))}
                options={['Normal', 'Alta', 'Urgente']}
                className="w-full"
              />
            </Field>
            <Field label="Responsável">
              <Select value={form.responsavel} onChange={(v) => setForm((f) => ({ ...f, responsavel: v }))} options={responsaveis} className="w-full" />
            </Field>
          </div>
          <Field label="Descrição">
            <Textarea value={form.descricao} onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} placeholder="Detalhes da solicitação..." />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
