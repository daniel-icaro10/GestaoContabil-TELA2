import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Badge, Button, Card, PageTitle, Tabs } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { solicitacoes as initial, type Solicitacao } from './data'
import { ChatModal, NovaSolicitacaoModal } from './shared'

export default function Solicitacoes() {
  const toast = useToast()
  const [list, setList] = useState<Solicitacao[]>(initial)
  const [tab, setTab] = useState<'todas' | 'aberto' | 'concluidas'>('todas')
  const [nova, setNova] = useState(false)
  const [aberta, setAberta] = useState<string | null>(null)

  const andamento = list.filter((s) => s.status === 'Em andamento').length
  const concluidas = list.filter((s) => s.status === 'Concluída').length
  const rows = list.filter((s) =>
    tab === 'todas' ? true : tab === 'aberto' ? s.status === 'Em andamento' : s.status === 'Concluída',
  )
  const sel = list.find((s) => s.id === aberta) ?? null

  return (
    <div className="max-w-[900px] space-y-5">
      <PageTitle
        title="Solicitações"
        subtitle="Comunicação com o escritório contábil"
        actions={
          <Button size="lg" icon={<Plus size={16} />} onClick={() => setNova(true)}>
            Nova solicitação
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ['Em andamento', andamento],
          ['Concluídas', concluidas],
          ['Total 2024', list.length],
        ].map(([l, v]) => (
          <Card key={l} className="p-5">
            <p className="text-xs text-slate-500">{l}</p>
            <p className="num mt-3 text-2xl">{v}</p>
          </Card>
        ))}
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'todas', label: 'Todas' },
          { value: 'aberto', label: 'Em aberto' },
          { value: 'concluidas', label: 'Concluídas' },
        ]}
      />

      <div className="space-y-3">
        {rows.length === 0 && <p className="py-8 text-center text-[13px] text-muted">Nenhuma solicitação.</p>}
        {rows.map((s) => (
          <Card key={s.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="num text-[13px] text-slate-400">{s.id}</span>
                <Badge tone="gray">{s.tipo}</Badge>
              </div>
              <p className="mt-2 text-[14px] font-bold text-ink">{s.titulo}</p>
              <p className="mt-0.5 text-[11px] text-muted">
                Aberta em <span className="num">{s.aberta}</span> · Atualizada {s.atualizada}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge tone={s.status === 'Concluída' ? 'green' : 'amber'}>{s.status}</Badge>
              <Button size="sm" variant="outline" onClick={() => setAberta(s.id)}>
                Ver detalhes
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <NovaSolicitacaoModal
        open={nova}
        onClose={() => setNova(false)}
        onCreate={(tipo, titulo, desc) => {
          const num = 43 + list.length - initial.length
          const now = new Date()
          setList((l) => [
            {
              id: `#0${num}`,
              tipo,
              titulo,
              aberta: now.toLocaleDateString('pt-BR'),
              atualizada: 'agora',
              status: 'Em andamento',
              mensagens: [{ de: 'cliente', texto: desc || titulo, hora: now.toLocaleString('pt-BR').slice(0, 17) }],
            },
            ...l,
          ])
          toast(`Solicitação #0${num} criada`)
        }}
      />

      <ChatModal
        sol={sel}
        onClose={() => setAberta(null)}
        onSend={(texto) => {
          const hora = new Date().toLocaleString('pt-BR').slice(0, 17)
          setList((l) =>
            l.map((s) =>
              s.id === aberta ? { ...s, atualizada: 'agora', mensagens: [...s.mensagens, { de: 'cliente', texto, hora }] } : s,
            ),
          )
          toast('Mensagem enviada')
        }}
      />
    </div>
  )
}
