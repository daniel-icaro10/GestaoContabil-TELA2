import { useEffect, useRef, useState } from 'react'
import { Plus, MoreHorizontal, CheckCircle2 } from 'lucide-react'
import { Badge, Button, Card, Field, Input, Modal, PageTitle, Select, Textarea, Toggle } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { cn } from '../../lib/utils'

type Color = 'sky' | 'indigo' | 'violet' | 'emerald' | 'amber'

const colorCls: Record<Color, { dot: string; price: string; btn: string; check: string; count: string; boxBg: string }> = {
  sky: { dot: 'bg-sky-400', price: 'text-sky-400', btn: 'bg-sky-400 hover:bg-sky-500', check: 'text-sky-400', count: 'text-sky-400', boxBg: 'bg-sky-50/60' },
  indigo: { dot: 'bg-indigo-600', price: 'text-indigo-600', btn: 'bg-indigo-600 hover:bg-indigo-700', check: 'text-indigo-600', count: 'text-indigo-600', boxBg: 'bg-indigo-50/60' },
  violet: { dot: 'bg-violet-500', price: 'text-violet-500', btn: 'bg-violet-500 hover:bg-violet-600', check: 'text-violet-500', count: 'text-violet-500', boxBg: 'bg-violet-50/60' },
  emerald: { dot: 'bg-emerald-500', price: 'text-emerald-600', btn: 'bg-emerald-600 hover:bg-emerald-700', check: 'text-emerald-500', count: 'text-emerald-600', boxBg: 'bg-emerald-50/60' },
  amber: { dot: 'bg-amber-500', price: 'text-amber-600', btn: 'bg-amber-500 hover:bg-amber-600', check: 'text-amber-500', count: 'text-amber-600', boxBg: 'bg-amber-50/60' },
}

type Plan = {
  id: number
  name: string
  description: string
  price: number
  clients: string
  users: string
  storage: string
  offices: number
  features: string[]
  color: Color
  active: boolean
  featured?: boolean
}

const seed: Plan[] = [
  {
    id: 1,
    name: 'Essencial',
    description: 'Para escritórios em início de operação',
    price: 199,
    clients: '30',
    users: '5',
    storage: '5 GB',
    offices: 67,
    color: 'sky',
    active: true,
    features: ['Dashboard básico', 'Emissão de NFS-e', 'Cofre de documentos (5 GB)', 'Suporte via e-mail', 'Relatórios básicos'],
  },
  {
    id: 2,
    name: 'Profissional',
    description: 'Para escritórios em crescimento',
    price: 399,
    clients: '100',
    users: '15',
    storage: '25 GB',
    offices: 112,
    color: 'indigo',
    active: true,
    featured: true,
    features: ['Tudo do Essencial', 'Folha de Pagamento eSocial', 'Guias & Tributos completo', 'White-label básico', 'Suporte prioritário', 'Relatórios avançados'],
  },
  {
    id: 3,
    name: 'Premium',
    description: 'Para grandes escritórios contábeis',
    price: 799,
    clients: '∞',
    users: '∞',
    storage: '100 GB',
    offices: 68,
    color: 'violet',
    active: true,
    features: ['Tudo do Profissional', 'Clientes ilimitados', 'Usuários ilimitados', 'White-label completo', 'API de integração', 'Gerente de conta dedicado', 'SLA 99.9% garantido'],
  },
]

type Form = Omit<Plan, 'id' | 'offices' | 'features'> & { featuresText: string }

function toForm(p?: Plan): Form {
  return {
    name: p?.name ?? '',
    description: p?.description ?? '',
    price: p?.price ?? 0,
    clients: p?.clients ?? '',
    users: p?.users ?? '',
    storage: p?.storage ?? '',
    color: p?.color ?? 'emerald',
    active: p?.active ?? true,
    featured: p?.featured,
    featuresText: p?.features.join('\n') ?? '',
  }
}

