import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  ReceiptText,
  Copy,
  Download,
  CheckCircle2,
  Upload,
  Zap,
  Users,
  ArrowRight,
  Video,
  MessageCircle,
} from 'lucide-react'
import {
  Badge,
  Banner,
  Button,
  Card,
  CodeTag,
  Dot,
  Dropzone,
  IconButton,
  Modal,
  Progress,
  Select,
  StatCard,
  Table,
  Tabs,
  Td,
  EmptyRow,
  Avatar,
} from '../../components/ui'
import { useToast } from '../../components/Toast'
import { brl, copyText, downloadFile, cn } from '../../lib/utils'

type Guia = { id: string; code: string; tone: 'blue' | 'gray' | 'violet'; name: string; comp: string; venc: string; valor: number; pago: boolean }

const guiasPorMes: Record<string, Guia[]> = {
  'Outubro 2024': [
    { id: 'das', code: 'DAS', tone: 'blue', name: 'DAS - Simples Nacional', comp: '09/2024', venc: '20/10/2024', valor: 1240, pago: false },
    { id: 'fgts', code: 'FGTS', tone: 'gray', name: 'FGTS Digital', comp: '09/2024', venc: '07/10/2024', valor: 680, pago: true },
    { id: 'gps', code: 'GPS', tone: 'violet', name: 'Pró-Labore & GPS', comp: '09/2024', venc: '15/10/2024', valor: 2900.5, pago: true },
  ],
  'Setembro 2024': [
    { id: 'das9', code: 'DAS', tone: 'blue', name: 'DAS - Simples Nacional', comp: '08/2024', venc: '20/09/2024', valor: 1180, pago: true },
    { id: 'fgts9', code: 'FGTS', tone: 'gray', name: 'FGTS Digital', comp: '08/2024', venc: '06/09/2024', valor: 680, pago: true },
    { id: 'gps9', code: 'GPS', tone: 'violet', name: 'Pró-Labore & GPS', comp: '08/2024', venc: '16/09/2024', valor: 2900.5, pago: true },
  ],
  'Agosto 2024': [
    { id: 'das8', code: 'DAS', tone: 'blue', name: 'DAS - Simples Nacional', comp: '07/2024', venc: '20/08/2024', valor: 1095.3, pago: true },
    { id: 'gps8', code: 'GPS', tone: 'violet', name: 'Pró-Labore & GPS', comp: '07/2024', venc: '15/08/2024', valor: 2900.5, pago: true },
  ],
}

const rotinas = [
  { date: '07 Out', text: 'Prazo Envio Extratos', done: true, tone: 'green' as const },
  { date: '15 Out', text: 'Fechamento Pró-labore e Folha', done: false, tone: 'blue' as const, strong: true },
  { date: '20 Out', text: 'Vencimento Simples Nacional', done: false, tone: 'amber' as const },
  { date: '31 Out', text: 'Prazo Limite NF-e Entradas', done: false, tone: 'gray' as const },
]

