import { useState } from 'react'
import { Copy, QrCode, Send, MessageCircle } from 'lucide-react'
import { Badge, Button, Field, Input, Modal, Select, Textarea, Dropzone, InfoRow } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { brl, copyText, cn } from '../../lib/utils'
import { PIX_CODE, CONTADOR_WHATSAPP, type Solicitacao } from './data'

/** Modal de pagamento via PIX/boleto */
export function PayModal({
  open,
  onClose,
  title,
  valor,
  venc,
  onPaid,
}: {
  open: boolean
  onClose: () => void
  title: string
  valor: number
  venc: string
  onPaid: () => void
}) {
  const toast = useToast()
  const [metodo, setMetodo] = useState<'pix' | 'boleto'>('pix')
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Pagamento"
      subtitle={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onPaid()
              onClose()
              toast('Pagamento confirmado com sucesso!')
            }}
          >
            Confirmar pagamento
          </Button>
        </>
      }
    >
      <InfoRow label="Valor" value={<span className="num">{brl(valor)}</span>} />
      <InfoRow label="Vencimento" value={venc} />
      <div className="mt-4 flex gap-2">
        {(['pix', 'boleto'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMetodo(m)}
            className={cn(
              'flex-1 cursor-pointer rounded-lg border px-3 py-2 text-[13px] font-semibold',
              metodo === m ? 'border-brand bg-brand/10 text-brand' : 'border-line text-slate-500',
            )}
          >
            {m === 'pix' ? 'PIX' : 'Boleto'}
          </button>
        ))}
      </div>
      {metodo === 'pix' ? (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-line bg-slate-50 p-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-xl border border-line bg-surface text-slate-700">
            <QrCode size={96} strokeWidth={1.2} />
          </div>
          <p className="w-full break-all rounded-lg bg-surface p-2 text-[10px] text-slate-500">{PIX_CODE}</p>
          <Button
            variant="soft"
            size="sm"
            icon={<Copy size={13} />}
            onClick={async () => {
              await copyText(PIX_CODE)
              toast('Código PIX copiado!')
            }}
          >
            Copiar código PIX
          </Button>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-line bg-slate-50 p-4">
          <p className="text-xs text-muted">Linha digitável</p>
          <p className="num mt-1 break-all text-[12px]">34191.79001 01043.510047 91020.150008 8 99230000{Math.round(valor * 100)}</p>
          <Button
            variant="soft"
            size="sm"
            className="mt-3"
            icon={<Copy size={13} />}
            onClick={async () => {
              await copyText('34191790010104351004791020150008899230000' + Math.round(valor * 100))
              toast('Linha digitável copiada!')
            }}
          >
            Copiar linha digitável
          </Button>
        </div>
      )}
    </Modal>
  )
}

/** Modal de chat de uma solicitação */
export function ChatModal({
  sol,
  onClose,
  onSend,
}: {
  sol: Solicitacao | null
  onClose: () => void
  onSend: (texto: string) => void
}) {
  const [texto, setTexto] = useState('')
  if (!sol) return null
  return (
    <Modal
      open
      onClose={onClose}
      title={`${sol.id} · ${sol.titulo}`}
      subtitle={`${sol.tipo} · Aberta em ${sol.aberta}`}
      width="max-w-xl"
    >
      <div className="mb-3 flex justify-end">
        <Badge tone={sol.status === 'Concluída' ? 'green' : 'amber'}>{sol.status}</Badge>
      </div>
      <div className="space-y-3">
        {sol.mensagens.map((m, i) => (
          <div key={i} className={cn('flex', m.de === 'cliente' ? 'justify-end' : 'justify-start')}>
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px]',
                m.de === 'cliente' ? 'rounded-br-sm bg-brand text-white' : 'rounded-bl-sm bg-slate-100 text-ink',
              )}
            >
              <p>{m.texto}</p>
              <p className={cn('mt-1 text-[10px]', m.de === 'cliente' ? 'text-white/70' : 'text-muted')}>
                {m.de === 'contador' ? 'Carlos (Contador) · ' : ''}
                {m.hora}
              </p>
            </div>
          </div>
        ))}
      </div>
      {sol.status !== 'Concluída' ? (
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!texto.trim()) return
            onSend(texto.trim())
            setTexto('')
          }}
        >
          <Input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escreva uma mensagem..." />
          <Button type="submit" icon={<Send size={14} />}>
            Enviar
          </Button>
        </form>
      ) : (
        <p className="mt-4 text-center text-xs text-muted">Esta solicitação foi concluída e arquivada.</p>
      )}
    </Modal>
  )
}

