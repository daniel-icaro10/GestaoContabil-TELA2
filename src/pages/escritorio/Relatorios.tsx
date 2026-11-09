import { useState } from 'react'
import { FileText, CalendarClock, Trash2 } from 'lucide-react'
import { Button, Card, Chips, Field, Input, Modal, PageTitle, Select } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { cn, downloadCsv, downloadFile } from '../../lib/utils'
import { relatorioGrupos, type Relatorio } from './data2'

type Periodo = 'out' | 'set' | 'tri' | 'custom'
const periodoLabel: Record<Periodo, string> = { out: 'Outubro 2024', set: 'Setembro 2024', tri: '3º Trimestre', custom: 'Personalizado' }

type Agendamento = { relatorio: string; frequencia: string; formato: string; email: string }

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w]+/g, '_')
    .replace(/_+$/, '')
    .toLowerCase()

export default function Relatorios() {
  const toast = useToast()
  const [periodo, setPeriodo] = useState<Periodo>('out')
  const [custom, setCustom] = useState({ de: '2024-10-01', ate: '2024-10-31' })
  const [customOpen, setCustomOpen] = useState(false)
  const [gerar, setGerar] = useState<Relatorio | null>(null)
  const [formato, setFormato] = useState<'PDF' | 'XLSX'>('PDF')
  const [agendar, setAgendar] = useState<Relatorio | null>(null)
  const [ag, setAg] = useState({ frequencia: 'Mensal (dia 1)', formato: 'PDF', email: 'carlos@contadorcentral.com.br' })
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])

  const periodoTxt =
    periodo === 'custom'
      ? `${new Date(custom.de + 'T00:00').toLocaleDateString('pt-BR')} a ${new Date(custom.ate + 'T00:00').toLocaleDateString('pt-BR')}`
      : periodoLabel[periodo]

  const doGerar = (r: Relatorio, f: 'PDF' | 'XLSX') => {
    const base = `${slug(r.nome)}_${slug(periodoTxt)}`
    if (f === 'XLSX') {
      downloadCsv(`${base}.csv`, [
        { Relatorio: r.nome, Periodo: periodoTxt, Cliente: 'Alfa Contabilidade', Valor: '1.248,90' },
        { Relatorio: r.nome, Periodo: periodoTxt, Cliente: 'Beta Assessoria', Valor: '3.720,00' },
        { Relatorio: r.nome, Periodo: periodoTxt, Cliente: 'Gama Fiscal', Valor: '4.130,00' },
      ])
    } else {
      downloadFile(`${base}.pdf`, `${r.nome}\n${r.desc}\nPeríodo: ${periodoTxt}\n\nRelatório gerado pelo HUBContábil.`)
    }
    toast(`"${r.nome}" gerado em ${f}`)
  }

  return (
    <div className="max-w-[760px] space-y-5">
      <PageTitle title="Relatórios" subtitle="Exportações e análises gerenciais" />

      <Card className="flex flex-wrap items-center gap-3 p-5">
        <span className="text-[13px] font-semibold text-slate-600">Período:</span>
        <Chips
          value={periodo}
          onChange={(v) => {
            setPeriodo(v)
            if (v === 'custom') setCustomOpen(true)
          }}
          options={(Object.keys(periodoLabel) as Periodo[]).map((p) => ({ value: p, label: periodoLabel[p] }))}
        />
        {periodo === 'custom' && (
          <button onClick={() => setCustomOpen(true)} className="cursor-pointer text-xs text-brand hover:underline">
            {periodoTxt}
          </button>
        )}
      </Card>

      {relatorioGrupos.map((g) => (
        <div key={g.titulo} className="space-y-2.5">
          <p className="pt-2 text-[11px] font-semibold tracking-[0.15em] text-muted">{g.titulo}</p>
          {g.itens.map((r) => (
            <Card key={r.nome} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                <FileText size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-ink">{r.nome}</p>
                <p className="text-[11px] text-muted">{r.desc}</p>
              </div>
              <div className="flex gap-1">
                {r.formatos.map((f) => (
                  <span
                    key={f}
                    className={cn(
                      'rounded px-1.5 py-0.5 text-[10px] font-bold',
                      f === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600',
                    )}
                  >
                    {f}
                  </span>
                ))}
              </div>
              <Button
                size="sm"
                variant="soft"
                onClick={() => {
                  if (r.formatos.length === 1) doGerar(r, r.formatos[0])
                  else {
                    setFormato(r.formatos[0])
                    setGerar(r)
                  }
                }}
              >
                Gerar
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setAgendar(r)}>
                Agendar
              </Button>
            </Card>
          ))}
        </div>
      ))}

      {agendamentos.length > 0 && (
        <div className="space-y-2.5">
          <p className="pt-2 text-[11px] font-semibold tracking-[0.15em] text-muted">ENVIOS AGENDADOS</p>
          <Card className="divide-y divide-line">
            {agendamentos.map((a, i) => (
              <div key={i} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <CalendarClock size={16} className="text-brand" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-ink">{a.relatorio}</p>
                  <p className="text-[11px] text-muted">
                    {a.frequencia} · {a.formato} · {a.email}
                  </p>
                </div>
                <button
                  title="Remover agendamento"
                  onClick={() => {
                    setAgendamentos((all) => all.filter((_, j) => j !== i))
                    toast('Agendamento removido', 'info')
                  }}
                  className="cursor-pointer text-slate-400 hover:text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Período personalizado */}
      <Modal
        open={customOpen}
        onClose={() => setCustomOpen(false)}
        title="Período personalizado"
        footer={<Button onClick={() => setCustomOpen(false)}>Aplicar</Button>}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="De">
            <Input type="date" value={custom.de} onChange={(e) => setCustom((c) => ({ ...c, de: e.target.value }))} />
          </Field>
          <Field label="Até">
            <Input type="date" value={custom.ate} onChange={(e) => setCustom((c) => ({ ...c, ate: e.target.value }))} />
          </Field>
        </div>
      </Modal>

      {/* Gerar com escolha de formato */}
      <Modal
        open={!!gerar}
        onClose={() => setGerar(null)}
        title={gerar ? `Gerar ${gerar.nome}` : ''}
        subtitle={`Período: ${periodoTxt}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setGerar(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (gerar) doGerar(gerar, formato)
                setGerar(null)
              }}
            >
              Gerar relatório
            </Button>
          </>
        }
      >
        <Field label="Formato">
          <Chips
            value={formato}
            onChange={setFormato}
            options={(gerar?.formatos ?? []).map((f) => ({ value: f, label: f }))}
          />
        </Field>
      </Modal>

      {/* Agendar */}
      <Modal
        open={!!agendar}
        onClose={() => setAgendar(null)}
        title={agendar ? `Agendar ${agendar.nome}` : ''}
        subtitle="O relatório será gerado e enviado automaticamente por e-mail"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAgendar(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (!agendar) return
                setAgendamentos((all) => [...all, { relatorio: agendar.nome, ...ag }])
                toast(`"${agendar.nome}" agendado — ${ag.frequencia}`)
                setAgendar(null)
              }}
            >
              Salvar agendamento
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Frequência">
            <Select
              value={ag.frequencia}
              onChange={(v) => setAg((a) => ({ ...a, frequencia: v }))}
              options={['Diário', 'Semanal (segunda-feira)', 'Mensal (dia 1)', 'Trimestral']}
              className="w-full"
            />
          </Field>
          <Field label="Formato">
            <Select value={ag.formato} onChange={(v) => setAg((a) => ({ ...a, formato: v }))} options={agendar?.formatos ?? ['PDF']} className="w-full" />
          </Field>
          <Field label="Enviar para (e-mail)">
            <Input value={ag.email} onChange={(e) => setAg((a) => ({ ...a, email: e.target.value }))} />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
