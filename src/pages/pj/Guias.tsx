import { useState } from 'react'
import { CheckCircle2, Copy, Download, FileDown } from 'lucide-react'
import { Badge, Banner, Button, Card, CodeTag, StatCard, Table, Tabs, Td, EmptyRow } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { brl, copyText, downloadFile } from '../../lib/utils'
import { guias as initial, PIX_CODE } from './data'

type Tab = 'todas' | 'pendentes' | 'pagas' | 'folha'

export default function Guias() {
  const toast = useToast()
  const [rows] = useState(initial)
  const [tab, setTab] = useState<Tab>('todas')
  const [banner, setBanner] = useState(true)

  const pend = rows.filter((g) => g.status === 'pendente')
  const pagas = rows.filter((g) => g.status === 'pago')
  const folha = rows.filter((g) => g.folha)
  const total = rows.filter((g) => g.comp === '09/2024').reduce((s, g) => s + g.valor, 0)
  const filtered = tab === 'todas' ? rows : tab === 'pendentes' ? pend : tab === 'pagas' ? pagas : folha

  return (
    <div className="space-y-5">
      {banner && (
        <Banner
          tone="green"
          icon={<CheckCircle2 size={18} />}
          title="Situação Fiscal 100% Regular perante a Receita Federal"
          text="Certidão Negativa de Débitos (CND Federal) emitida e válida até 14/12/2024."
          action={
            <Button size="sm" onClick={() => { downloadFile('CND_Federal_Tech_Founders.pdf'); toast('CND atualizada baixada!') }}>
              Baixar CND Atualizada
            </Button>
          }
          onClose={() => setBanner(false)}
        />
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Apurado (Setembro)" value={brl(total)} sub={`${rows.filter((g) => g.comp === '09/2024').length} obrigações no mês`} />
        <StatCard
          label="Total Pendente"
          value={brl(pend.reduce((s, g) => s + g.valor, 0))}
          valueClass="text-amber-600"
          badge={pend.length > 0 ? <Badge tone="amber">{pend.length} a vencer</Badge> : undefined}
          sub={pend.length ? `DAS Simples vence dia 20/10` : 'Nenhuma guia pendente'}
        />
        <StatCard
          label="Total Liquidado"
          value={brl(pagas.reduce((s, g) => s + g.valor, 0))}
          valueClass="text-emerald-600"
          badge={<Badge tone="green">{pagas.length} pagas</Badge>}
          sub="Comprovantes arquivados"
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-3 px-5 pt-4">
          <Tabs
            className="border-0"
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'todas', label: `Todas (${rows.length})` },
              { value: 'pendentes', label: `Pendentes (${pend.length})` },
              { value: 'pagas', label: `Pagas (${pagas.length})` },
              { value: 'folha', label: `Folha de Pagamento (${folha.length})` },
            ]}
          />
          <Button
            variant="soft"
            size="sm"
            icon={<FileDown size={14} />}
            className="mb-2"
            onClick={() => {
              downloadFile('Pacote_Guias_09-2024.zip', 'Pacote de guias e comprovantes - 09/2024', 'application/zip')
              toast('Pacote do mês gerado (.ZIP)')
            }}
          >
            Baixar Pacote do Mês (.ZIP)
          </Button>
        </div>
        <Table head={['Obrigação Fiscal', 'Competência', 'Vencimento', 'Valor', 'Status', 'Ações']}>
          {filtered.length === 0 && <EmptyRow cols={6} />}
          {filtered.map((g) => (
            <tr key={g.id} className="hover:bg-slate-50/50">
              <Td>
                <div className="flex items-center gap-2.5">
                  <CodeTag tone={g.codeTone}>{g.code}</CodeTag>
                  <span className="font-semibold text-ink">{g.name}</span>
                </div>
              </Td>
              <Td>{g.comp}</Td>
              <Td className="num text-ink">{g.venc}</Td>
              <Td className="num font-medium text-ink">{brl(g.valor)}</Td>
              <Td>
                {g.status === 'pendente' ? (
                  <Badge tone="amber" dot>Aguardando Pagamento</Badge>
                ) : (
                  <Badge tone="green"><CheckCircle2 size={11} /> Pago &amp; Baixado</Badge>
                )}
              </Td>
              <Td right>
                {g.status === 'pendente' ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Copy size={13} />}
                      onClick={async () => {
                        await copyText(PIX_CODE)
                        toast('Código PIX copiado para a área de transferência!')
                      }}
                    >
                      Copiar PIX
                    </Button>
                    <Button size="sm" onClick={() => { downloadFile(`${g.code}_${g.comp.replace('/', '-')}.pdf`); toast('Guia PDF baixada') }}>
                      Baixar Guia PDF
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Download size={13} />}
                    onClick={() => { downloadFile(`Comprovante_${g.code}_${g.comp.replace('/', '-')}.pdf`); toast('Comprovante baixado') }}
                  >
                    Comprovante
                  </Button>
                )}
              </Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
