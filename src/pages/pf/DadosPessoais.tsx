import { useState } from 'react'
import { Badge, Button, Card, Field, Modal, PageTitle, ReadField, Select, Textarea } from '../../components/ui'
import { useToast } from '../../components/Toast'

const secoes = {
  Identificação: [
    ['Nome completo', 'Maria Aparecida Souza', 'full'],
    ['CPF', '987.654.321-00'],
    ['RG', '12.345.678-9 SSP/SP'],
    ['Data de nascimento', '15/07/1985'],
    ['Profissão', 'Arquiteta'],
    ['Estado civil', 'Casada'],
  ],
  Contato: [
    ['E-mail', 'maria.souza@email.com'],
    ['Celular / WhatsApp', '(11) 98765-4321'],
    ['Telefone fixo', '(11) 3456-7890'],
  ],
  Endereço: [
    ['Logradouro', 'Rua Haddock Lobo, 595 — Apto 82', 'full'],
    ['Bairro', 'Cerqueira César'],
    ['Cidade / UF', 'São Paulo / SP'],
    ['CEP', '01414-001'],
    ['País', 'Brasil'],
  ],
  'Dados Bancários (Restituição)': [
    ['Banco', '077 — Banco Inter S.A.'],
    ['Tipo de conta', 'Conta corrente'],
    ['Agência', '0001'],
    ['Conta', '1234567-8'],
    ['Chave PIX (CPF)', '987.654.321-00', 'full'],
  ],
} as Record<string, string[][]>

const numericos = new Set(['CPF', 'RG', 'Data de nascimento', 'Celular / WhatsApp', 'Telefone fixo', 'CEP', 'Agência', 'Conta', 'Chave PIX (CPF)'])

export default function DadosPessoais() {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [campo, setCampo] = useState('Endereço')
  const [desc, setDesc] = useState('')
  const [pendente, setPendente] = useState<string | null>(null)

  return (
    <div className="max-w-[820px] space-y-5">
      <PageTitle
        title="Dados Pessoais"
        subtitle="Informações cadastrais"
        actions={
          <Button variant="outline" onClick={() => setOpen(true)}>
            Solicitar alteração
          </Button>
        }
      />

      {pendente && (
        <Card className="flex items-center justify-between gap-3 border-amber-200 bg-amber-50 px-5 py-3">
          <p className="text-[13px] text-amber-800">
            Alteração de <b>{pendente}</b> enviada para análise do escritório.
          </p>
          <Badge tone="amber">Em análise</Badge>
        </Card>
      )}

      <Card className="flex items-center gap-4 p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-brand text-lg font-bold text-white">
          MS
        </div>
        <div>
          <p className="text-[16px] font-bold">Maria Souza</p>
          <p className="text-xs text-muted">Cliente Pessoa Física · Ativa desde Jan/2023</p>
        </div>
      </Card>

      {Object.entries(secoes).map(([titulo, campos]) => (
        <Card key={titulo} className="p-5">
          <h3 className="mb-4 text-[15px] font-bold">{titulo}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {campos.map(([label, value, full]) => (
              <ReadField
                key={label}
                label={label}
                value={<span className={numericos.has(label) ? 'num' : ''}>{value}</span>}
                className={full ? 'sm:col-span-2' : ''}
              />
            ))}
          </div>
        </Card>
      ))}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Solicitar alteração cadastral"
        subtitle="A alteração será validada pelo seu contador"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!desc.trim()}
              onClick={() => {
                setPendente(campo)
                setOpen(false)
                setDesc('')
                toast('Solicitação de alteração enviada')
              }}
            >
              Enviar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="O que deseja alterar?">
            <Select className="w-full" value={campo} onChange={setCampo} options={Object.keys(secoes)} />
          </Field>
          <Field label="Novos dados">
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Informe os dados corretos..." />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
