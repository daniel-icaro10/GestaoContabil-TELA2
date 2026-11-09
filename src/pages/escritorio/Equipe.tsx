import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Card, Badge, Button, Chips, Avatar, Modal, Field, Input, Select, PageTitle, type Tone } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { initials } from '../../lib/utils'
import { equipe as seed, clientes, type Membro } from './data'

const papelTone: Record<string, Tone> = {
  Administrador: 'violet',
  Contador: 'blue',
  Analista: 'sky',
  'Dep. Pessoal': 'green',
  Assistente: 'gray',
}
const PAPEIS = Object.keys(papelTone)

const vazio: Membro = { id: '', nome: '', email: '', papel: 'Contador', status: 'Ativo', clientes: 0, tarefas: 0, acesso: 'nunca' }

export default function Equipe() {
  const toast = useToast()
  const navigate = useNavigate()
  const [lista, setLista] = useState<Membro[]>(seed)
  const [filtro, setFiltro] = useState<'todos' | 'Ativo' | 'Inativo'>('todos')
  const [edit, setEdit] = useState<Membro | null>(null)
  const [verClientes, setVerClientes] = useState<Membro | null>(null)

  const filtrados = lista.filter((m) => filtro === 'todos' || m.status === filtro)

  function salvar() {
    if (!edit) return
    if (!edit.nome.trim() || !edit.email.trim()) return toast('Preencha nome e e-mail', 'warning')
    if (edit.id) {
      setLista((l) => l.map((m) => (m.id === edit.id ? edit : m)))
      toast(`${edit.nome} atualizado`)
    } else {
      setLista((l) => [...l, { ...edit, id: `m${Date.now()}` }])
      toast(`Convite enviado para ${edit.email}`)
    }
    setEdit(null)
  }

  const carteira = verClientes ? clientes.filter((c) => c.responsavel === verClientes.nome) : []

  return (
    <div className="space-y-5">
      <PageTitle
        title="Equipe"
        subtitle={`${lista.length} membros · Gerenciamento e atribuições`}
        actions={
          <Button icon={<Plus size={15} />} onClick={() => setEdit({ ...vazio })}>
            Novo membro
          </Button>
        }
      />
      <Chips
        value={filtro}
        onChange={setFiltro}
        options={[
          { value: 'todos', label: 'Todos' },
          { value: 'Ativo', label: 'Ativos' },
          { value: 'Inativo', label: 'Inativos' },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtrados.map((m) => (
          <Card key={m.id} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar text={initials(m.nome)} size={40} className="rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-ink">{m.nome}</p>
                <p className="truncate text-xs text-muted">{m.email}</p>
              </div>
              <Badge tone={m.status === 'Ativo' ? 'green' : 'gray'}>{m.status}</Badge>
            </div>
            <Badge tone={papelTone[m.papel] ?? 'gray'} className="mt-3">
              {m.papel}
            </Badge>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ['Clientes', m.clientes],
                ['Tarefas', m.tarefas],
                ['Acesso', m.acesso],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg bg-slate-50 px-2.5 py-2">
                  <p className="text-[10px] text-muted">{l}</p>
                  <p className="num truncate text-[14px] text-ink">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="soft" size="sm" onClick={() => setVerClientes(m)}>
                Ver clientes
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setEdit({ ...m })}>
                Editar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? 'Editar membro' : 'Novo membro'}
        subtitle={edit?.id ? edit.email : 'Um convite de acesso será enviado por e-mail'}
        footer={
          <>
            {edit?.id && (
              <Button
                variant="dangerOutline"
                className="mr-auto"
                onClick={() => {
                  setLista((l) => l.filter((m) => m.id !== edit.id))
                  toast(`${edit.nome} removido da equipe`, 'info')
                  setEdit(null)
                }}
              >
                Remover
              </Button>
            )}
            <Button variant="secondary" onClick={() => setEdit(null)}>Cancelar</Button>
            <Button onClick={salvar}>{edit?.id ? 'Salvar' : 'Enviar convite'}</Button>
          </>
        }
      >
        {edit && (
          <div className="space-y-4">
            <Field label="Nome completo">
              <Input value={edit.nome} onChange={(e) => setEdit({ ...edit, nome: e.target.value })} />
            </Field>
            <Field label="E-mail">
              <Input value={edit.email} onChange={(e) => setEdit({ ...edit, email: e.target.value })} placeholder="nome@contadorcentral.com.br" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Perfil">
                <Select value={edit.papel} onChange={(v) => setEdit({ ...edit, papel: v })} options={PAPEIS} className="w-full" />
              </Field>
              <Field label="Status">
                <Select value={edit.status} onChange={(v) => setEdit({ ...edit, status: v as Membro['status'] })} options={['Ativo', 'Inativo']} className="w-full" />
              </Field>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!verClientes} onClose={() => setVerClientes(null)} title={`Clientes de ${verClientes?.nome ?? ''}`} subtitle={`${verClientes?.clientes ?? 0} clientes na carteira`}>
        {carteira.length === 0 && <p className="py-4 text-center text-xs text-muted">Nenhum cliente de exemplo atribuído neste ambiente.</p>}
        {carteira.map((c) => (
          <button
            key={c.id}
            onClick={() => navigate(`/escritorio/clientes/${c.id}`)}
            className="flex w-full cursor-pointer items-center justify-between gap-3 border-b border-line py-2.5 text-left last:border-0 hover:text-brand"
          >
            <span className="text-[13px] font-semibold">{c.nome}</span>
            <Badge tone={c.tipo === 'PJ' ? 'blue' : 'sky'}>{c.tipo}</Badge>
          </button>
        ))}
      </Modal>
    </div>
  )
}
