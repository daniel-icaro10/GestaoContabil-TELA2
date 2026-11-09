import { useState } from 'react'
import { CheckCircle2, Circle, Upload } from 'lucide-react'
import { Badge, Button, Card, Field, InfoRow, Input, Modal, PageTitle, Select, Tabs, Textarea, Progress } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { brl, downloadFile, cn } from '../../lib/utils'
import { declaracoes, documentosNecessarios } from './data'
import { UploadModal } from './shared'

export default function ImpostoRenda() {
  const toast = useToast()
  const [tab, setTab] = useState<'historico' | 'docs'>('historico')
  const [restituicao, setRestituicao] = useState(false)
  const [solicitar, setSolicitar] = useState(false)
  const [upload, setUpload] = useState(false)
  const [docs, setDocs] = useState(documentosNecessarios)
  const [pedido, setPedido] = useState<string | null>(null)
  const [ano, setAno] = useState('IRPF 2025 (ano-base 2024)')
  const [obs, setObs] = useState('')
  const atual = declaracoes[0]

  const baixarRecibo = (a: number) => downloadFile(`Recibo_IRPF_${a}.pdf`)

  return (
    <div className="max-w-[900px] space-y-5">
      <PageTitle
        title="Imposto de Renda"
        subtitle="IRPF — Declarações e acompanhamento"
        actions={
          <Button size="lg" onClick={() => setSolicitar(true)}>
            Solicitar declaração
          </Button>
        }
      />

      {pedido && (
        <Card className="flex items-center justify-between gap-3 border-amber-200 bg-amber-50 px-5 py-3">
          <p className="text-[13px] text-amber-800">
            <b>{pedido}</b> solicitada — seu contador entrará em contato com a lista de documentos.
          </p>
          <Badge tone="amber">Em análise</Badge>
        </Card>
      )}

      <Card className="border-brand/15 bg-gradient-to-r from-brand/5 to-violet-50/60 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[13px] font-semibold text-slate-600">
              Declaração IRPF {atual.ano} (ano-base {atual.base})
            </p>
            <div className="mt-1.5 flex items-center gap-3">
              <Badge tone="green">✓ Enviada</Badge>
              <span className="num text-[13px] text-muted">{atual.enviado}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => baixarRecibo(atual.ano)}>
              Baixar recibo
            </Button>
            <Button variant="secondary" onClick={() => setRestituicao(true)}>
              Consultar restituição
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-10">
          <div>
            <p className="text-[11px] text-muted">Resultado</p>
            <p className="mt-1 text-[15px] font-bold text-emerald-700">Restituição</p>
          </div>
          <div>
            <p className="text-[11px] text-muted">Valor</p>
            <p className="num mt-1 text-xl text-ink">{brl(atual.valor)}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted">Recibo</p>
            <p className="num mt-1 text-[13px] text-slate-400">1000...0000</p>
          </div>
        </div>
      </Card>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'historico', label: 'Histórico' },
          { value: 'docs', label: 'Documentos necessários' },
        ]}
      />

      {tab === 'historico' ? (
        <div className="space-y-3">
          {declaracoes.map((d) => (
            <Card key={d.ano} className="flex flex-wrap items-center gap-4 p-4">
              <div className="num flex h-12 w-12 items-center justify-center rounded-xl bg-brand/5 text-[13px] text-brand">{d.ano}</div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-ink">
                  IRPF {d.ano} · Ano-base {d.base}
                </p>
                <p className="text-xs text-muted">
                  Enviado em <span className="num">{d.enviado}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted">{d.resultadoLabel}</p>
                <p className="num text-[15px] text-ink">{brl(d.valor)}</p>
              </div>
              <Badge tone="green">{d.status}</Badge>
              <Button variant="outline" size="sm" onClick={() => baixarRecibo(d.ano)}>
                Baixar
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[13px] font-bold">Checklist IRPF 2025</p>
              <p className="text-xs text-muted">
                {docs.filter((d) => d.ok).length} de {docs.length} documentos enviados
              </p>
            </div>
            <Button variant="soft" size="sm" icon={<Upload size={13} />} onClick={() => setUpload(true)}>
              Enviar documentos
            </Button>
          </div>
          <Progress value={(docs.filter((d) => d.ok).length / docs.length) * 100} className="mb-4" />
          <div className="divide-y divide-line">
            {docs.map((d, i) => (
              <div key={d.nome} className="flex items-center gap-3 py-3">
                {d.ok ? <CheckCircle2 size={17} className="text-emerald-500" /> : <Circle size={17} className="text-slate-300" />}
                <span className={cn('flex-1 text-[13px]', d.ok ? 'text-slate-500' : 'text-ink')}>{d.nome}</span>
                {d.ok ? (
                  <Badge tone="green">Enviado</Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDocs((all) => all.map((x, j) => (j === i ? { ...x, ok: true } : x)))
                      toast(`"${d.nome}" marcado como enviado`)
                    }}
                  >
                    Enviar
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal
        open={restituicao}
        onClose={() => setRestituicao(false)}
        title="Consulta de restituição"
        subtitle="IRPF 2024 · Ano-base 2023"
        footer={<Button onClick={() => setRestituicao(false)}>Fechar</Button>}
      >
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="text-emerald-600" />
          <div>
            <p className="text-[13px] font-bold text-emerald-800">Restituição creditada</p>
            <p className="text-xs text-emerald-700">Incluída no 2º lote de restituição (28/06/2024)</p>
          </div>
        </div>
        <InfoRow label="Valor restituído" value={<span className="num">{brl(1240)}</span>} />
        <InfoRow label="Correção Selic" value={<span className="num">{brl(18.6)}</span>} />
        <InfoRow label="Banco" value="Banco Inter · Ag 0001 · CC 1234567-8" />
        <InfoRow label="Data do crédito" value="28/06/2024" />
        <InfoRow label="Situação na Receita" value={<Badge tone="green">Processada</Badge>} />
      </Modal>

      <Modal
        open={solicitar}
        onClose={() => setSolicitar(false)}
        title="Solicitar declaração"
        subtitle="Seu contador iniciará a preparação da declaração"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSolicitar(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setPedido(ano)
                setSolicitar(false)
                setObs('')
                toast('Solicitação de declaração enviada ao contador')
              }}
            >
              Enviar solicitação
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Exercício">
            <Select
              className="w-full"
              value={ano}
              onChange={setAno}
              options={['IRPF 2025 (ano-base 2024)', 'Declaração retificadora IRPF 2024', 'Declaração em atraso']}
            />
          </Field>
          <Field label="Telefone para contato">
            <Input defaultValue="(11) 98765-4321" />
          </Field>
          <Field label="Observações">
            <Textarea value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Ex.: vendi um imóvel em 2024..." />
          </Field>
        </div>
      </Modal>

      <UploadModal
        open={upload}
        onClose={() => setUpload(false)}
        onUpload={(files) => toast(`${files.length} documento(s) enviado(s) para a declaração`)}
      />
    </div>
  )
}