function PlanMenu({
  plan,
  onDuplicate,
  onToggle,
  onFeature,
  onDelete,
}: {
  plan: Plan
  onDuplicate: () => void
  onToggle: () => void
  onFeature: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])
  const item = 'block w-full cursor-pointer rounded-md px-3 py-2 text-left text-[13px] hover:bg-slate-50'
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-line bg-white text-slate-500 hover:bg-slate-50"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="animate-fade absolute bottom-full right-0 z-20 mb-1 w-48 rounded-xl border border-line bg-white p-1 shadow-xl">
          <button className={item} onClick={() => (setOpen(false), onDuplicate())}>
            Duplicar plano
          </button>
          <button className={item} onClick={() => (setOpen(false), onFeature())}>
            {plan.featured ? 'Remover destaque' : 'Marcar como destaque'}
          </button>
          <button className={item} onClick={() => (setOpen(false), onToggle())}>
            {plan.active ? 'Desativar plano' : 'Ativar plano'}
          </button>
          <button className={cn(item, 'text-red-500 hover:bg-red-50')} onClick={() => (setOpen(false), onDelete())}>
            Excluir plano
          </button>
        </div>
      )}
    </div>
  )
}

export default function Planos() {
  const toast = useToast()
  const [plans, setPlans] = useState(seed)
  const [editing, setEditing] = useState<Plan | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<Form>(toForm())
  const [deleting, setDeleting] = useState<Plan | null>(null)

  const activeCount = plans.filter((p) => p.active).length
  const totalOffices = plans.reduce((s, p) => s + p.offices, 0)

  function openNew() {
    setEditing(null)
    setForm(toForm())
    setFormOpen(true)
  }
  function openEdit(p: Plan) {
    setEditing(p)
    setForm(toForm(p))
    setFormOpen(true)
  }
  function save() {
    if (!form.name.trim() || form.price <= 0) {
      toast('Informe o nome e um valor mensal válido.', 'warning')
      return
    }
    const features = form.featuresText.split('\n').map((s) => s.trim()).filter(Boolean)
    const { featuresText, ...rest } = form
    if (editing) {
      setPlans((ps) => ps.map((p) => (p.id === editing.id ? { ...p, ...rest, features } : p)))
      toast(`Plano ${form.name} atualizado.`)
    } else {
      setPlans((ps) => [...ps, { ...rest, features, id: Date.now(), offices: 0 }])
      toast(`Plano ${form.name} criado.`)
    }
    setFormOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title="Planos Comerciais"
        subtitle={`${activeCount} planos ativos · ${totalOffices} escritórios`}
        actions={
          <Button icon={<Plus size={16} />} onClick={openNew}>
            Novo Plano
          </Button>
        }
      />

      <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((p) => {
          const c = colorCls[p.color]
          return (
            <Card
              key={p.id}
              className={cn('relative p-5', p.featured && 'border-indigo-500 ring-1 ring-indigo-500', !p.active && 'opacity-60')}
            >
              {p.featured && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[9px] font-bold tracking-wider text-white">
                  MAIS UTILIZADO
                </span>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn('h-2.5 w-2.5 rounded-full', c.dot)} />
                  <h3 className="text-[15px] font-bold">{p.name}</h3>
                </div>
                <Badge tone={p.active ? 'green' : 'gray'}>{p.active ? 'Ativo' : 'Inativo'}</Badge>
              </div>
              <p className="mt-1 text-[11px] text-muted">{p.description}</p>
              <p className="mt-4 flex items-baseline gap-1.5">
                <span className={cn('num text-[30px]', c.price)}>R$ {p.price}</span>
                <span className="text-xs text-muted">/mês</span>
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4">
                {[
                  [p.clients, 'Clientes'],
                  [p.users, 'Usuários'],
                  [p.storage, 'Storage'],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-lg bg-slate-50 py-2.5 text-center">
                    <p className="num text-sm text-ink">{v}</p>
                    <p className="text-[10px] text-muted">{l}</p>
                  </div>
                ))}
              </div>
              <div className={cn('mt-2 flex items-center justify-between rounded-lg px-3 py-2.5', c.boxBg)}>
                <span className="text-[11px] text-slate-500">Escritórios ativos</span>
                <span className={cn('num text-base', c.count)}>{p.offices}</span>
              </div>
              <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-muted">Recursos incluídos</p>
              <ul className="mt-2.5 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 size={14} className={c.check} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => openEdit(p)}
                  className={cn('h-9 flex-1 cursor-pointer rounded-lg text-[13px] font-semibold text-white transition', c.btn)}
                >
                  Editar Plano
                </button>
                <PlanMenu
                  plan={p}
                  onDuplicate={() => {
                    setPlans((ps) => [...ps, { ...p, id: Date.now(), name: `${p.name} (cópia)`, offices: 0, featured: false }])
                    toast(`Plano ${p.name} duplicado.`)
                  }}
                  onFeature={() => {
                    setPlans((ps) => ps.map((x) => ({ ...x, featured: x.id === p.id ? !p.featured : false })))
                    toast(p.featured ? 'Destaque removido.' : `${p.name} marcado como mais utilizado.`, 'info')
                  }}
                  onToggle={() => {
                    setPlans((ps) => ps.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x)))
                    toast(p.active ? `Plano ${p.name} desativado.` : `Plano ${p.name} ativado.`, p.active ? 'warning' : 'success')
                  }}
                  onDelete={() => setDeleting(p)}
                />
              </div>
            </Card>
          )
        })}
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Editar Plano ${editing.name}` : 'Novo Plano'}
        subtitle="Limites e recursos aplicados aos escritórios assinantes"
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save}>{editing ? 'Salvar plano' : 'Criar plano'}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome do plano">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Valor mensal (R$)">
            <Input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          </Field>
          <Field label="Descrição" className="sm:col-span-2">
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Máx. clientes" hint="Use ∞ para ilimitado">
            <Input value={form.clients} onChange={(e) => setForm({ ...form, clients: e.target.value })} />
          </Field>
          <Field label="Máx. usuários" hint="Use ∞ para ilimitado">
            <Input value={form.users} onChange={(e) => setForm({ ...form, users: e.target.value })} />
          </Field>
          <Field label="Armazenamento">
            <Input value={form.storage} onChange={(e) => setForm({ ...form, storage: e.target.value })} placeholder="Ex.: 10 GB" />
          </Field>
          <Field label="Cor do plano">
            <Select
              value={form.color}
              onChange={(v) => setForm({ ...form, color: v as Color })}
              options={[
                { value: 'sky', label: 'Azul claro' },
                { value: 'indigo', label: 'Índigo' },
                { value: 'violet', label: 'Violeta' },
                { value: 'emerald', label: 'Verde' },
                { value: 'amber', label: 'Âmbar' },
              ]}
              className="h-10 w-full"
            />
          </Field>
          <Field label="Recursos incluídos (um por linha)" className="sm:col-span-2">
            <Textarea rows={6} value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })} />
          </Field>
          <div className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5 sm:col-span-2">
            <span className="text-[13px] font-medium">Plano ativo para novas assinaturas</span>
            <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} />
          </div>
        </div>
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Excluir plano"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setPlans((ps) => ps.filter((x) => x.id !== deleting!.id))
                toast(`Plano ${deleting!.name} excluído.`, 'warning')
                setDeleting(null)
              }}
            >
              Excluir
            </Button>
          </>
        }
      >
        <p className="text-[13px] text-slate-600">
          Tem certeza que deseja excluir o plano <b>{deleting?.name}</b>?
          {deleting && deleting.offices > 0 && ` ${deleting.offices} escritórios ativos precisarão ser migrados para outro plano.`}
        </p>
      </Modal>
    </div>
  )
}
