import { useState } from 'react'
import { Copy, QrCode, Barcode, CreditCard } from 'lucide-react'
import { Button, Modal, InfoRow } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { brl, copyText, cn, downloadFile } from '../../lib/utils'
import { PIX_CODE } from './data'

export function PaymentModal({
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
  const [method, setMethod] = useState<'pix' | 'boleto' | 'cartao'>('pix')
  const [loading, setLoading] = useState(false)

  const confirm = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onPaid()
      onClose()
      toast('Pagamento confirmado com sucesso!')
    }, 900)
  }

  const methods = [
    { v: 'pix' as const, label: 'PIX', icon: QrCode },
    { v: 'boleto' as const, label: 'Boleto', icon: Barcode },
    { v: 'cartao' as const, label: 'Cartão', icon: CreditCard },
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Realizar pagamento"
      subtitle={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={confirm} disabled={loading}>
            {loading ? 'Processando...' : 'Confirmar pagamento'}
          </Button>
        </>
      }
    >
      <InfoRow label="Valor" value={<span className="num text-base">{brl(valor)}</span>} />
      <InfoRow label="Vencimento" value={venc} />
      <div className="mt-4 grid grid-cols-3 gap-2">
        {methods.map((m) => (
          <button
            key={m.v}
            onClick={() => setMethod(m.v)}
            className={cn(
              'flex cursor-pointer flex-col items-center gap-1 rounded-xl border py-3 text-xs font-semibold',
              method === m.v ? 'border-brand bg-brand/5 text-brand' : 'border-line text-slate-500 hover:bg-slate-50',
            )}
          >
            <m.icon size={18} />
            {m.label}
          </button>
        ))}
      </div>
      {method === 'pix' && (
        <div className="mt-4 rounded-xl border border-line bg-slate-50 p-4 text-center">
          <div className="mx-auto grid h-32 w-32 grid-cols-8 gap-0.5 rounded-lg bg-surface p-2">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className={(i * 7 + (i % 5)) % 3 === 0 ? 'bg-black' : 'bg-[#fff]'} />
            ))}
          </div>
          <p className="mt-3 break-all text-[10px] text-muted">{PIX_CODE.slice(0, 60)}...</p>
          <Button
            variant="soft"
            size="sm"
            className="mt-3"
            icon={<Copy size={13} />}
            onClick={async () => {
              await copyText(PIX_CODE)
              toast('Código PIX copia e cola copiado!')
            }}
          >
            Copiar código PIX
          </Button>
        </div>
      )}
      {method === 'boleto' && (
        <div className="mt-4 rounded-xl border border-line bg-slate-50 p-4">
          <p className="num break-all text-xs">34191.79001 01043.510047 91020.150008 1 98760000149000</p>
          <div className="mt-3 flex gap-2">
            <Button
              variant="soft"
              size="sm"
              onClick={async () => {
                await copyText('34191790010104351004791020150008198760000149000')
                toast('Linha digitável copiada!')
              }}
            >
              Copiar linha digitável
            </Button>
            <Button variant="secondary" size="sm" onClick={() => downloadFile('boleto.pdf')}>
              Baixar boleto
            </Button>
          </div>
        </div>
      )}
      {method === 'cartao' && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <input className="col-span-2 h-10 rounded-lg border border-line bg-slate-50 px-3 text-[13px] outline-none" placeholder="Número do cartão" />
          <input className="h-10 rounded-lg border border-line bg-slate-50 px-3 text-[13px] outline-none" placeholder="Validade (MM/AA)" />
          <input className="h-10 rounded-lg border border-line bg-slate-50 px-3 text-[13px] outline-none" placeholder="CVV" />
        </div>
      )}
    </Modal>
  )
}