export default function PjDashboard() {
  const toast = useToast()
  const navigate = useNavigate()
  const [showCert, setShowCert] = useState(true)
  const [mes, setMes] = useState('Outubro 2024')
  const [tab, setTab] = useState<'todas' | 'pendentes' | 'pagas'>('todas')
  const [guias, setGuias] = useState(guiasPorMes)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [sent, setSent] = useState<string[]>([])

  const lista = guias[mes] ?? []
  const pendentes = lista.filter((g) => !g.pago)
  const pagas = lista.filter((g) => g.pago)
  const visiveis = tab === 'todas' ? lista : tab === 'pendentes' ? pendentes : pagas

  const total = lista.reduce((s, g) => s + g.valor, 0)
  const pagasPct = lista.length ? Math.round((pagas.length / lista.length) * 100) : 0

  function marcarPago(id: string) {
    setGuias((g) => ({ ...g, [mes]: g[mes].map((x) => (x.id === id ? { ...x, pago: true } : x)) }))
    toast('Pagamento registrado. Comprovante arquivado no cofre.')
  }

  return (
    <div className="space-y-5">
      {showCert && (
        <Banner
          tone="sky"
          icon={<ShieldCheck size={18} />}
          title={
            <>
              Certificado Digital A1 vence em <span className="num">18 dias</span>!
            </>
          }
          text="Evite bloqueio na emissão de NF-e. Renove online em 5 minutos com condição exclusiva."
          action={
            <Button size="sm" onClick={() => navigate('/pj/certificado')}>
              Renovar Agora
            </Button>
          }
          onClose={() => setShowCert(false)}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total de Tributos"
          value={brl(4820.5)}
          sub="3 de 4 guias pagas · Outubro"
          icon={
            <button
              onClick={() => navigate('/pj/guias')}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-brand/20 bg-brand/5 text-brand"
            >
              <ReceiptText size={15} />
            </button>
          }
        >
          <Progress value={75} className="mt-4" />
          <div className="mt-1 flex justify-between text-[10px]">
            <span className="text-muted">0%</span>
            <span className="font-bold text-brand">75%</span>
          </div>
        </StatCard>

        <Card className="p-5">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium text-slate-500">Próximo Vencimento</p>
            <Badge tone="amber">A Vencer</Badge>
          </div>
          <p className="num mt-3 text-[28px] leading-tight">20 Out</p>
          <p className="mt-1.5 text-xs text-muted">DAS · Simples Nacional</p>
          <span className="num mt-3 inline-block rounded-lg bg-brand/10 px-3 py-1.5 text-sm text-brand">{brl(1240)}</span>
        </Card>

        <Card className="cursor-pointer p-5 transition hover:border-brand/30" onClick={() => navigate('/pj/certificado')}>
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium text-slate-500">Certificado Digital</p>
            <ShieldCheck size={16} className="text-brand" />
          </div>
          <p className="mt-4 flex items-center gap-2 text-[15px] font-bold">
            <Dot tone="sky" /> Ativo &amp; Seguro
          </p>
          <p className="mt-1 text-xs text-muted">
            Validade: <span className="num text-ink">18/11/2024</span>
          </p>
          <p className="mt-0.5 text-[11px] text-muted">e-CNPJ A1 · ICP-Brasil</p>
          <Progress value={88} className="mt-4" color="bg-gradient-to-r from-sky-400 to-brand" />
        </Card>

        <Card className="cursor-pointer p-5 transition hover:border-brand/30" onClick={() => navigate('/pj/notas')}>
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium text-slate-500">Notas Fiscais</p>
            <Badge tone="green">+12% vs ant.</Badge>
          </div>
          <p className="num mt-3 text-[26px] leading-tight">28 Emitidas</p>
          <p className="mt-1.5 text-xs text-muted">Outubro 2024</p>
          <div className="mt-4 flex h-7 items-end gap-1.5">
            {[30, 40, 45, 55, 50, 60, 55, 85, 75, 100].map((h, i) => (
              <div
                key={i}
                className={cn('flex-1 rounded-sm', i < 7 ? 'bg-slate-200' : i === 9 ? 'bg-brand' : 'bg-violet-400')}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <div className="min-w-0 space-y-5">
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
              <div>
                <h3 className="text-[15px] font-bold">Obrigações e Guias</h3>
                <p className="mt-0.5 text-xs text-muted">Competência {lista[0]?.comp.replace('/', '/') ?? '—'}</p>
              </div>
              <Select value={mes} onChange={setMes} options={Object.keys(guias)} />
            </div>
            <Tabs
              className="mt-3 px-3"
              value={tab}
              onChange={setTab}
              tabs={[
                { value: 'todas', label: 'Todas' },
                { value: 'pendentes', label: `Pendentes (${pendentes.length})` },
                { value: 'pagas', label: `Pagas (${pagas.length})` },
              ]}
            />
            <Table head={['Guia / Tributo', 'Comp.', 'Vencimento', 'Valor', 'Situação', 'Ações']}>
              {visiveis.length === 0 && <EmptyRow cols={6} text="Nenhuma guia nesta aba." />}
              {visiveis.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50/60">
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <CodeTag tone={g.tone}>{g.code}</CodeTag>
                      <span className="font-semibold text-ink">{g.name}</span>
                    </div>
                  </Td>
                  <Td>{g.comp}</Td>
                  <Td className="num text-ink">{g.venc}</Td>
                  <Td className="num text-ink">{brl(g.valor)}</Td>
                  <Td>
                    {g.pago ? (
                      <Badge tone="green">
                        <CheckCircle2 size={12} /> Pago
                      </Badge>
                    ) : (
                      <Badge tone="amber" dot>
                        Aguardando
                      </Badge>
                    )}
                  </Td>
                  <Td right>
                    <div className="flex justify-end gap-1.5">
                      {g.pago ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={<CheckCircle2 size={13} className="text-emerald-500" />}
                          onClick={() => downloadFile(`Comprovante_${g.code}_${g.comp.replace('/', '-')}.pdf`)}
                        >
                          Comprovante
                        </Button>
                      ) : (
                        <>
                          <IconButton
                            title="Copiar código PIX"
                            onClick={async () => {
                              await copyText(`00020126580014BR.GOV.BCB.PIX0136${g.id}-${g.valor}`)
                              toast('Código PIX copiado!')
                            }}
                          >
                            <Copy size={14} />
                          </IconButton>
                          <IconButton title="Baixar guia" onClick={() => downloadFile(`${g.code}_${g.comp.replace('/', '-')}.pdf`)}>
                            <Download size={14} />
                          </IconButton>
                          <Button size="sm" variant="soft" onClick={() => marcarPago(g.id)}>
                            Marcar pago
                          </Button>
                        </>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </Table>
            <div className="flex items-center justify-between border-t border-line px-5 py-3 text-xs text-muted">
              <span>
                Total do mês: <b className="num text-ink">{brl(total)}</b> · {pagasPct}% pago
              </span>
              <button onClick={() => navigate('/pj/guias')} className="cursor-pointer font-semibold text-brand hover:underline">
                Ver todas as guias →
              </button>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-4 text-[15px] font-bold">Ações Rápidas</h3>
            <div className="space-y-2.5">
              {[
                { icon: Upload, title: 'Enviar Extrato Bancário', sub: 'Arraste ou clique · OFX, PDF', onClick: () => setUploadOpen(true), dashed: true },
                { icon: Zap, title: 'Emitir Nota Fiscal (NFS-e)', sub: 'Autorizado pela prefeitura', onClick: () => navigate('/pj/notas') },
                { icon: Users, title: 'Solicitar Admissão / Férias', sub: 'eSocial integrado', onClick: () => navigate('/pj/solicitacoes') },
              ].map((a) => (
                <button
                  key={a.title}
                  onClick={a.onClick}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-line bg-slate-50/60 p-3 text-left transition hover:border-brand/30 hover:bg-brand/5"
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg text-brand',
                      a.dashed ? 'border border-dashed border-brand/40 bg-white' : 'bg-violet-50 text-violet-500',
                    )}
                  >
                    <a.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-ink">{a.title}</p>
                    <p className="text-[11px] text-muted">{a.sub}</p>
                  </div>
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand/10 text-brand">
                    <ArrowRight size={13} />
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[15px] font-bold">Rotinas Fiscais</h3>
                <p className="num mt-0.5 text-[11px] tracking-widest text-slate-300">OUTUBRO 2024</p>
              </div>
              <Badge tone="blue">Hoje: 15 Ter</Badge>
            </div>
            <div className="mt-4 space-y-3.5">
              {rotinas.map((r) => (
                <div key={r.date} className="flex items-center gap-3 text-[12.5px]">
                  <Dot tone={r.tone} />
                  <span className="num w-14 shrink-0 text-[11px] text-muted">{r.date}</span>
                  <span className={cn(r.done ? 'text-slate-400 line-through' : r.strong ? 'font-bold text-ink' : 'text-slate-600')}>{r.text}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between">
              <h3 className="text-[15px] font-bold">Fatura Contábil</h3>
              <Badge tone="green" dot>
                Pago
              </Badge>
            </div>
            <p className="mt-3">
              <span className="num text-[26px]">{brl(450)}</span>
              <span className="text-xs text-muted"> /mês</span>
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
              <CheckCircle2 size={13} className="text-emerald-500" /> Pago via PIX no dia 05/10
            </p>
            <Button
              variant="soft"
              className="mt-4 w-full"
              icon={<Download size={14} />}
              onClick={() => downloadFile('NFSe_Escritorio_Outubro2024.pdf')}
            >
              Ver Nota Fiscal do Escritório
            </Button>
          </Card>

          <Card className="border-violet-300 p-5 ring-1 ring-violet-200">
            <h3 className="text-[15px] font-bold">Seu Contador Dedicado</h3>
            <div className="mt-4 flex items-center gap-3">
              <Avatar text="CE" size={44} gradient />
              <div>
                <p className="text-[13px] font-bold">Carlos Eduardo</p>
                <p className="text-[11px] text-muted">CRC-SP · Contador Responsável</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-emerald-600">
                  <Dot tone="green" /> Online agora
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                variant="soft"
                icon={<Video size={14} />}
                onClick={() => {
                  window.open('https://meet.google.com/new', '_blank')
                  toast('Abrindo sala do Google Meet…', 'info')
                }}
              >
                Meet
              </Button>
              <Button
                variant="success"
                icon={<MessageCircle size={14} />}
                onClick={() => window.open('https://wa.me/5511987654321?text=Olá%20Carlos,%20preciso%20de%20ajuda', '_blank')}
              >
                WhatsApp
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Enviar Extrato Bancário"
        subtitle="Os arquivos são enviados com segurança para o seu contador"
        footer={
          <Button
            onClick={() => {
              setUploadOpen(false)
              if (sent.length) toast(`${sent.length} arquivo(s) enviado(s) ao escritório`)
              setSent([])
            }}
          >
            Concluir
          </Button>
        }
      >
        <Dropzone
          title="Arraste seus extratos aqui"
          hint="OFX ou PDF até 50 MB"
          onFiles={(f) => setSent((s) => [...s, ...f.map((x) => x.name)])}
        />
        {sent.length > 0 && (
          <ul className="mt-4 space-y-2">
            {sent.map((n, i) => (
              <li key={i} className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                <CheckCircle2 size={14} /> {n}
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  )
}
