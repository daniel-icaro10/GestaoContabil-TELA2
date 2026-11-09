import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Avatar,
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
  Toggle,
} from '../../components/ui'
import { useToast } from '../../components/Toast'
import { initials, matches } from '../../lib/utils'
import { offices, profileTone, users as seed, type PlatformUser, type Profile } from './data'

const profiles: Profile[] = ['Super Admin', 'Admin do Escritório', 'Contador', 'Colaborador', 'Cliente']
type StatusFilter = 'Todos' | 'Ativo' | 'Inativo'

const officeOptions = ['HUBContábil', ...offices.map((o) => o.name.replace(/ (Ltda|ME|Associados|Fiscal|Empresarial|Completa|& Tributos|Contábil)$/, ''))]

const blank = { name: '', email: '', office: 'HUBContábil', profile: 'Contador' as Profile, active: true }

export default function Usuarios() {
  const toast = useToast()
  const [list, setList] = useState(seed)
  const [q, setQ] = useState('')
  const [profile, setProfile] = useState('Todos')
  const [status, setStatus] = useState<StatusFilter>('Todos')
  const [viewing, setViewing] = useState<PlatformUser | null>(null)
  const [editing, setEditing] = useState<PlatformUser | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(blank)

  const filtered = useMemo(
    () =>
      list.filter(
        (u) =>
          matches(q, u.name, u.email, u.office) &&
          (profile === 'Todos' || u.profile === profile) &&
          (status === 'Todos' || (status === 'Ativo' ? u.active : !u.active)),
      ),
    [list, q, profile, status],
  )

  function openNew() {
    setEditing(null)
    setForm(blank)
    setFormOpen(true)
  }
  function openEdit(u: PlatformUser) {
    setEditing(u)
    setForm({ name: u.name, email: u.email, office: u.office, profile: u.profile, active: u.active })
    setFormOpen(true)
  }
  function save() {
    if (!form.name.trim() || !form.email.includes('@')) {
      toast('Informe nome e um e-mail válido.', 'warning')
      return
    }
    if (editing) {
      setList((l) => l.map((u) => (u.id === editing.id ? { ...u, ...form } : u)))
      toast(`Usuário ${form.name} atualizado.`)
    } else {
      setList((l) => [...l, { ...form, id: Date.now(), lastAccess: 'nunca' }])
      toast(`Convite enviado para ${form.email}.`)
    }
    setFormOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={q} onChange={setQ} placeholder="Buscar usuário ou e-mail..." className="w-full sm:w-44" />
        <Select
          value={profile}
          onChange={setProfile}
          options={[{ value: 'Todos', label: 'Todos' }, ...profiles.map((p) => ({ value: p, label: p }))]}
          className="w-32"
        />
        <Chips
          value={status}
          onChange={setStatus}
          options={(['Todos', 'Ativo', 'Inativo'] as StatusFilter[]).map((v) => ({ value: v, label: v }))}
        />
        <Button className="ml-auto" icon={<Plus size={16} />} onClick={openNew}>
          Novo Usuário
        </Button>
      </div>

      <Card className="overflow-hidden">
        <Table head={['Usuário', 'E-mail', 'Escritório', 'Perfil', 'Status', 'Último acesso', 'Ações']}>
          {filtered.length === 0 && <EmptyRow cols={7} />}
          {filtered.map((u) => (
            <tr key={u.id} className="hover:bg-slate-50/60">
              <Td>
                <div className="flex items-center gap-3">
                  <Avatar text={initials(u.name)} size={26} tone={u.id % 6} />
                  <span className="font-bold text-ink">{u.name}</span>
                </div>
              </Td>
              <Td className="text-xs">{u.email}</Td>
              <Td className="text-xs text-ink">{u.office}</Td>
              <Td>
                <Badge tone={profileTone[u.profile]}>{u.profile}</Badge>
              </Td>
              <Td>
                <Badge tone={u.active ? 'green' : 'gray'}>{u.active ? 'Ativo' : 'Inativo'}</Badge>
              </Td>
              <Td className="text-xs text-muted">{u.lastAccess}</Td>
              <Td right>
                <div className="flex justify-end gap-1.5">
                  <Button size="sm" variant="outline" className="h-7 px-2.5 text-[11px]" onClick={() => setViewing(u)}>
                    Ver
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 px-2.5 text-[11px]" onClick={() => openEdit(u)}>
                    Editar
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
        <div className="border-t border-line px-5 py-3 text-[11px] text-muted">{filtered.length} usuários encontrados</div>
      </Card>

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.name}
        subtitle={viewing?.email}
        footer={
          <>
            <Button
              variant={viewing?.active ? 'dangerOutline' : 'success'}
              onClick={() => {
                const u = viewing!
                setList((l) => l.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x)))
                toast(u.active ? `${u.name} foi desativado.` : `${u.name} foi reativado.`, u.active ? 'warning' : 'success')
                setViewing(null)
              }}
            >
              {viewing?.active ? 'Desativar usuário' : 'Reativar usuário'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => toast(`Link de redefinição de senha enviado para ${viewing?.email}.`, 'info')}
            >
              Redefinir senha
            </Button>
          </>
        }
      >
        {viewing && (
          <>
            <div className="mb-4 flex items-center gap-3">
              <Avatar text={initials(viewing.name)} size={48} tone={viewing.id % 6} />
              <div>
                <p className="font-bold">{viewing.name}</p>
                <Badge tone={profileTone[viewing.profile]}>{viewing.profile}</Badge>
              </div>
            </div>
            <InfoRow label="Escritório" value={viewing.office} />
            <InfoRow label="E-mail" value={viewing.email} />
            <InfoRow label="Status" value={<Badge tone={viewing.active ? 'green' : 'gray'}>{viewing.active ? 'Ativo' : 'Inativo'}</Badge>} />
            <InfoRow label="Último acesso" value={viewing.lastAccess} />
            <InfoRow label="Autenticação em 2 fatores" value={viewing.id % 2 ? 'Habilitada' : 'Desabilitada'} />
          </>
        )}
      </Modal>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Editar Usuário' : 'Novo Usuário'}
        subtitle={editing ? editing.email : 'Um convite de acesso será enviado por e-mail'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save}>{editing ? 'Salvar alterações' : 'Enviar convite'}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome completo" className="sm:col-span-2">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="E-mail" className="sm:col-span-2">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Escritório">
            <Select
              value={form.office}
              onChange={(v) => setForm({ ...form, office: v })}
              options={Array.from(new Set([form.office, ...officeOptions]))}
              className="h-10 w-full"
            />
          </Field>
          <Field label="Perfil">
            <Select value={form.profile} onChange={(v) => setForm({ ...form, profile: v as Profile })} options={profiles} className="h-10 w-full" />
          </Field>
          <div className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5 sm:col-span-2">
            <span className="text-[13px] font-medium">Usuário ativo</span>
            <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
