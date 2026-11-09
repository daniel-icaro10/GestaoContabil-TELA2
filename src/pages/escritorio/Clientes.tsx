import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Download } from 'lucide-react'
import { Card, Badge, Button, Chips, SearchInput, Table, Td, EmptyRow, Modal, Field, Input, Select, PageTitle, StatCard, Avatar } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { brl, matches, downloadCsv } from '../../lib/utils'
import { clientes as seed, responsaveis, type Cliente } from './data'

type Filtro = 'todos' | 'PJ' | 'PF' | 'Ativo' | 'Inativo'

const vazio: Cliente = {
  id: '',
  nome: '',
  tipo: 'PJ',
  doc: '',
  regime: 'Simples Nacional',
  responsavel: responsaveis[0],
  honorario: 0,
  status: 'Ativo',
  email: '',
  telefone: '',
  cidade: '',
  desde: '',
}

export default function Clientes() {
  const toast = useToast()
  const navigate = useNavigate()
  const [lista, setLista] = useState<Cliente[]>(seed)
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [busca, setBusca] = useState('')
  const [edit, setEdit] = useState<Cliente | null>(null)

  const filtrados = useMemo(
    () =>
      lista.filter(
        (c) =>
          (filtro === 'todos' || c.tipo === filtro || c.status === filtro) &&
          matches(busca, c.nome, c.doc, c.responsavel, c.regime),
      ),
    [lista, filtro, busca],
  )

  const pj = lista.filter((c) => c.tipo === 'PJ').length
  const pf = lista.filter((c) => c.tipo === 'PF').length
  const ativos = lista.filter((c) => c.status === 'Ativo')
  const mrr = ativos.reduce((s, c) => s + c.honorario, 0)

  function salvar() {
    if (!edit) return
    if (!edit.nome.trim()) return toast('Informe o nome do cliente', 'warning')
    if (edit.id) {
      setLista((l) => l.map((c) => (c.id === edit.id ? edit : c)))
      toast(`Cliente ${edit.nome} atualizado`)
    } else {
      const novo = { ...edit, id: `c${Date.now()}`, desde: '11/2026' }
      setLista((l) => [novo, ...l])
      toast(`Cliente ${edit.nome} cadastrado`)
    }
    setEdit(null)
  }

  const upd = (k: keyof Cliente) => (e: { target: { value: string } }) =>
    setEdit((c) => (c ? { ...c, [k]: k === 'honorario' ? Number(e.target.value) || 0 : e.target.value } : c))

  return (
    <div className="space-y-5">
      <PageTitle
        title="Clientes"
        subtitle={`Carteira de clientes · ${lista.length} cadastrados`}
        actions={
          <>
            <Button
              variant="outline"
              icon={<Download size={15} />}
              onClick={() =>
                downloadCsv(
                  'clientes.csv',
                  filtrados.map((c) => ({
                    Cliente: c.nome,
                    Tipo: c.tipo,
                    Documento: c.doc,
                    Regime: c.regime,
                    Responsavel: c.responsavel,
                    Honorario: c.honorario,
                    Status: c.status,
                  })),
                )
              }
            >
              Exportar
            </Button>
            <Button icon={<Plus size={15} />} onClick={() => setEdit({ ...vazio })}>
              Novo Cliente
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total de clientes" value={lista.length} sub={`${ativos.length} ativos`} progress={(ativos.length / lista.length) * 100} />
        <StatCard label="Pessoa Jurídica" value={pj} sub="empresas atendidas" progress={(pj / lista.length) * 100} progressColor="bg-brand" />
        <StatCard label="Pessoa Física" value={pf} sub="clientes PF" progress={(pf / lista.length) * 100} progressColor="bg-sky-400" />
        <StatCard label="Honorários mensais" value={brl(mrr)} sub="soma dos clientes ativos" progress={72} progressColor="bg-emerald-500" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Chips
          value={filtro}
          onChange={setFiltro}
          options={[
            { value: 'todos', label: 'Todos' },
            { value: 'PJ', label: 'PJ' },
            { value: 'PF', label: 'PF' },
            { value: 'Ativo', label: 'Ativos' },
            { value: 'Inativo', label: 'Inativos' },
          ]}
        />
        <SearchInput value={busca} onChange={setBusca} placeholder="Buscar cliente, documento ou responsável..." className="min-w-60 flex-1" />
      </div>

      <Card className="overflow-hidden">
        <Table head={['Cliente', 'Tipo', 'CNPJ / CPF', 'Regime', 'Responsável', 'Honorário', 'Status', 'Ações']}>
          {filtrados.length === 0 && <EmptyRow cols={8} />}
          {filtrados.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50/60">
              <Td>
                <div className="flex items-center gap-3">
                  <Avatar text={c.nome[0]} size={30} />
                  <div>
                    <p className="font-bold text-ink">{c.nome}</p>
                    <p className="text-[11px] text-muted">{c.cidade}</p>
                  </div>
                </div>
              </Td>
              <Td>
                <Badge tone={c.tipo === 'PJ' ? 'blue' : 'sky'}>{c.tipo}</Badge>
              </Td>
              <Td className="num text-xs">{c.doc}</Td>
              <Td>{c.regime}</Td>
              <Td>{c.responsavel}</Td>
              <Td className="num font-medium text-ink">{brl(c.honorario)}</Td>
              <Td>
                <Badge tone={c.status === 'Ativo' ? 'green' : 'gray'}>{c.status}</Badge>
              </Td>
              <Td right>
                <div className="flex justify-end gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/escritorio/clientes/${c.id}`)}>
                    Ver
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setEdit({ ...c })}>
                    Editar
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
        <p className="border-t border-line px-5 py-3 text-xs text-muted">{filtrados.length} clientes encontrados</p>
      </Card>

      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? 'Editar Cliente' : 'Novo Cliente'}
        subtitle={edit?.id ? edit.nome : 'Cadastre uma empresa ou pessoa física'}
        width="max-w-2xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEdit(null)}>
              Cancelar
            </Button>
            <Button onClick={salvar}>{edit?.id ? 'Salvar alterações' : 'Cadastrar cliente'}</Button>
          </>
        }
      >
        {edit && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Tipo">
              <Select
                value={edit.tipo}
                onChange={(v) => setEdit({ ...edit, tipo: v as 'PJ' | 'PF', regime: v === 'PF' ? 'Pessoa Física' : 'Simples Nacional' })}
                options={['PJ', 'PF']}
                className="w-full"
              />
            </Field>
            <Field label="Status">
              <Select value={edit.status} onChange={(v) => setEdit({ ...edit, status: v as Cliente['status'] })} options={['Ativo', 'Inativo']} className="w-full" />
            </Field>
            <Field label={edit.tipo === 'PJ' ? 'Razão social' : 'Nome completo'} className="sm:col-span-2">
              <Input value={edit.nome} onChange={upd('nome')} />
            </Field>
            <Field label={edit.tipo === 'PJ' ? 'CNPJ' : 'CPF'}>
              <Input value={edit.doc} onChange={upd('doc')} placeholder={edit.tipo === 'PJ' ? '00.000.000/0001-00' : '000.000.000-00'} />
            </Field>
            <Field label="Regime">
              <Select
                value={edit.regime}
                onChange={(v) => setEdit({ ...edit, regime: v })}
                options={edit.tipo === 'PJ' ? ['Simples Nacional', 'Lucro Presumido', 'Lucro Real', 'MEI'] : ['Pessoa Física']}
                className="w-full"
              />
            </Field>
            <Field label="Responsável">
              <Select value={edit.responsavel} onChange={(v) => setEdit({ ...edit, responsavel: v })} options={responsaveis} className="w-full" />
            </Field>
            <Field label="Honorário mensal (R$)">
              <Input type="number" value={edit.honorario || ''} onChange={upd('honorario')} />
            </Field>
            <Field label="E-mail">
              <Input value={edit.email} onChange={upd('email')} />
            </Field>
            <Field label="Telefone">
              <Input value={edit.telefone} onChange={upd('telefone')} />
            </Field>
            <Field label="Cidade / UF" className="sm:col-span-2">
              <Input value={edit.cidade} onChange={upd('cidade')} />
            </Field>
          </div>
        )}
      </Modal>
    </div>
  )
}
