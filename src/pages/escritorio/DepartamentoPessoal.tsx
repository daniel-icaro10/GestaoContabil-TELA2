import { useState } from 'react'
import { Card, CardHeader, Badge, Button, Chips, SearchInput, Table, Td, EmptyRow, Modal, Field, Input, Select, PageTitle, Progress, InfoRow, type Tone } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { brl, matches, downloadFile } from '../../lib/utils'
import { funcionarios as seed, clientes, type Funcionario } from './data'

type Aba = 'funcionarios' | 'admissoes' | 'rescisoes'
type Tarefa = { id: number; titulo: string; empresa: string; prazo: string; prio: 'Urgente' | 'Alta' | 'Normal' }
type Processo = { id: number; nome: string; empresa: string; cargo: string; data: string; etapa: string }

const statusTone: Record<Funcionario['status'], Tone> = { Ativo: 'green', Férias: 'amber', Demitido: 'red' }
const prioTone: Record<Tarefa['prio'], Tone> = { Urgente: 'red', Alta: 'amber', Normal: 'blue' }
const empresasPJ = clientes.filter((c) => c.tipo === 'PJ').map((c) => c.nome)

export default function DepartamentoPessoal() {
  const toast = useToast()
  const [lista, setLista] = useState<Funcionario[]>(seed)
  const [aba, setAba] = useState<Aba>('funcionarios')
  const [busca, setBusca] = useState('')
  const [tarefas, setTarefas] = useState<Tarefa[]>([
    { id: 1, titulo: 'Admissão', empresa: 'Gama Fiscal', prazo: 'Hoje', prio: 'Urgente' },
    { id: 2, titulo: 'Rescisão', empresa: 'Beta Assessoria', prazo: 'Amanhã', prio: 'Alta' },
    { id: 3, titulo: 'Férias', empresa: 'Alfa Contabilidade', prazo: '25 Out', prio: 'Normal' },
    { id: 4, titulo: 'FGTS Digital', empresa: '3 clientes', prazo: '07 Nov', prio: 'Normal' },
  ])
  const [admissoes, setAdmissoes] = useState<Processo[]>([
    { id: 1, nome: 'Lucas Silveira', empresa: 'Gama Fiscal', cargo: 'Designer Pleno', data: '21/10/2024', etapa: 'Aguardando documentos' },
    { id: 2, nome: 'Paula Rocha', empresa: 'Delta Contadores', cargo: 'Assistente Adm.', data: '28/10/2024', etapa: 'Exame admissional' },
  ])
  const [rescisoes, setRescisoes] = useState<Processo[]>([
    { id: 1, nome: 'Sérgio Lima', empresa: 'Beta Assessoria', cargo: 'Operador', data: '18/10/2024', etapa: 'Cálculo de verbas' },
    { id: 2, nome: 'André Pires', empresa: 'Alfa Contabilidade', cargo: 'Auxiliar', data: '05/10/2024', etapa: 'Homologado' },
  ])

  const [modal, setModal] = useState<null | 'admissao' | 'rescisao'>(null)
  const [form, setForm] = useState({ nome: '', empresa: empresasPJ[0], cargo: '', salario: '', data: '', funcionario: '', motivo: 'Sem justa causa' })
  const [ver, setVer] = useState<Funcionario | null>(null)
  const [tarefaSel, setTarefaSel] = useState<Tarefa | null>(null)

  const ativos = lista.filter((f) => f.status !== 'Demitido')
  const filtrados = lista.filter((f) => matches(busca, f.nome, f.empresa, f.cargo))
  const admF = admissoes.filter((p) => matches(busca, p.nome, p.empresa, p.cargo))
  const resF = rescisoes.filter((p) => matches(busca, p.nome, p.empresa, p.cargo))

  function close() {
    setModal(null)
    setForm({ nome: '', empresa: empresasPJ[0], cargo: '', salario: '', data: '', funcionario: '', motivo: 'Sem justa causa' })
  }

  function salvarAdmissao() {
    if (!form.nome || !form.cargo) return toast('Preencha nome e cargo', 'warning')
    const data = form.data ? form.data.split('-').reverse().join('/') : new Date().toLocaleDateString('pt-BR')
    setAdmissoes((a) => [{ id: Date.now(), nome: form.nome, empresa: form.empresa, cargo: form.cargo, data, etapa: 'Aguardando documentos' }, ...a])
    setLista((l) => [
      ...l,
      { id: `f${Date.now()}`, nome: form.nome, empresa: form.empresa, cargo: form.cargo, admissao: data, salario: Number(form.salario) || 0, status: 'Ativo', pendencia: 'Admissão doc.' },
    ])
    setTarefas((t) => [{ id: Date.now(), titulo: 'Admissão', empresa: form.empresa, prazo: 'Hoje', prio: 'Alta' }, ...t])
    toast(`Admissão de ${form.nome} iniciada`)
    setAba('admissoes')
    close()
  }

  function salvarRescisao() {
    const f = lista.find((x) => x.id === form.funcionario)
    if (!f) return toast('Selecione o funcionário', 'warning')
    setLista((l) => l.map((x) => (x.id === f.id ? { ...x, status: 'Demitido', pendencia: 'Rescisão' } : x)))
    setRescisoes((r) => [{ id: Date.now(), nome: f.nome, empresa: f.empresa, cargo: f.cargo, data: new Date().toLocaleDateString('pt-BR'), etapa: 'Cálculo de verbas' }, ...r])
    setTarefas((t) => [{ id: Date.now(), titulo: 'Rescisão', empresa: f.empresa, prazo: '10 dias', prio: 'Alta' }, ...t])
    toast(`Rescisão de ${f.nome} registrada (${form.motivo})`)
    setAba('rescisoes')
    close()
  }

  const stats = [
    { label: 'Funcionários ativos', value: ativos.filter((f) => f.status === 'Ativo').length + 43, color: 'bg-emerald-500' },
    { label: 'Em férias', value: lista.filter((f) => f.status === 'Férias').length + 2, color: 'bg-amber-500' },
    { label: 'Demissões (mês)', value: rescisoes.length, color: 'bg-red-500' },
    { label: 'Tarefas pendentes', value: tarefas.length + 4, color: 'bg-amber-600' },
    { label: 'FGTS em aberto', value: lista.filter((f) => f.pendencia === 'FGTS').length, color: 'bg-violet-500' },
  ]

  const proc = (rows: Processo[], tipo: 'admissoes' | 'rescisoes') => (
    <Table head={['Funcionário', 'Empresa', 'Cargo', 'Data', 'Etapa', 'Ações']}>
      {rows.length === 0 && <EmptyRow cols={6} />}
      {rows.map((p) => (
        <tr key={p.id}>
          <Td className="font-bold text-ink">{p.nome}</Td>
          <Td>{p.empresa}</Td>
          <Td>{p.cargo}</Td>
          <Td className="num text-xs">{p.data}</Td>
          <Td>
            <Badge tone={p.etapa === 'Concluída' || p.etapa === 'Homologado' ? 'green' : 'amber'}>{p.etapa}</Badge>
          </Td>
          <Td right>
            <div className="flex justify-end gap-1.5">
              <Button size="sm" variant="secondary" onClick={() => downloadFile(`${tipo === 'admissoes' ? 'ficha_admissao' : 'trct'}_${p.nome.replace(/ /g, '_')}.pdf`)}>
                {tipo === 'admissoes' ? 'Ficha' : 'TRCT'}
              </Button>
              {p.etapa !== 'Concluída' && p.etapa !== 'Homologado' && (
                <Button
                  size="sm"
                  variant="soft"
                  onClick={() => {
                    const setter = tipo === 'admissoes' ? setAdmissoes : setRescisoes
                    setter((l) => l.map((x) => (x.id === p.id ? { ...x, etapa: tipo === 'admissoes' ? 'Concluída' : 'Homologado' } : x)))
                    if (tipo === 'admissoes') setLista((l) => l.map((f) => (f.nome === p.nome ? { ...f, pendencia: '—' } : f)))
                    toast(`${tipo === 'admissoes' ? 'Admissão' : 'Rescisão'} de ${p.nome} concluída`)
                  }}
                >
                  Concluir
                </Button>
              )}
            </div>
          </Td>
        </tr>
      ))}
    </Table>
  )

  return (
    <div className="space-y-5">
      <PageTitle
        title="Departamento Pessoal"
        subtitle={`Central de gestão de funcionários · ${lista.length} registros ativos`}
        actions={
          <>
            <Button variant="secondary" className="border-emerald-200! bg-emerald-50! text-emerald-700!" onClick={() => setModal('admissao')}>
              + Admissão
            </Button>
            <Button variant="secondary" className="border-red-200! bg-red-50! text-red-600!" onClick={() => setModal('rescisao')}>
              + Rescisão
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-[11px] text-slate-500">{s.label}</p>
            <p className="num mt-2 text-[24px] text-ink">{s.value}</p>
            <Progress value={45} color={s.color} className="mt-3" />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[210px_1fr]">
        <Card className="self-start">
          <CardHeader title="Tarefas Pendentes" />
          <div className="space-y-2 px-3 pb-3">
            {tarefas.length === 0 && <p className="py-6 text-center text-xs text-muted">Nenhuma tarefa.</p>}
            {tarefas.map((t) => (
              <button
                key={t.id}
                onClick={() => setTarefaSel(t)}
                className="w-full cursor-pointer rounded-xl bg-slate-50 p-3 text-left transition hover:bg-brand/5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-bold text-ink">{t.titulo}</p>
                  <Badge tone={prioTone[t.prio]}>{t.prio}</Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">{t.empresa}</p>
                <p className="num mt-1 text-[11px] text-slate-400">Prazo: {t.prazo}</p>
              </button>
            ))}
          </div>
        </Card>

        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Chips
              value={aba}
              onChange={setAba}
              options={[
                { value: 'funcionarios', label: 'Funcionários' },
                { value: 'admissoes', label: 'Admissões' },
                { value: 'rescisoes', label: 'Rescisões' },
              ]}
            />
            <SearchInput value={busca} onChange={setBusca} placeholder="Buscar funcionário ou empresa..." className="min-w-56 flex-1" />
          </div>
          <Card className="overflow-hidden">
            {aba === 'funcionarios' && (
              <Table head={['Funcionário', 'Empresa', 'Cargo', 'Admissão', 'Salário', 'Status', 'Pendência', 'Ações']}>
                {filtrados.length === 0 && <EmptyRow cols={8} />}
                {filtrados.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/60">
                    <Td className="font-bold text-ink">{f.nome}</Td>
                    <Td>{f.empresa}</Td>
                    <Td>{f.cargo}</Td>
                    <Td className="num text-xs text-slate-400">{f.admissao}</Td>
                    <Td className="num text-ink">{brl(f.salario)}</Td>
                    <Td>
                      <Badge tone={statusTone[f.status]}>{f.status}</Badge>
                    </Td>
                    <Td className={f.pendencia === '—' ? 'text-slate-400' : 'text-amber-600'}>{f.pendencia}</Td>
                    <Td right>
                      <Button size="sm" variant="secondary" className="border-emerald-200! bg-emerald-50! text-emerald-700!" onClick={() => setVer(f)}>
                        Ver
                      </Button>
                    </Td>
                  </tr>
                ))}
              </Table>
            )}
            {aba === 'admissoes' && proc(admF, 'admissoes')}
            {aba === 'rescisoes' && proc(resF, 'rescisoes')}
          </Card>
        </div>
      </div>

      {/* Ver funcionário */}
      <Modal
        open={!!ver}
        onClose={() => setVer(null)}
        title={ver?.nome}
        subtitle={`${ver?.cargo} · ${ver?.empresa}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => ver && downloadFile(`holerite_${ver.nome.replace(/ /g, '_')}.pdf`)}>
              Baixar holerite
            </Button>
            {ver && ver.status === 'Ativo' && (
              <Button
                variant="secondary"
                onClick={() => {
                  setLista((l) => l.map((x) => (x.id === ver.id ? { ...x, status: 'Férias' } : x)))
                  toast(`Férias programadas para ${ver.nome}`)
                  setVer(null)
                }}
              >
                Programar férias
              </Button>
            )}
            {ver && ver.pendencia !== '—' && (
              <Button
                onClick={() => {
                  setLista((l) => l.map((x) => (x.id === ver.id ? { ...x, pendencia: '—' } : x)))
                  toast('Pendência resolvida')
                  setVer(null)
                }}
              >
                Resolver pendência
              </Button>
            )}
          </>
        }
      >
        {ver && (
          <>
            <InfoRow label="Empresa" value={ver.empresa} />
            <InfoRow label="Cargo" value={ver.cargo} />
            <InfoRow label="Admissão" value={ver.admissao} />
            <InfoRow label="Salário" value={brl(ver.salario)} />
            <InfoRow label="FGTS (8%)" value={brl(ver.salario * 0.08)} />
            <InfoRow label="Status" value={<Badge tone={statusTone[ver.status]}>{ver.status}</Badge>} />
            <InfoRow label="Pendência" value={ver.pendencia} />
          </>
        )}
      </Modal>

      {/* Tarefa */}
      <Modal
        open={!!tarefaSel}
        onClose={() => setTarefaSel(null)}
        title={tarefaSel?.titulo}
        subtitle={tarefaSel?.empresa}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTarefaSel(null)}>Fechar</Button>
            <Button
              onClick={() => {
                setTarefas((t) => t.filter((x) => x.id !== tarefaSel?.id))
                toast('Tarefa concluída')
                setTarefaSel(null)
              }}
            >
              Concluir tarefa
            </Button>
          </>
        }
      >
        {tarefaSel && (
          <>
            <InfoRow label="Empresa" value={tarefaSel.empresa} />
            <InfoRow label="Prazo" value={tarefaSel.prazo} />
            <InfoRow label="Prioridade" value={<Badge tone={prioTone[tarefaSel.prio]}>{tarefaSel.prio}</Badge>} />
          </>
        )}
      </Modal>

      <Modal
        open={modal === 'admissao'}
        onClose={close}
        title="Nova Admissão"
        subtitle="Inicie o processo de admissão eSocial"
        footer={
          <>
            <Button variant="secondary" onClick={close}>Cancelar</Button>
            <Button variant="success" onClick={salvarAdmissao}>Iniciar admissão</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nome do colaborador" className="sm:col-span-2">
            <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </Field>
          <Field label="Empresa">
            <Select value={form.empresa} onChange={(v) => setForm({ ...form, empresa: v })} options={empresasPJ} className="w-full" />
          </Field>
          <Field label="Cargo">
            <Input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
          </Field>
          <Field label="Salário (R$)">
            <Input type="number" value={form.salario} onChange={(e) => setForm({ ...form, salario: e.target.value })} />
          </Field>
          <Field label="Data de admissão">
            <Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
          </Field>
        </div>
      </Modal>

      <Modal
        open={modal === 'rescisao'}
        onClose={close}
        title="Nova Rescisão"
        subtitle="Cálculo de verbas rescisórias e aviso"
        footer={
          <>
            <Button variant="secondary" onClick={close}>Cancelar</Button>
            <Button variant="danger" onClick={salvarRescisao}>Registrar rescisão</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Funcionário">
            <Select
              value={form.funcionario}
              onChange={(v) => setForm({ ...form, funcionario: v })}
              options={[{ value: '', label: 'Selecione...' }, ...lista.filter((f) => f.status !== 'Demitido').map((f) => ({ value: f.id, label: `${f.nome} — ${f.empresa}` }))]}
              className="w-full"
            />
          </Field>
          <Field label="Motivo">
            <Select
              value={form.motivo}
              onChange={(v) => setForm({ ...form, motivo: v })}
              options={['Sem justa causa', 'Pedido de demissão', 'Justa causa', 'Acordo (art. 484-A)', 'Término de contrato']}
              className="w-full"
            />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
