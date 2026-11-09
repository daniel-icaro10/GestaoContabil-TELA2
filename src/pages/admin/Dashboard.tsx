import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { Badge, Card, CardHeader, Modal, InfoRow, StatCard } from '../../components/ui'
import { cn } from '../../lib/utils'
import { LetterBox, PlanBadge } from './shared'
import type { PlanName } from './data'

const growth = [
  { m: 'Jan', v: 150 },
  { m: 'Fev', v: 163 },
  { m: 'Mar', v: 178 },
  { m: 'Abr', v: 186 },
  { m: 'Mai', v: 195 },
  { m: 'Jun', v: 203 },
  { m: 'Jul', v: 216 },
  { m: 'Ago', v: 231 },
  { m: 'Set', v: 247 },
]

const distribution: { plan: PlanName; count: number; pct: number; color: string }[] = [
  { plan: 'Premium', count: 68, pct: 28, color: 'bg-violet-500' },
  { plan: 'Profissional', count: 112, pct: 45, color: 'bg-indigo-600' },
  { plan: 'Essencial', count: 67, pct: 27, color: 'bg-sky-400' },
]

const newOffices: { name: string; city: string; plan: PlanName; date: string; clients: number; owner: string }[] = [
  { name: 'Alfa Contabilidade', city: 'São Paulo, SP', plan: 'Profissional', date: '18/09/2024', clients: 12, owner: 'Ana Souza' },
  { name: 'Beta Assessoria', city: 'Curitiba, PR', plan: 'Premium', date: '17/09/2024', clients: 8, owner: 'Carlos Mendes' },
  { name: 'Gama Fiscal', city: 'Recife, PE', plan: 'Essencial', date: '16/09/2024', clients: 5, owner: 'Juliana Ramos' },
  { name: 'Delta Contadores', city: 'Belo Horizonte', plan: 'Profissional', date: '15/09/2024', clients: 14, owner: 'Pedro Oliveira' },
  { name: 'Épsilon Finanças', city: 'Porto Alegre', plan: 'Premium', date: '14/09/2024', clients: 3, owner: 'Fernanda Lima' },
]

const alerts = [
  { tone: 'amber', text: '8 escritórios com assinatura inadimplente há mais de 30 dias', to: '/admin/assinaturas' },
  { tone: 'blue', text: 'Plano Essencial atinge limite de clientes em 3 escritórios', to: '/admin/planos' },
  { tone: 'green', text: 'Receita recorrente cresceu 8.2% em relação ao mês anterior', to: '/admin/assinaturas' },
] as const

const alertCls = {
  amber: 'border-amber-200 bg-amber-50 text-amber-900',
  blue: 'border-indigo-200 bg-indigo-50/70 text-indigo-900',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-900',
}
const alertDot = { amber: 'bg-amber-500', blue: 'bg-indigo-500', green: 'bg-emerald-500' }

const activity = [
  { who: 'Alfa Contabilidade', what: 'atualizou plano para Premium', when: 'há 5 min' },
  { who: 'João Silva', what: 'criou nova conta de usuário', when: 'há 12 min' },
  { who: 'Beta Assessoria', what: 'foi cadastrado', when: 'há 1h' },
  { who: 'Gama Fiscal', what: 'pagou fatura de Outubro', when: 'há 3h' },
  { who: 'Eta Escritório', what: 'teve a assinatura suspensa', when: 'ontem' },
]

