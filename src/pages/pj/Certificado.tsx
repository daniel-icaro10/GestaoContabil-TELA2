import { useState } from 'react'
import { Shield, ShieldCheck } from 'lucide-react'
import { Badge, Button, Card, PageTitle, Progress, Tabs, Modal, Field, Select, Banner } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { downloadFile } from '../../lib/utils'

type Cert = {
  id: string
  tipo: string
  titular: string
  doc: string
  ac: string
  validade: string
  resp: string
  dias: number
  total: number
  status: 'ativo' | 'renovacao' | 'expirado'
}

const ativosIniciais: Cert[] = [
  { id: 'c1', tipo: 'e-CNPJ A1', titular: 'Tech Founders Ltda', doc: '12.345.678/0001-90', ac: 'Serasa Experian', validade: '18/11/2024', resp: 'João da Silva', dias: 33, total: 365, status: 'ativo' },
  { id: 'c2', tipo: 'e-CPF A1', titular: 'João da Silva', doc: '123.456.789-00', ac: 'Certisign', validade: '05/03/2026', resp: 'João da Silva', dias: 530, total: 545, status: 'ativo' },
]

const historico: Cert[] = [
  { id: 'h1', tipo: 'e-CNPJ A1', titular: 'Tech Founders Ltda', doc: '12.345.678/0001-90', ac: 'Serasa Experian', validade: '18/11/2023', resp: 'João da Silva', dias: 0, total: 365, status: 'expirado' },
  { id: 'h2', tipo: 'e-CNPJ A1', titular: 'Tech Founders Ltda', doc: '12.345.678/0001-90', ac: 'Valid Certificadora', validade: '15/01/2023', resp: 'João da Silva', dias: 0, total: 365, status: 'expirado' },
]

export default function Certificado() {
  const toast = useToast()
  const [tab, setTab] = useState<'ativos' | 'historico'>('ativos')
  const [certs, setCerts] = useState(ativosIniciais)
  const [renew, setRenew] = useState<Cert | null | 'novo'>(null)
  const [tipo, setTipo] = useState('e-CNPJ A1')
  const [banner, setBanner] = useState(true)

  const confirmRenew = () => {
    if (renew && renew !== 'novo') {
      setCerts((cs) => cs.map((c) => (c.id === renew.id ? { ...c, status: 'renovacao' } : c)))
      toast(`Renovação do ${renew.tipo} solicitada. A AC entrará em contato para validação.`)
    } else {
      toast(`Solicitação de novo certificado ${tipo} enviada ao escritório`)
    }
    setRenew(null)
  }

  const list = tab === 'ativos' ? certs : historico

  return (
    <div className="max-w-[680px] space-y-4">
      <PageTitle
        title="Certificado Digital"
        subtitle="Gestão dos certificados ICP-Brasil"
        actions={<Button onClick={() => setRenew('novo')}>Renovar / Solicitar</Button>}
      />

      {banner && certs[0].status === 'ativo' && (
        <Banner
          tone="amber"
          icon={<Shield size={18} />}
          title={<>e-CNPJ A1 — Vence em <span className="num">33 dias</span></>}
          text="Validade: 18/11/2024 · Renove para evitar bloqueio nos sistemas fiscais."
          action={<Button variant="warning" size="sm" onClick={() => setRenew(certs[0])}>Renovar agora</Button>}
        />
      )}

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'ativos', label: 'Ativos' },
          { value: 'historico', label: 'Histórico' },
        ]}
      />

      {list.map((c) => {
        const pct = (c.dias / c.total) * 100
        const low = c.dias < 60
        return (
          <Card key={c.id} className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                <ShieldCheck size={19} />
              </div>
              <div className="flex-1">
                <p className="num text-[17px] text-ink">{c.tipo}</p>
                <p className="text-[11px] text-muted">{c.titular}</p>
              </div>
              {c.status === 'ativo' && <Badge tone={low ? 'blue' : 'green'}>Ativo</Badge>}
              {c.status === 'renovacao' && <Badge tone="amber" dot>Renovação solicitada</Badge>}
              {c.status === 'expirado' && <Badge tone="gray">Expirado</Badge>}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-y-3 text-[12px]">
              <div>
                <p className="text-[10px] text-muted">CNPJ / CPF</p>
                <p className="num text-ink">{c.doc}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted">Autoridade Certificadora</p>
                <p className="font-semibold text-ink">{c.ac}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted">Validade</p>
                <p className="num text-ink">{c.validade}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted">Responsável</p>
                <p className="font-semibold text-ink">{c.resp}</p>
              </div>
            </div>
            {tab === 'ativos' && (
              <>
                <div className="mt-4 flex justify-between text-[10px]">
                  <span className="text-muted">Validade restante</span>
                  <span className={low ? 'num text-brand' : 'num text-emerald-600'}>{c.dias} dias</span>
                </div>
                <Progress value={pct} color={low ? 'bg-brand' : 'bg-emerald-500'} className="mt-1" />
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-4">
                  <Button variant="secondary" onClick={() => { downloadFile(`${c.tipo.replace(' ', '_')}_${c.titular.replace(/ /g, '_')}.pfx`, 'certificado-demo', 'application/x-pkcs12'); toast('Certificado baixado (.pfx)') }}>
                    Baixar certificado
                  </Button>
                  <Button variant="soft" disabled={c.status === 'renovacao'} onClick={() => setRenew(c)}>
                    {c.status === 'renovacao' ? 'Renovação em andamento' : 'Solicitar renovação'}
                  </Button>
                </div>
              </>
            )}
          </Card>
        )
      })}

      <Modal
        open={!!renew}
        onClose={() => setRenew(null)}
        title={renew && renew !== 'novo' ? `Renovar ${renew.tipo}` : 'Renovar / Solicitar certificado'}
        subtitle="Emissão online por videoconferência em até 5 minutos"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRenew(null)}>Cancelar</Button>
            <Button onClick={confirmRenew}>Confirmar solicitação</Button>
          </>
        }
      >
        <div className="space-y-4">
          {renew === 'novo' && (
            <Field label="Tipo de certificado">
              <Select value={tipo} onChange={setTipo} options={['e-CNPJ A1', 'e-CNPJ A3', 'e-CPF A1', 'e-CPF A3']} className="w-full" />
            </Field>
          )}
          <div className="rounded-xl bg-slate-50 p-4 text-[12px] text-slate-600">
            <p className="font-semibold text-ink">Valor com condição exclusiva: R$ 189,00</p>
            <p className="mt-1">Após a confirmação, você receberá um link para validação por videoconferência com a Autoridade Certificadora.</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
