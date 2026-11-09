import { useState } from 'react'
import { Download } from 'lucide-react'
import { Badge, Button, Card, PageTitle, ReadField } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { downloadFile } from '../../lib/utils'
import { RequestModal } from './RequestModal'

function Section({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[14px] font-bold">{title}</h3>
        {right}
      </div>
      <div className="grid gap-x-3 gap-y-4 sm:grid-cols-2">{children}</div>
    </Card>
  )
}

export default function DadosEmpresa() {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [pendente, setPendente] = useState<string | null>(null)

  return (
    <div className="max-w-[680px] space-y-4">
      <PageTitle
        title="Dados da Empresa"
        subtitle="Cadastro e informações fiscais"
        actions={
          <>
            <Button variant="secondary" icon={<Download size={14} />} onClick={() => { downloadFile('Cartao_CNPJ_Tech_Founders.pdf'); toast('Cartão CNPJ baixado') }}>
              Cartão CNPJ
            </Button>
            <Button variant="outline" onClick={() => setOpen(true)}>Solicitar alteração</Button>
          </>
        }
      />

      {pendente && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-800">
          Alteração <b>{pendente}</b> em análise pelo escritório. Os dados serão atualizados após a conclusão.
        </div>
      )}

      <Section title="Identificação" right={<Badge tone="green">Ativa</Badge>}>
        <ReadField className="sm:col-span-2" label="Razão Social" value="Tech Founders Ltda" />
        <ReadField className="sm:col-span-2" label="Nome Fantasia" value="Tech Founders" />
        <ReadField label="CNPJ" value={<span className="num">12.345.678/0001-90</span>} />
        <ReadField label="Data de Abertura" value={<span className="num">15/01/2022</span>} />
        <ReadField label="Inscrição Estadual" value={<span className="num">123.456.789.012</span>} />
        <ReadField label="Inscrição Municipal" value={<span className="num">98765432</span>} />
      </Section>

      <Section title="Regime Tributário & Atividade">
        <ReadField label="Regime Tributário" value="Simples Nacional" />
        <ReadField label="Natureza Jurídica" value="Sociedade Limitada (Ltda)" />
        <ReadField className="sm:col-span-2" label="CNAE Principal" value="6204-0/00 — Consultoria em TI" />
        <ReadField className="sm:col-span-2" label="CNAE Secundário" value="6209-1/00 — Suporte em TI" />
      </Section>

      <Section title="Endereço">
        <ReadField className="sm:col-span-2" label="Logradouro" value="Av. Paulista, 1000 — Sala 501" />
        <ReadField label="Bairro" value="Bela Vista" />
        <ReadField label="Cidade / UF" value="São Paulo / SP" />
        <ReadField label="CEP" value={<span className="num">01310-100</span>} />
        <ReadField label="País" value="Brasil" />
      </Section>

      <Section title="Contato">
        <ReadField label="E-mail" value="financeiro@techfounders.com.br" />
        <ReadField label="Telefone" value={<span className="num">(11) 3456-7890</span>} />
        <ReadField label="Responsável" value="João da Silva" />
        <ReadField label="Capital Social" value={<span className="num">R$ 100.000,00</span>} />
      </Section>

      <RequestModal
        open={open}
        onClose={() => setOpen(false)}
        title="Solicitar alteração cadastral"
        subtitle="Tech Founders Ltda · CNPJ 12.345.678/0001-90"
        types={['Endereço', 'Nome fantasia', 'CNAE / Atividade', 'Regime tributário', 'Contato', 'Outro']}
        onSubmit={(d) => setPendente(`${d.protocolo} (${d.tipo})`)}
      />
    </div>
  )
}
