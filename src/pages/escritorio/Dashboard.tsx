import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, Badge, Button, Modal, Field, Input, Select, Textarea, Progress, Avatar, InfoRow, type Tone } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { cn } from '../../lib/utils'
import { clientes, responsaveis } from './data'

type Pend = { id: number; cliente: string; tipo: 'PJ' | 'PF'; texto: string; prioridade: 'Alta' | 'Normal' | 'Urgente' }
const prioTone: Record<Pend['prioridade'], Tone> = { Alta: 'amber', Normal: 'blue', Urgente: 'red' }

type Rotina = { quando: string; texto: string; tone: 'red' | 'amber' | 'gray' }

export default function Dashboard() {
  const toast = useToast()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const [pendencias, setPendencias] = useState<Pend[]>([
    { id: 1, cliente: 'Beta Assessoria', tipo: 'PJ', texto: 'Extrato bancário setembro — aguardando', prioridade: 'Alta' },
    { id: 2, cliente: 'Maria Souza', tipo: 'PF', texto: 'Comprovante plano de saúde 2024', prioridade: 'Normal' },
    { id: 3, cliente: 'Gama Fiscal', tipo: 'PJ', texto: 'e-CNPJ A1 vence em 18 dias', prioridade: 'Alta' },
    { id: 4, cliente: 'Delta Contadores', tipo: 'PJ', texto: 'Guia DAS pendente de envio', prioridade: 'Urgente' },
  ])
  const [rotinas, setRotinas] = useState<Rotina[]>([
    { quando: 'Hoje', texto: 'DAS Simples — Alfa Contabilidade', tone: 'red' },
    { quando: 'Amanhã', texto: 'FGTS Digital — 3 clientes', tone: 'amber' },
    { quando: '20 Out', texto: 'Simples Nacional — 12 clientes', tone: 'gray' },
    { quando: '31 Out', texto: 'Prazo limite envio NF-e', tone: 'gray' },
  ])
  const [atividades, setAtividades] = useState([
    { quem: 'Alfa Contabilidade', acao: 'enviou extrato bancário', quando: 'há 5 min' },
    { quem: 'Maria Souza', acao: 'abriu nova solicitação', quando: 'há 23 min' },
    { quem: 'Beta Assessoria', acao: 'baixou guia DAS de outubro', quando: 'há 1h' },
    { quem: 'Sistema', acao: 'gerou cobranças do mês', quando: 'há 2h' },
  ])
  const [clientesAtivos, setClientesAtivos] = useState({ pj: 182, pf: 65 })
  const [solicitacoesAbertas, setSolicitacoesAbertas] = useState(12)

  const [modal, setModal] = useState<null | 'cliente' | 'solicitacao' | 'tarefa'>(null)
  const [pendSel, setPendSel] = useState<Pend | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const set = (k: string) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const log = (quem: string, acao: string) => setAtividades((a) => [{ quem, acao, quando: 'agora' }, ...a].slice(0, 6))

  const total = clientesAtivos.pj + clientesAtivos.pf
  const pjPct = Math.round((clientesAtivos.pj / total) * 100)

  function close() {
    setModal(null)
    setForm({})
  }

  function salvarCliente() {
    if (!form.nome) return toast('Informe o nome do cliente', 'warning')
    const tipo = (form.tipo ?? 'PJ') as 'PJ' | 'PF'
    setClientesAtivos((c) => (tipo === 'PJ' ? { ...c, pj: c.pj + 1 } : { ...c, pf: c.pf + 1 }))
    log(form.nome, 'foi cadastrado como novo cliente')
    toast(`Cliente ${form.nome} cadastrado com sucesso`)
    close()
  }
  function salvarSolicitacao() {
    if (!form.assunto) return toast('Informe o assunto da solicitação', 'warning')
    setSolicitacoesAbertas((n) => n + 1)
    log(form.cliente ?? clientes[0].nome, `teve solicitação aberta: ${form.assunto}`)
    toast('Solicitação criada com sucesso')
    close()
  }
  function salvarTarefa() {
    if (!form.texto) return toast('Descreva a tarefa', 'warning')
    setRotinas((r) => [...r, { quando: form.quando || 'Hoje', texto: form.texto, tone: 'amber' }])
    toast('Tarefa adicionada à agenda')
    close()
  }

  const stats = [
    { label: 'Clientes ativos', value: total, sub: `${clientesAtivos.pj} PJ · ${clientesAtivos.pf} PF`, color: 'bg-brand', pct: 65 },
    { label: 'Pendências abertas', value: pendencias.length + 30, sub: `${pendencias.filter((p) => p.prioridade !== 'Normal').length + 5} urgentes`, color: 'bg-red-600', pct: 65 },
    { label: 'Obrigações esta semana', value: 19, sub: 'vencimentos próximos', color: 'bg-amber-600', pct: 65 },
    { label: 'Solicitações abertas', value: solicitacoesAbertas, sub: '3 aguardando cliente', color: 'bg-violet-500', pct: 65 },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-xs font-medium text-slate-500">{s.label}</p>
            <p className="num mt-3 text-[26px] leading-tight text-ink">{s.value}</p>
            <p className="mt-1.5 text-xs text-muted">{s.sub}</p>
            <Progress value={s.pct} color={s.color} className="mt-4" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[
          { label: 'Pessoa Jurídica', word: 'Jurídica', value: clientesAtivos.pj, pct: pjPct, color: 'bg-brand', box: 'bg-brand/10 text-brand', badge: 'bg-brand/10 text-brand' },
          { label: 'Pessoa Física', word: 'Física', value: clientesAtivos.pf, pct: 100 - pjPct, color: 'bg-sky-400', box: 'bg-sky-50 text-sky-500', badge: 'bg-sky-50 text-sky-600' },
        ].map((c) => (
          <Card key={c.label} className="cursor-pointer p-4 transition hover:border-brand/30" onClick={() => navigate('/escritorio/clientes')}>
            <div className="flex items-center gap-4">
              <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[10px] font-bold italic', c.box)}>
                {c.word}
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500">{c.label}</p>
                <p className="num text-[22px] leading-tight text-ink">{c.value}</p>
                <Progress value={c.pct} color={c.color} className="mt-2" />
              </div>
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', c.badge)}>{c.pct}%</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader title="Pendências" right={<Badge tone="red">{pendencias.length} abertas</Badge>} />
          <div className="space-y-2 px-4 pb-4">
            {pendencias.length === 0 && <p className="py-8 text-center text-xs text-muted">Nenhuma pendência em aberto 🎉</p>}
            {pendencias.map((p) => (
              <button
                key={p.id}
                onClick={() => setPendSel(p)}
                className="w-full cursor-pointer rounded-xl border border-line bg-slate-50/60 p-3 text-left transition hover:border-brand/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-bold text-ink">
                    {p.cliente}{' '}
                    <span className={cn('ml-1 text-[10px] font-semibold', p.tipo === 'PJ' ? 'text-brand' : 'text-sky-500')}>{p.tipo}</span>
                  </p>
                  <Badge tone={prioTone[p.prioridade]}>{p.prioridade}</Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">{p.texto}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Agenda / Rotinas" subtitle={<span className="num tracking-widest text-slate-300">OUTUBRO 2024</span>} />
          <div className="space-y-3 px-5">
            {rotinas.map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    r.tone === 'red' ? 'bg-red-500' : r.tone === 'amber' ? 'bg-amber-500' : 'bg-slate-300',
                  )}
                />
                <span className="num w-16 shrink-0 text-xs text-slate-400">{r.quando}</span>
                <span className={cn('text-[12.5px]', i === 0 ? 'font-bold text-ink' : 'text-slate-600')}>{r.texto}</span>
              </div>
            ))}
          </div>
          <div className="mx-5 mt-4 border-t border-line pt-4 pb-5">
            <p className="mb-3 text-xs font-bold text-ink">Ações Rápidas</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setModal('cliente')} className="cursor-pointer rounded-lg border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/10">
                + Novo Cliente
              </button>
              <button onClick={() => setModal('solicitacao')} className="cursor-pointer rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-100">
                + Nova Solicitação
              </button>
              <button onClick={() => fileRef.current?.click()} className="cursor-pointer rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-600 hover:bg-sky-100">
                Enviar Documento
              </button>
              <button onClick={() => setModal('tarefa')} className="cursor-pointer rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
                Adicionar Tarefa
              </button>
              <input
                ref={fileRef}
                type="file"
                multiple
                hidden
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? [])
                  if (files.length) {
                    toast(`${files.length} documento(s) enviado(s): ${files.map((f) => f.name).join(', ')}`)
                    log('Carlos Andrade', `enviou ${files.length} documento(s)`)
                  }
                  e.target.value = ''
                }}
              />
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Atividade Recente" />
          <div className="space-y-4 px-5 pb-5">
            {atividades.map((a, i) => (
              <div key={i} className="flex gap-3">
                <Avatar text={a.quem[0]} size={26} />
                <p className="flex-1 text-xs leading-relaxed text-slate-500">
                  <span className="font-bold text-ink">{a.quem}</span> {a.acao}
                </p>
                <span className="shrink-0 text-[10px] text-muted">{a.quando}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detalhe pendência */}
      <Modal
        open={!!pendSel}
        onClose={() => setPendSel(null)}
        title={pendSel?.cliente}
        subtitle="Detalhes da pendência"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendSel(null)}>
              Fechar
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                toast(`Lembrete enviado para ${pendSel?.cliente}`, 'info')
                setPendSel(null)
              }}
            >
              Cobrar cliente
            </Button>
            <Button
              onClick={() => {
                setPendencias((p) => p.filter((x) => x.id !== pendSel?.id))
                log(pendSel!.cliente, 'teve pendência resolvida')
                toast('Pendência marcada como resolvida')
                setPendSel(null)
              }}
            >
              Marcar como resolvida
            </Button>
          </>
        }
      >
        {pendSel && (
          <>
            <InfoRow label="Cliente" value={pendSel.cliente} />
            <InfoRow label="Tipo" value={pendSel.tipo} />
            <InfoRow label="Descrição" value={pendSel.texto} />
            <InfoRow label="Prioridade" value={<Badge tone={prioTone[pendSel.prioridade]}>{pendSel.prioridade}</Badge>} />
          </>
        )}
      </Modal>

      <Modal
        open={modal === 'cliente'}
        onClose={close}
        title="Novo Cliente"
        subtitle="Cadastre uma empresa ou pessoa física"
        footer={
          <>
            <Button variant="secondary" onClick={close}>Cancelar</Button>
            <Button onClick={salvarCliente}>Cadastrar cliente</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Tipo">
            <Select value={form.tipo ?? 'PJ'} onChange={(v) => setForm((f) => ({ ...f, tipo: v }))} options={['PJ', 'PF']} className="w-full" />
          </Field>
          <Field label="Nome / Razão social">
            <Input value={form.nome ?? ''} onChange={set('nome')} placeholder="Ex.: Nova Empresa Ltda" />
          </Field>
          <Field label={form.tipo === 'PF' ? 'CPF' : 'CNPJ'}>
            <Input value={form.doc ?? ''} onChange={set('doc')} placeholder={form.tipo === 'PF' ? '000.000.000-00' : '00.000.000/0001-00'} />
          </Field>
        </div>
      </Modal>

      <Modal
        open={modal === 'solicitacao'}
        onClose={close}
        title="Nova Solicitação"
        footer={
          <>
            <Button variant="secondary" onClick={close}>Cancelar</Button>
            <Button onClick={salvarSolicitacao}>Abrir solicitação</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Cliente">
            <Select value={form.cliente ?? clientes[0].nome} onChange={(v) => setForm((f) => ({ ...f, cliente: v }))} options={clientes.map((c) => c.nome)} className="w-full" />
          </Field>
          <Field label="Assunto">
            <Input value={form.assunto ?? ''} onChange={set('assunto')} placeholder="Ex.: Emissão de certidão" />
          </Field>
          <Field label="Responsável">
            <Select value={form.resp ?? responsaveis[0]} onChange={(v) => setForm((f) => ({ ...f, resp: v }))} options={responsaveis} className="w-full" />
          </Field>
          <Field label="Descrição">
            <Textarea value={form.desc ?? ''} onChange={set('desc')} />
          </Field>
        </div>
      </Modal>

      <Modal
        open={modal === 'tarefa'}
        onClose={close}
        title="Adicionar Tarefa"
        footer={
          <>
            <Button variant="secondary" onClick={close}>Cancelar</Button>
            <Button onClick={salvarTarefa}>Adicionar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Tarefa">
            <Input value={form.texto ?? ''} onChange={set('texto')} placeholder="Ex.: Conferir folha — Beta Assessoria" />
          </Field>
          <Field label="Quando">
            <Input value={form.quando ?? ''} onChange={set('quando')} placeholder="Ex.: 25 Out" />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