/** Formulário de nova solicitação */
export function NovaSolicitacaoModal({
  open,
  onClose,
  onCreate,
  defaultTipo = 'Dúvida fiscal',
  defaultTitulo = '',
}: {
  open: boolean
  onClose: () => void
  onCreate: (tipo: string, titulo: string, descricao: string) => void
  defaultTipo?: string
  defaultTitulo?: string
}) {
  const [tipo, setTipo] = useState(defaultTipo)
  const [titulo, setTitulo] = useState(defaultTitulo)
  const [desc, setDesc] = useState('')
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova solicitação"
      subtitle="Seu contador responderá em até 4h úteis"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={!titulo.trim()}
            onClick={() => {
              onCreate(tipo, titulo.trim(), desc.trim())
              setTitulo('')
              setDesc('')
              onClose()
            }}
          >
            Enviar solicitação
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Tipo">
          <Select
            className="w-full"
            value={tipo}
            onChange={setTipo}
            options={['Dúvida fiscal', 'Envio de documento', 'Declaração IRPF', 'Alteração cadastral', 'Outros']}
          />
        </Field>
        <Field label="Assunto">
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Dúvida sobre Carnê-Leão" />
        </Field>
        <Field label="Descrição">
          <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descreva sua solicitação..." />
        </Field>
      </div>
    </Modal>
  )
}

/** Modal de upload de documento */
export function UploadModal({
  open,
  onClose,
  onUpload,
}: {
  open: boolean
  onClose: () => void
  onUpload: (files: File[], categoria: string) => void
}) {
  const [categoria, setCategoria] = useState('Comprovantes')
  const [files, setFiles] = useState<File[]>([])
  const close = () => {
    setFiles([])
    onClose()
  }
  return (
    <Modal
      open={open}
      onClose={close}
      title="Enviar documento"
      subtitle="Os arquivos serão enviados ao seu contador"
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancelar
          </Button>
          <Button
            disabled={!files.length}
            onClick={() => {
              onUpload(files, categoria)
              close()
            }}
          >
            Enviar {files.length > 0 && `(${files.length})`}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Categoria">
          <Select
            className="w-full"
            value={categoria}
            onChange={setCategoria}
            options={['Informes de Rendimentos', 'Declarações IRPF', 'Comprovantes', 'Documentos Pessoais', 'Recibos', 'Outros']}
          />
        </Field>
        <Dropzone
          compact
          title="Arraste arquivos aqui ou clique para selecionar"
          hint="PDF, PNG, JPG até 20 MB"
          onFiles={(f) => setFiles((prev) => [...prev, ...f])}
        />
        {files.length > 0 && (
          <ul className="space-y-1">
            {files.map((f, i) => (
              <li key={i} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
                <span className="truncate">{f.name}</span>
                <span className="text-muted">{(f.size / 1024).toFixed(0)} KB</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  )
}

/** Modal "Falar com contador" */
export function ContadorModal({ open, onClose, onChat }: { open: boolean; onClose: () => void; onChat: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Falar com contador" subtitle="Carlos Andrade · Contador Central Assessoria">
      <div className="space-y-3">
        <a
          href={CONTADOR_WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-semibold text-emerald-700 hover:brightness-95"
        >
          <MessageCircle size={18} /> Conversar pelo WhatsApp
        </a>
        <button
          onClick={() => {
            onClose()
            onChat()
          }}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-left text-[13px] font-semibold text-brand hover:bg-brand/10"
        >
          <Send size={18} /> Abrir solicitação no portal
        </button>
        <p className="text-center text-xs text-muted">Atendimento de segunda a sexta, das 9h às 18h.</p>
      </div>
    </Modal>
  )
}
