import { useMemo, useState } from 'react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  Chips,
  EmptyRow,
  Field,
  InfoRow,
  Input,
  Modal,
  SearchInput,
  Select,
  Table,
  Td,
} from '../../components/ui'
import { useToast } from '../../components/Toast'
import { cn, matches } from '../../lib/utils'
import { offices as seed, officeStatusTone, planPrice, todayBR, type Office, type OfficeStatus, type PlanName } from './data'
import { LetterBox, PlanBadge } from './shared'
import { ModulesCount, OfficeModulesModal } from './OfficeModules'
import { getOfficeModules, moduleLabel } from '../../lib/modules'

const PAGE = 8
type Filter = 'Todos' | OfficeStatus

const empty: Omit<Office, 'id' | 'createdAt'> = {
  name: '',
  responsible: '',
  clients: 0,
  plan: 'Essencial',
  status: 'Teste',
  city: '',
  email: '',
}

export default function Escritorios() {
  const toast = useToast()
  const [list, setList] = useState(seed)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<Filter>('Todos')
  const [plan, setPlan] = useState('Todos')
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<Office | null>(null)
  const [editing, setEditing] = useState<Office | null>(null)
  const [form, setForm] = useState(empty)
  const [formOpen, setFormOpen] = useState(false)
  const [modulesOf, setModulesOf] = useState<Office | null>(null)
  const [, setTick] = useState(0)

  const filtered = useMemo(
    () =>
      list.filter(
        (o) =>
          matches(q, o.name, o.responsible, o.email) &&
          (status === 'Todos' || o.status === status) &&
          (plan === 'Todos' || o.plan === plan),
      ),
    [list, q, status, plan],
  )
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PAGE, current * PAGE)

  function openNew() {
    setEditing(null)
    setForm(empty)
    setFormOpen(true)
  }
  function openEdit(o: Office) {
    setEditing(o)
    setForm({ name: o.name, responsible: o.responsible, clients: o.clients, plan: o.plan, status: o.status, city: o.city, email: o.email })
    setFormOpen(true)
  }
  function save() {
    if (!form.name.trim() || !form.responsible.trim()) {
      toast('Preencha o nome do escritório e o responsável.', 'warning')
      return
    }
    if (editing) {
      setList((l) => l.map((o) => (o.id === editing.id ? { ...o, ...form } : o)))
      toast(`Escritório "${form.name}" atualizado.`)
    } else {
      setList((l) => [{ ...form, id: Date.now(), createdAt: todayBR() }, ...l])
      toast(`Escritório "${form.name}" cadastrado com sucesso.`)
      setPage(1)
    }
    setFormOpen(false)
  }
  function toggleStatus(o: Office) {
    const next: OfficeStatus = o.status === 'Suspenso' ? 'Ativo' : 'Suspenso'
    setList((l) => l.map((x) => (x.id === o.id ? { ...x, status: next } : x)))
    toast(next === 'Suspenso' ? `${o.name} foi suspenso.` : `${o.name} foi reativado.`, next === 'Suspenso' ? 'warning' : 'success')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={q}
          onChange={(v) => {
            setQ(v)
            setPage(1)
          }}
          placeholder="Buscar escritório..."
          className="w-full sm:w-44"
        />
        <Chips
          value={status}
          onChange={(v) => {
            setStatus(v)
            setPage(1)
          }}
          options={(['Todos', 'Ativo', 'Teste', 'Suspenso'] as Filter[]).map((v) => ({ value: v, label: v }))}
        />
        <Select
          value={plan}
          onChange={(v) => {
            setPlan(v)
            setPage(1)
          }}
          options={[
            { value: 'Todos', label: 'Todos' },
            { value: 'Essencial', label: 'Essencial' },
            { value: 'Profissional', label: 'Profissional' },
            { value: 'Premium', label: 'Premium' },
          ]}
          className="w-28"
        />
        <Button className="ml-auto" icon={<Plus size={16} />} onClick={openNew}>
          Novo Escritório
        </Button>
      </div>

      <Card className="overflow-hidden">
        <Table head={['Escritório', 'Responsável', 'Clientes', 'Plano', 'Módulos', 'Status', 'Cadastro', 'Ações']}>
          {rows.length === 0 && <EmptyRow cols={8} />}
          {rows.map((o) => (
            <tr key={o.id} className="hover:bg-slate-50/60">
              <Td>
                <div className="flex items-center gap-3">
                  <LetterBox name={o.name} size={24} />
                  <span className="whitespace-nowrap font-bold text-ink">{o.name}</span>
                </div>
              </Td>
              <Td className="whitespace-nowrap">{o.responsible}</Td>
              <Td className="num text-ink">{o.clients}</Td>
              <Td>
                <PlanBadge plan={o.plan} />
              </Td>
              <Td>
                <ModulesCount office={o} onClick={() => setModulesOf(o)} />
              </Td>
              <Td>
                <Badge tone={officeStatusTone[o.status]}>{o.status}</Badge>
              </Td>
              <Td className="num text-muted">{o.createdAt}</Td>
              <Td right>
                <div className="flex justify-end gap-1.5">
                  <Button size="sm" variant="outline" className="h-7 px-2.5 text-[11px]" onClick={() => setViewing(o)}>
                    Ver
                  </Button>
                  <Button size="sm" variant="secondary" className="h-7 px-2.5 text-[11px]" onClick={() => openEdit(o)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="soft" className="h-7 px-2.5 text-[11px]" onClick={() => setModulesOf(o)}>
                    Módulos
                  </Button>
                  <Button
                    size="sm"
                    variant="dangerOutline"
                    className={cn('h-7 px-2.5 text-[11px]', o.status === 'Suspenso' && 'text-orange-600')}
                    onClick={() => toggleStatus(o)}
                  >
                    {o.status === 'Suspenso' ? 'Ativar' : 'Suspender'}
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
        <div className="flex items-center justify-between border-t border-line px-5 py-3">
          <span className="text-[11px] text-muted">{filtered.length} escritórios encontrados</span>
          <div className="flex gap-1.5">
            <button
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-line text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'h-7 w-7 cursor-pointer rounded-md border text-xs font-semibold',
                  p === current ? 'border-brand bg-brand text-white' : 'border-line text-slate-500 hover:bg-slate-50',
                )}
              >
                {p}
              </button>
            ))}
            <button
              disabled={current === pages}
              onClick={() => setPage(current + 1)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-line text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </Card>

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.name}
        subtitle="Detalhes do escritório"
        footer={
          <>
            <Button variant="secondary" onClick={() => setViewing(null)}>
              Fechar
            </Button>
            <Button
              onClick={() => {
                const o = viewing!
                setViewing(null)
                openEdit(o)
              }}
            >
              Editar
            </Button>
          </>
        }
      >
        {viewing && (
          <>
            <InfoRow label="Responsável" value={viewing.responsible} />
            <InfoRow label="E-mail" value={viewing.email || '—'} />
            <InfoRow label="Cidade" value={viewing.city || '—'} />
            <InfoRow label="Clientes" value={viewing.clients} />
            <InfoRow label="Plano" value={<PlanBadge plan={viewing.plan} />} />
            <InfoRow label="Mensalidade" value={`R$ ${planPrice[viewing.plan]},00`} />
            <InfoRow label="Status" value={<Badge tone={officeStatusTone[viewing.status]}>{viewing.status}</Badge>} />
            <InfoRow label="Cadastro" value={viewing.createdAt} />
            <div className="pt-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-muted">Módulos ativos</span>
                <button
                  onClick={() => {
                    const o = viewing
                    setViewing(null)
                    setModulesOf(o)
                  }}
                  className="cursor-pointer text-xs font-semibold text-brand hover:underline"
                >
                  Configurar
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {getOfficeModules(viewing.id, viewing.plan).map((k) => (
                  <Badge key={k} tone="brand">
                    {moduleLabel(k)}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </Modal>

      <OfficeModulesModal
        office={modulesOf}
        onClose={() => {
          setModulesOf(null)
          setTick((t) => t + 1)
        }}
      />

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Editar Escritório' : 'Novo Escritório'}
        subtitle={editing ? editing.name : 'Cadastre um novo escritório contábil na plataforma'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save}>{editing ? 'Salvar alterações' : 'Cadastrar'}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome do escritório" className="sm:col-span-2">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex.: Ômega Contabilidade" />
          </Field>
          <Field label="Responsável">
            <Input value={form.responsible} onChange={(e) => setForm({ ...form, responsible: e.target.value })} />
          </Field>
          <Field label="E-mail">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Cidade / UF">
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </Field>
          <Field label="Clientes">
            <Input type="number" min={0} value={form.clients} onChange={(e) => setForm({ ...form, clients: Number(e.target.value) })} />
          </Field>
          <Field label="Plano">
            <Select
              value={form.plan}
              onChange={(v) => setForm({ ...form, plan: v as PlanName })}
              options={['Essencial', 'Profissional', 'Premium']}
              className="h-10 w-full"
            />
          </Field>
          <Field label="Status">
            <Select
              value={form.status}
              onChange={(v) => setForm({ ...form, status: v as OfficeStatus })}
              options={['Ativo', 'Teste', 'Suspenso']}
              className="h-10 w-full"
            />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
