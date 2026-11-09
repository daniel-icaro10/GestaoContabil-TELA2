import { useRef, useState } from 'react'
import { Card, Badge, Button, Chips, SearchInput, Table, Td, EmptyRow, Modal, InfoRow, PageTitle, Progress, Field, Input, Select, Textarea, type Tone } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { brl, matches, downloadFile } from '../../lib/utils'
import { notas as seed, clientes, type Nota } from './data'

type Filtro = 'todas' | 'NFS-e' | 'NF-e' | 'Autorizada' | 'Pendente'

const statusTone: Record<Nota['status'], Tone> = { Autorizada: 'green', Cancelada: 'red', Pendente: 'amber' }
const empresasPJ = clientes.filter((c) => c.tipo === 'PJ').map((c) => c.nome)

function xmlDe(n: Nota) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<${n.modelo === 'NFS-e' ? 'CompNfse' : 'nfeProc'}>
  <Numero>${n.numero.replace('#', '')}</Numero>
  <Prestador>${n.cliente}</Prestador>
  <Tomador>${n.tomador}</Tomador>
  <DataEmissao>${n.emissao}</DataEmissao>
  <ValorServicos>${n.valor.toFixed(2)}</ValorServicos>
  <Status>${n.status}</Status>
</${n.modelo === 'NFS-e' ? 'CompNfse' : 'nfeProc'}>
`
}

export default function NotasFiscais() {
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [lista, setLista] = useState<Nota[]>(seed)
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const [busca, setBusca] = useState('')
  const [ver, setVer] = useState<Nota | null>(null)
  const [emitir, setEmitir] = useState(false)
  const [form, setForm] = useState({ cliente: empresasPJ[0], tomador: '', valor: '', servico: '' })

  const filtrados = lista.filter(
    (n) =>
      (filtro === 'todas' || n.modelo === filtro || n.status === filtro) && matches(busca, n.numero, n.cliente, n.tomador),
  )

  const total = lista.filter((n) => n.status !== 'Cancelada').reduce((s, n) => s + n.valor, 0) + 205000
  const count = (s: Nota['status']) => lista.filter((n) => n.status === s).length

  function emitirNota() {
    if (!form.tomador || !Number(form.valor)) return toast('Informe tomador e valor', 'warning')
    const prox = Math.max(...lista.filter((n) => n.modelo === 'NFS-e').map((n) => Number(n.numero.replace('#', '')))) + 1
    const nova: Nota = {
      id: `n${Date.now()}`,
      numero: `#${prox}`,
      modelo: 'NFS-e',
      cliente: form.cliente,
      tomador: form.tomador,
      emissao: new Date().toLocaleDateString('pt-BR'),
      valor: Number(form.valor),
      tipo: 'Saída',
      status: 'Pendente',
    }
    setLista((l) => [nova, ...l])
    toast(`NFS-e ${nova.numero} enviada para autorização`)
    setEmitir(false)
    setForm({ cliente: empresasPJ[0], tomador: '', valor: '', servico: '' })
    setTimeout(() => {
      setLista((l) => l.map((n) => (n.id === nova.id ? { ...n, status: 'Autorizada' } : n)))
      toast(`NFS-e ${nova.numero} autorizada pela prefeitura`)
    }, 3000)
  }

  function importar(files: File[]) {
    if (!files.length) return
    const novas: Nota[] = files.map((f, i) => ({
      id: `imp${Date.now()}${i}`,
      numero: `#${4000 + Math.floor(Math.random() * 999)}`,
      modelo: 'NF-e',
      cliente: empresasPJ[i % empresasPJ.length],
      tomador: f.name.replace(/\.xml$/i, ''),
      emissao: new Date().toLocaleDateString('pt-BR'),
      valor: Math.round(Math.random() * 20000 + 500),
      tipo: 'Entrada',
      status: 'Autorizada',
    }))
    setLista((l) => [...novas, ...l])
    toast(`${files.length} XML(s) importado(s) com sucesso`)
  }

  return (
    <div className="space-y-5">
      <PageTitle
        title="Notas Fiscais"
        subtitle="Monitoramento consolidado de NFS-e e NF-e por cliente"
        actions={
          <>
            <Button variant="outline" onClick={() => setEmitir(true)}>
              Emitir NFS-e
            </Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              Importar XML
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".xml"
              multiple
              hidden
              onChange={(e) => {
                importar(Array.from(e.target.files ?? []))
                e.target.value = ''
              }}
            />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {[
          { label: 'Emitidas (mês)', value: lista.length + 42, color: 'bg-brand' },
          { label: 'Valor total', value: `R$ ${Math.round(total / 1000)}k`, color: 'bg-emerald-500' },
          { label: 'Autorizadas', value: count('Autorizada') + 40, color: 'bg-emerald-500' },
          { label: 'Pendentes', value: count('Pendente') + 2, color: 'bg-amber-600' },
          { label: 'Canceladas', value: count('Cancelada'), color: 'bg-red-600' },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-[11px] text-slate-500">{s.label}</p>
            <p className="num mt-2 text-[24px] text-ink">{s.value}</p>
            <Progress value={70} color={s.color} className="mt-3" />
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Chips
          value={filtro}
          onChange={setFiltro}
          options={[
            { value: 'todas', label: 'Todas' },
            { value: 'NFS-e', label: 'NFS-e' },
            { value: 'NF-e', label: 'NF-e' },
            { value: 'Autorizada', label: 'Autorizadas' },
            { value: 'Pendente', label: 'Pendentes' },
          ]}
        />
        <SearchInput value={busca} onChange={setBusca} placeholder="Buscar nota, cliente ou tomador..." className="min-w-56 flex-1" />
      </div>

      <Card className="overflow-hidden">
        <Table head={['Nota', 'Cliente', 'Tomador', 'Emissão', 'Valor', 'Tipo', 'Status', 'Ações']}>
          {filtrados.length === 0 && <EmptyRow cols={8} />}
          {filtrados.map((n) => (
            <tr key={n.id} className="hover:bg-slate-50/60">
              <Td>
                <button onClick={() => setVer(n)} className="num cursor-pointer rounded-md bg-brand/5 px-2 py-1 text-xs text-brand hover:bg-brand/10">
                  {n.modelo} {n.numero}
                </button>
              </Td>
              <Td className="font-bold text-ink">{n.cliente}</Td>
              <Td>{n.tomador}</Td>
              <Td className="num text-xs text-slate-400">{n.emissao}</Td>
              <Td className="num font-medium text-ink">{brl(n.valor)}</Td>
              <Td>
                <Badge tone={n.tipo === 'Saída' ? 'amber' : 'sky'}>{n.tipo}</Badge>
              </Td>
              <Td>
                <Badge tone={statusTone[n.status]}>{n.status}</Badge>
              </Td>
              <Td right>
                <div className="flex justify-end gap-1.5">
                  <Button size="sm" variant="soft" onClick={() => downloadFile(`${n.modelo}_${n.numero.replace('#', '')}.xml`, xmlDe(n), 'application/xml')}>
                    XML
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => downloadFile(`${n.modelo}_${n.numero.replace('#', '')}.pdf`)}>
                    PDF
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      <Modal
        open={!!ver}
        onClose={() => setVer(null)}
        title={`${ver?.modelo} ${ver?.numero}`}
        subtitle={ver?.cliente}
        footer={
          <>
            {ver && ver.status !== 'Cancelada' && (
              <Button
                variant="dangerOutline"
                className="mr-auto"
                onClick={() => {
                  setLista((l) => l.map((x) => (x.id === ver.id ? { ...x, status: 'Cancelada' } : x)))
                  toast(`${ver.modelo} ${ver.numero} cancelada`, 'info')
                  setVer(null)
                }}
              >
                Cancelar nota
              </Button>
            )}
            <Button variant="secondary" onClick={() => setVer(null)}>Fechar</Button>
            <Button onClick={() => ver && downloadFile(`${ver.modelo}_${ver.numero.replace('#', '')}.pdf`)}>Baixar DANFE/PDF</Button>
          </>
        }
      >
        {ver && (
          <>
            <InfoRow label="Prestador" value={ver.cliente} />
            <InfoRow label="Tomador" value={ver.tomador} />
            <InfoRow label="Emissão" value={ver.emissao} />
            <InfoRow label="Valor" value={brl(ver.valor)} />
            <InfoRow label="ISS estimado (5%)" value={brl(ver.valor * 0.05)} />
            <InfoRow label="Tipo" value={ver.tipo} />
            <InfoRow label="Status" value={<Badge tone={statusTone[ver.status]}>{ver.status}</Badge>} />
          </>
        )}
      </Modal>

      <Modal
        open={emitir}
        onClose={() => setEmitir(false)}
        title="Emitir NFS-e"
        subtitle="Emissão em nome do cliente via webservice municipal"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEmitir(false)}>Cancelar</Button>
            <Button onClick={emitirNota}>Emitir nota</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Cliente (prestador)">
            <Select value={form.cliente} onChange={(v) => setForm({ ...form, cliente: v })} options={empresasPJ} className="w-full" />
          </Field>
          <Field label="Tomador">
            <Input value={form.tomador} onChange={(e) => setForm({ ...form, tomador: e.target.value })} placeholder="Razão social do tomador" />
          </Field>
          <Field label="Valor do serviço (R$)">
            <Input type="number" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} />
          </Field>
          <Field label="Descrição do serviço">
            <Textarea value={form.servico} onChange={(e) => setForm({ ...form, servico: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