function GrowthChart() {
  const [hover, setHover] = useState<number | null>(null)
  const W = 600
  const H = 120
  const min = 140
  const max = 250
  const pts = growth.map((g, i) => ({
    x: (i / (growth.length - 1)) * W,
    y: H - ((g.v - min) / (max - min)) * H,
  }))
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ')
  const area = `${line} L${W},${H} L0,${H} Z`
  return (
    <div className="relative px-5 pb-4">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-32 w-full overflow-visible">
        <defs>
          <linearGradient id="growthFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#growthFill)" />
        <path d={line} fill="none" stroke="#8b5cf6" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        {pts.map((p, i) => (
          <rect
            key={i}
            x={p.x - W / growth.length / 2}
            y={0}
            width={W / growth.length}
            height={H}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute -top-2 rounded-lg bg-navy px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-lg"
          style={{ left: `calc(${(hover / (growth.length - 1)) * 100}% * 0.92 + 12px)` }}
        >
          {growth[hover].m}: {growth[hover].v} escritórios
        </div>
      )}
      <div className="mt-2 flex justify-between text-[10px] text-muted">
        {growth.map((g) => (
          <span key={g.m}>{g.m}</span>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<(typeof newOffices)[number] | null>(null)

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Escritórios Ativos"
          value="247"
          badge={<Badge tone="green">+7.5%</Badge>}
          sub={
            <span className="inline-flex items-center gap-1">
              <ArrowUp size={11} /> 16 este mês
            </span>
          }
          progress={70}
          progressColor="bg-violet-500"
        />
        <StatCard
          label="Total Empresas / Clientes"
          value="3.841"
          badge={<Badge tone="green">+4.1%</Badge>}
          sub="em todos os escritórios"
          progress={70}
          progressColor="bg-indigo-600"
        />
        <StatCard label="Usuários Ativos" value="12.406" sub="em toda a plataforma" progress={70} progressColor="bg-sky-400" />
        <StatCard
          label="Receita Recorrente Mensal"
          value="R$ 89.340"
          badge={<Badge tone="green">+8.2%</Badge>}
          sub="Outubro 2024"
          progress={70}
          progressColor="bg-violet-500"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_200px] 2xl:grid-cols-[1fr_260px]">
        <Card>
          <CardHeader title="Crescimento de Escritórios" subtitle="Últimos 9 meses" right={<Badge tone="violet">+16.4%</Badge>} />
          <GrowthChart />
        </Card>
        <Card className="p-5">
          <h3 className="text-[15px] font-bold">Distribuição por Plano</h3>
          <p className="mt-0.5 text-xs text-muted">247 escritórios ativos</p>
          <div className="mt-4 flex gap-1">
            {distribution.map((d) => (
              <div key={d.plan} className={cn('h-1.5 rounded-full', d.color)} style={{ width: `${d.pct}%` }} />
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {distribution.map((d) => (
              <button
                key={d.plan}
                onClick={() => navigate('/admin/planos')}
                className="flex w-full cursor-pointer items-center gap-2 text-left text-[13px] hover:text-brand"
              >
                <span className={cn('h-2 w-2 rounded-full', d.color)} />
                <span className="flex-1">{d.plan}</span>
                <span className="num text-sm">{d.count}</span>
                <span className="w-8 text-right text-[11px] text-muted">{d.pct}%</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_240px]">
        <Card>
          <CardHeader
            title="Novos Escritórios"
            subtitle="Cadastrados recentemente"
            right={
              <button onClick={() => navigate('/admin/escritorios')} className="cursor-pointer text-xs font-semibold text-brand hover:underline">
                Ver todos
              </button>
            }
          />
          <div className="divide-y divide-line border-t border-line">
            {newOffices.map((o) => (
              <button
                key={o.name}
                onClick={() => setSelected(o)}
                className="flex w-full cursor-pointer items-center gap-3 px-5 py-3 text-left hover:bg-slate-50"
              >
                <LetterBox name={o.name} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-ink">{o.name}</p>
                  <p className="text-[11px] text-muted">{o.city}</p>
                </div>
                <PlanBadge plan={o.plan} />
                <span className="num w-28 text-right text-[12px] text-muted">{o.date}</span>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-[15px] font-bold">Alertas Administrativos</h3>
            <div className="space-y-2.5">
              {alerts.map((a) => (
                <button
                  key={a.text}
                  onClick={() => navigate(a.to)}
                  className={cn('flex w-full cursor-pointer gap-2 rounded-lg border px-3 py-2.5 text-left text-xs leading-relaxed hover:brightness-95', alertCls[a.tone])}
                >
                  <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', alertDot[a.tone])} />
                  {a.text}
                </button>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-[15px] font-bold">Atividade Recente</h3>
            <div className="space-y-3">
              {activity.map((a) => (
                <div key={a.who + a.when} className="flex gap-2.5">
                  <LetterBox name={a.who} size={22} className="rounded-full text-[9px]" />
                  <p className="flex-1 text-xs leading-relaxed text-slate-500">
                    <span className="font-bold text-ink">{a.who}</span> {a.what}
                  </p>
                  <span className="shrink-0 text-[10px] text-muted">{a.when}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        subtitle="Escritório cadastrado recentemente"
        footer={
          <button
            onClick={() => navigate('/admin/escritorios')}
            className="h-9 cursor-pointer rounded-lg bg-brand px-4 text-[13px] font-semibold text-white"
          >
            Gerenciar escritórios
          </button>
        }
      >
        {selected && (
          <>
            <InfoRow label="Responsável" value={selected.owner} />
            <InfoRow label="Cidade" value={selected.city} />
            <InfoRow label="Plano" value={<PlanBadge plan={selected.plan} />} />
            <InfoRow label="Clientes cadastrados" value={selected.clients} />
            <InfoRow label="Data de cadastro" value={selected.date} />
          </>
        )}
      </Modal>
    </div>
  )
}
