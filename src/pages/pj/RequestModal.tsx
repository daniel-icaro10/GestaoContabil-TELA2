import { useEffect, useState } from 'react'
import { Button, Field, Input, Modal, Select, Textarea } from '../../components/ui'
import { useToast } from '../../components/Toast'

/** Formulário genérico de solicitação ao escritório. Retorna o protocolo gerado. */
export function RequestModal({
  open,
  onClose,
  title,
  subtitle,
  types,
  defaultSubject = '',
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  types?: string[]
  defaultSubject?: string
  onSubmit?: (data: { tipo: string; assunto: string; descricao: string; protocolo: string }) => void
}) {
  const toast = useToast()
  const [tipo, setTipo] = useState(types?.[0] ?? '')
  const [assunto, setAssunto] = useState(defaultSubject)
  const [descricao, setDescricao] = useState('')

  useEffect(() => {
    if (open) {
      setTipo(types?.[0] ?? '')
      setAssunto(defaultSubject)
      setDescricao('')
    }
  }, [open, defaultSubject])

  const send = () => {
    if (!assunto.trim()) {
      toast('Informe o assunto da solicitação.', 'warning')
      return
    }
    const protocolo = `#SOL-${Math.floor(9822 + Math.random() * 170)}`
    onSubmit?.({ tipo, assunto, descricao, protocolo })
    toast(`Solicitação ${protocolo} enviada ao escritório`)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={send}>Enviar solicitação</Button>
        </>
      }
    >
      <div className="space-y-4">
        {types && types.length > 0 && (
          <Field label="Tipo">
            <Select value={tipo} onChange={setTipo} options={types} className="w-full" />
          </Field>
        )}
        <Field label="Assunto">
          <Input value={assunto} onChange={(e) => setAssunto(e.target.value)} placeholder="Resumo da solicitação" />
        </Field>
        <Field label="Descrição / detalhes">
          <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva o que precisa..." />
        </Field>
      </div>
    </Modal>
  )
}
