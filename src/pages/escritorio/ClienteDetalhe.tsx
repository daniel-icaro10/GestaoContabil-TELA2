import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Mail, Phone, MapPin, Download, Plus } from 'lucide-react'
import { Card, CardHeader, Badge, Button, Tabs, Table, Td, EmptyRow, Avatar, InfoRow, Modal, Field, Input, Textarea, CodeTag, StatCard, type Tone } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { brl, downloadFile } from '../../lib/utils'
import { clientes, obrigacoes, documentosCliente, solicitacoesCliente, faturasCliente } from './data'

type Aba = 'geral' | 'obrigacoes' | 'documentos' | 'solicitacoes' | 'financeiro'

const statusTone: Record<string, Tone> = {
  'Vencendo hoje': 'red',
  'A vencer': 'amber',
  Pendente: 'violet',
  Atrasado: 'red',
  Pago: 'green',
  'Em atraso': 'red',
  Aberto: 'blue',
  'Em andamento': 'amber',
  Aguardando: 'violet',
  Resolvido: 'green',
}

export default function ClienteDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const cliente = clientes.find((c) => c.id === id)
  const [aba, setAba] = useState<Aba>('geral')
  const [obrs, setObrs] = useState(() => obrigacoes.filter((o) => o.cliente === cliente?.nome))
  const [sols, setSols] = useState(() => solicitacoesCliente.filter((s) => s.cliente === cliente?.nome))
  const [fats, setFats] = useState(() => faturasCliente.filter((f) => f.cliente === cliente?.nome))
  const docs = documentosCliente.filter((d) => d.cliente === cliente?.nome)
  const [msgOpen, setMsgOpen] = useState(false)
  const [solOpen, setSolOpen] = useState(false)
  const [form, setForm] = useState({ assunto: '', texto: '' })

  if (!cliente) {
    return (
      <Card className="p-10 text-center">
        <p className="text-sm text-slate-500">Cliente não encontrado.</p>
        <Link to="/escritorio/clientes" className="mt-3 inline-block text-sm font-semibold text-brand">
          Voltar para clientes
        </Link>
      </Card>
    )
  }

  const emAberto = obrs.filter((o) => o.status !== 'Pago')

  return (
    <div className="space-y-5">
      <Link to="/escritorio/clientes" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand">
        <ArrowLeft size={14} /> Voltar para clientes
      </Link>

      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar text={cliente.nome.split(' ').slice(0, 2).map((p) => p[0]).join('')} size={56} gradient />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-ink">{cliente.nome}</h2>
              <Badge tone={cliente.tipo === 'PJ' ? 'blue' : 'sky'}>{cliente.tipo}</Badge>
              <Badge tone={cliente.status === 'Ativo' ? 'green' : 'gray'} dot>
                {cliente.status}
              </Badge>
            </div>
            <p className="num mt-1 text-xs text-slate-500">
              {cliente.tipo === 'PJ' ? 'CNPJ' : 'CPF'} {cliente.doc}
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1"><Mail size={12} /> {cliente.email}</span>
              <span className="inline-flex items-center gap-1"><Phone size={12} /> {cliente.telefone}</span>
              <span className="inline-flex items-center gap-1"><MapPin size={12} /> {cliente.cidade}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" icon={<Mail size={14} />} onClick={() => setMsgOpen(true)}>
              Enviar mensagem
            </Button>
            <Button icon={<ExternalLink size={14} />} onClick={() => navigate(cliente.tipo === 'PJ' ? '/pj' : '/pf')}>
              Acessar portal do cliente
            </Button>
          </div>
        </div>
      </Card>

      <Tabs<Aba>
        value={aba}
        onChange={setAba}
        tabs={[
          { value: 'geral', label: 'Visão geral' },
          { value: 'obrigacoes', label: `Obrigações (${obrs.length})` },
          { value: 'documentos', label: `Documentos (${docs.length})` },
          { value: 'solicitacoes', label: `Solicitações (${sols.length})` },
          { value: 'financeiro', label: 'Financeiro' },
        ]}
      />

      {aba === 'geral' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Honorário mensal" value={brl(cliente.honorario)} sub="contrato vigente" progress={70} />
            <StatCard label="Obrigações em aberto" value={emAberto.length} sub="neste mês" progress={40} progressColor="bg-amber-500" />
            <StatCard label="Documentos" value={docs.length} sub="arquivos recentes" progress={55} progressColor="bg-sky-400" />
            <StatCard label="Solicitações" value={sols.length} sub="no período" progress={30} progressColor="bg-violet-500" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader title="Dados cadastrais" />
              <div className="px-5 pb-4">
                <InfoRow label="Regime tributário" value={cliente.regime} />
                <InfoRow label="Responsável" value={cliente.responsavel} />
                <InfoRow label="Cliente desde" value={cliente.desde} />
                <InfoRow label="E-mail" value={cliente.email} />
                <InfoRow label="Telefone" value={cliente.telefone} />
              </div>
            </Card>
            <Card>
              <CardHeader title="Próximos vencimentos" />
              <div className="px-5 pb-4">
                {emAberto.length === 0 && <p className="py-6 text-center text-xs text-muted">Nenhuma obrigação em aberto.</p>}
                {emAberto.map((o) => (
                  <div key={o.id} className="flex items-center justify-between gap-3 border-b border-line py-2.5 last:border-0">
                    <div className="flex items-center gap-2">
                      <CodeTag>{o.codigo}</CodeTag>
                      <span className="num text-xs text-slate-500">{o.vencimento}</span>
                    </div>
                    <span className="num text-[13px] text-ink">{brl(o.valor)}</span>
                    <Badge tone={statusTone[o.status]}>{o.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {aba === 'obrigacoes' && (
        <Card className="overflow-hidden">
          <Table head={['Código', 'Referência', 'Vencimento', 'Valor', 'Status', 'Ações']}>
            {obrs.length === 0 && <EmptyRow cols={6} />}
            {obrs.map((o) => (
              <tr key={o.id}>
                <Td><CodeTag>{o.codigo}</CodeTag></Td>
                <Td>{o.referencia}</Td>
                <Td className="num text-xs">{o.vencimento}</Td>
                <Td className="num text-ink">{brl(o.valor)}</Td>
                <Td><Badge tone={statusTone[o.status]}>{o.status}</Badge></Td>
                <Td right>
                  <div className="flex justify-end gap-1.5">
                    <Button size="sm" variant="secondary" onClick={() => downloadFile(`${o.codigo}_${o.referencia.replace('/', '-')}.pdf`)}>
                      Guia
                    </Button>
                    {o.status !== 'Pago' && (
                      <Button
                        size="sm"
                        variant="soft"
                        onClick={() => {
                          setObrs((l) => l.map((x) => (x.id === o.id ? { ...x, status: 'Pago' } : x)))
                          toast(`${o.codigo} marcada como paga`)
                        }}
                      >
                        Marcar pago
                      </Button>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {aba === 'documentos' && (
        <Card className="overflow-hidden">
          <Table head={['Documento', 'Tipo', 'Data', 'Tamanho', 'Ações']}>
            {docs.length === 0 && <EmptyRow cols={5} />}
            {docs.map((d) => (
              <tr key={d.nome}>
                <Td className="font-semibold text-ink">{d.nome}</Td>
                <Td><Badge>{d.tipo}</Badge></Td>
                <Td className="num text-xs">{d.data}</Td>
                <Td>{d.tamanho}</Td>
                <Td right>
                  <Button size="sm" variant="soft" icon={<Download size={13} />} onClick={() => downloadFile(`${d.nome}.pdf`)}>
                    Baixar
                  </Button>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {aba === 'solicitacoes' && (
        <Card className="overflow-hidden">
          <div className="flex justify-end px-5 pt-4">
            <Button size="sm" icon={<Plus size={14} />} onClick={() => setSolOpen(true)}>
              Nova solicitação
            </Button>
          </div>
          <Table head={['Protocolo', 'Assunto', 'Abertura', 'Status', 'Ações']} className="mt-3">
            {sols.length === 0 && <EmptyRow cols={5} />}
            {sols.map((s) => (
              <tr key={s.protocolo}>
                <Td className="num text-xs text-brand">{s.protocolo}</Td>
                <Td className="font-semibold text-ink">{s.assunto}</Td>
                <Td>{s.data}</Td>
                <Td><Badge tone={statusTone[s.status]}>{s.status}</Badge></Td>
                <Td right>
                  {s.status !== 'Resolvido' && (
                    <Button
                      size="sm"
                      variant="soft"
                      onClick={() => {
                        setSols((l) => l.map((x) => (x.protocolo === s.protocolo ? { ...x, status: 'Resolvido' } : x)))
                        toast(`Solicitação ${s.protocolo} resolvida`)
                      }}
                    >
                      Resolver
                    </Button>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {aba === 'financeiro' && (
        <Card className="overflow-hidden">
          <CardHeader title="Honorários" subtitle={`Plano mensal de ${brl(cliente.honorario)}`} />
          <Table head={['Competência', 'Vencimento', 'Valor', 'Status', 'Ações']}>
            {fats.length === 0 && <EmptyRow cols={5} />}
            {fats.map((f, i) => (
              <tr key={i}>
                <Td className="font-semibold text-ink">{f.competencia}</Td>
                <Td className="num text-xs">{f.vencimento}</Td>
                <Td className="num text-ink">{brl(f.valor)}</Td>
                <Td><Badge tone={statusTone[f.status] ?? 'amber'}>{f.status}</Badge></Td>
                <Td right>
                  <div className="flex justify-end gap-1.5">
                    {f.status !== 'Pago' ? (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => toast(`Cobrança reenviada para ${cliente.email}`, 'info')}>
                          Cobrar
                        </Button>
                        <Button
                          size="sm"
                          variant="soft"
                          onClick={() => {
                            setFats((l) => l.map((x, j) => (j === i ? { ...x, status: 'Pago' } : x)))
                            toast('Pagamento registrado')
                          }}
                        >
                          Baixar pagamento
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => downloadFile(`recibo_${f.competencia.replace('/', '-')}.pdf`)}>
                        Recibo
                      </Button>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      <Modal
        open={msgOpen}
        onClose={() => setMsgOpen(false)}
        title="Enviar mensagem"
        subtitle={`Para ${cliente.nome}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setMsgOpen(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                if (!form.texto.trim()) return toast('Escreva a mensagem', 'warning')
                toast('Mensagem enviada ao cliente')
                setForm({ assunto: '', texto: '' })
                setMsgOpen(false)
              }}
            >
              Enviar
            </Button>
          </>
        }
      >
        <Field label="Mensagem">
          <Textarea value={form.texto} onChange={(e) => setForm({ ...form, texto: e.target.value })} placeholder="Olá! ..." />
        </Field>
      </Modal>

      <Modal
        open={solOpen}
        onClose={() => setSolOpen(false)}
        title="Nova solicitação"
        subtitle={cliente.nome}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSolOpen(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                if (!form.assunto.trim()) return toast('Informe o assunto', 'warning')
                setSols((l) => [{ protocolo: `#0${422 + l.length}`, cliente: cliente.nome, assunto: form.assunto, status: 'Aberto', data: 'agora' }, ...l])
                toast('Solicitação criada')
                setForm({ assunto: '', texto: '' })
                setSolOpen(false)
              }}
            >
              Criar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Assunto">
            <Input value={form.assunto} onChange={(e) => setForm({ ...form, assunto: e.target.value })} />
          </Field>
          <Field label="Descrição">
            <Textarea value={form.texto} onChange={(e) => setForm({ ...form, texto: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
