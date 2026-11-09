import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileSpreadsheet, Receipt, File, Clock3, ArrowRight, X } from 'lucide-react'
import { Badge, Button, Card, Dot } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { cn } from '../../lib/utils'
import { prazos } from './data'
import { UploadModal, ContadorModal, NovaSolicitacaoModal } from './shared'

export default function Dashboard() {
  const navigate = useNavigate()
  const toast = useToast()
  const [upload, setUpload] = useState(false)
  const [contador, setContador] = useState(false)
  const [nova, setNova] = useState(false)
  const [msgVisible, setMsgVisible] = useState(true)
  const [docs, setDocs] = useState(12)

  const cards = [
    {
      icon: FileSpreadsheet,
      iconCls: 'bg-indigo-50 text-indigo-500',
      label: 'Imposto de Renda',
      value: 'Em dia',
      sub: 'Declaração 2024 · Enviada',
      to: '/pf/imposto-renda',
    },
    {
      icon: Receipt,
      iconCls: 'bg-amber-50 text-amber-600',
      label: 'Obrigações',
      value: '1 pendente',
      sub: 'Carnê-Leão Out/2024',
      to: '/pf/obrigacoes',
    },
    {
      icon: File,
      iconCls: 'bg-violet-50 text-violet-500',
      label: 'Documentos',
      value: `${docs} arquivos`,
      sub: '2 pendentes de revisão',
      to: '/pf/documentos',
    },
    {
      icon: Clock3,
      iconCls: 'bg-emerald-50 text-emerald-600',
      label: 'Honorários',
      value: 'R$ 790,00',
      sub: 'Vence em 05/10/2024',
      to: '/pf/financeiro',
    },
  ]

  const acoes = [
    { label: 'Enviar documento', arrow: 'text-brand', onClick: () => setUpload(true) },
    { label: 'Ver obrigações', arrow: 'text-amber-600', onClick: () => navigate('/pf/obrigacoes') },
    { label: 'Declaração IR', arrow: 'text-violet-500', onClick: () => navigate('/pf/imposto-renda') },
    { label: 'Falar com contador', arrow: 'text-emerald-600', onClick: () => setContador(true) },
  ]

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <Card className="flex flex-wrap items-center justify-between gap-4 border-brand/15 bg-gradient-to-r from-brand/5 to-violet-50 px-6 py-5">
        <div>
          <h2 className="text-lg font-bold text-ink">Olá, Maria! 👋</h2>
          <p className="mt-1 text-[13px] text-slate-500">Tudo certo por aqui. Seu contador está cuidando de tudo.</p>
        </div>
        <Button size="lg" onClick={() => setUpload(true)}>
          Enviar documento
        </Button>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} onClick={() => navigate(c.to)} className="cursor-pointer p-5 transition hover:border-brand/30 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', c.iconCls)}>
                <c.icon size={17} />
              </div>
              <p className="text-[11px] font-medium text-muted">{c.label}</p>
            </div>
            <p className="num mt-4 text-[22px] text-ink">{c.value}</p>
            <p className="mt-1 text-xs text-muted">{c.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_270px]">
        <Card className="p-5">
          <h3 className="text-[15px] font-bold">Próximos Prazos</h3>
          <p className="num text-[11px] tracking-widest text-slate-300">OUTUBRO 2024</p>
          <div className="mt-4 divide-y divide-line">
            {prazos.map((p) => (
              <div key={p.dia} className="flex items-center gap-3 py-2.5">
                <Dot tone={p.tone} />
                <span className="num w-14 text-xs text-muted">{p.dia}</span>
                <span className={cn('text-[13px]', p.done ? 'text-slate-300 line-through' : 'text-ink')}>{p.texto}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-[15px] font-bold">Ações Rápidas</h3>
          <div className="space-y-2">
            {acoes.map((a) => (
              <button
                key={a.label}
                onClick={a.onClick}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-line bg-slate-50/60 px-3 py-2.5 text-left text-[13px] font-semibold text-ink transition hover:border-brand/30 hover:bg-surface"
              >
                {a.label}
                <ArrowRight size={13} className={a.arrow} />
              </button>
            ))}
          </div>
        </Card>
      </div>

      {msgVisible && (
        <Card className="flex items-start gap-3 border-emerald-200 bg-emerald-50/60 p-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-slate-600 text-xs font-bold text-white">
            CC
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-ink">Mensagem do contador · 10/09/2024</p>
            <p className="mt-1 text-[13px] text-slate-600">
              Olá Maria! Sua declaração de IR 2024 foi enviada com sucesso. O recibo está disponível na área de Imposto de Renda.
              Qualquer dúvida, estou à disposição!
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate('/pf/imposto-renda')}>
                Ver recibo
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setNova(true)}>
                Responder
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="green">Novo</Badge>
            <button
              title="Marcar como lida"
              onClick={() => {
                setMsgVisible(false)
                toast('Mensagem marcada como lida', 'info')
              }}
              className="cursor-pointer text-slate-400 hover:text-ink"
            >
              <X size={15} />
            </button>
          </div>
        </Card>
      )}

      <UploadModal
        open={upload}
        onClose={() => setUpload(false)}
        onUpload={(files) => {
          setDocs((d) => d + files.length)
          toast(`${files.length} documento(s) enviado(s) ao contador`)
        }}
      />
      <ContadorModal open={contador} onClose={() => setContador(false)} onChat={() => setNova(true)} />
      <NovaSolicitacaoModal
        open={nova}
        onClose={() => setNova(false)}
        defaultTitulo="Resposta à mensagem do contador"
        onCreate={() => toast('Solicitação enviada ao contador')}
      />
    </div>
  )
}
