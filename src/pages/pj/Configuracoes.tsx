import { useRef, useState } from 'react'
import { Save, Building2, UploadCloud, Crosshair, Sparkles, Globe, ShieldCheck, Check, Loader2 } from 'lucide-react'
import { Badge, Button, Card, Field, Input } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { BRAND_COLORS, useBrand } from '../../components/Brand'
import { cn } from '../../lib/utils'

const HEX = /^#[0-9a-fA-F]{6}$/

export default function Configuracoes() {
  const toast = useToast()
  const brand = useBrand()
  const [color, setColor] = useState(brand.color)
  const [hex, setHex] = useState(brand.color.toUpperCase())
  const [nome, setNome] = useState(brand.officeName)
  const [crc, setCrc] = useState('CRC-SP 2SP034821/O-8')
  const [whats, setWhats] = useState('+55 (11) 98765-4321')
  const [logo, setLogo] = useState('logo_escritorio.svg')
  const [dominio, setDominio] = useState('app.apicecontabilidade.com.br')
  const [dns, setDns] = useState<'idle' | 'testing' | 'ok' | 'fail'>('ok')
  const fileRef = useRef<HTMLInputElement>(null)

  const pick = (c: string) => {
    setColor(c)
    setHex(c.toUpperCase())
  }

  const save = () => {
    brand.setColor(color)
    brand.setOfficeName(nome)
    toast('Alterações salvas! Todos os clientes já veem a nova identidade.')
  }

  const testDns = () => {
    setDns('testing')
    setTimeout(() => {
      const ok = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(dominio)
      setDns(ok ? 'ok' : 'fail')
      toast(ok ? 'CNAME verificado: apontando para portal.hubcontabil.com.br' : 'Domínio inválido ou CNAME não encontrado', ok ? 'success' : 'warning')
    }, 1200)
  }

  return (
    <div className="space-y-5" style={{ ['--brand' as string]: color }}>
      <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h2 className="text-[15px] font-bold">Gerenciamento de Marca</h2>
          <p className="text-xs text-muted">As alterações salvas são refletidas em tempo real no portal dos seus clientes.</p>
        </div>
        <Button size="lg" icon={<Save size={16} />} onClick={save}>Salvar Alterações</Button>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="flex items-center gap-2 text-[15px] font-bold"><Building2 size={16} className="text-brand" /> Identidade do Escritório</h3>
            <p className="mt-4 mb-2 text-xs font-semibold text-slate-600">Logotipo Oficial do Escritório</p>
            <div className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-dashed border-line p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-slate-500">
                <UploadCloud size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold">{logo}</p>
                <p className="text-[11px] text-muted">SVG ou PNG transparente (máx. 2MB)</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>Substituir Logo</Button>
              <input
                ref={fileRef}
                type="file"
                accept=".svg,.png"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  if (f.size > 2 * 1024 * 1024) return toast('Arquivo maior que 2MB.', 'warning')
                  setLogo(f.name)
                  toast('Logotipo atualizado')
                }}
              />
            </div>
            <Field label="Nome de Exibição do Escritório" className="mt-4">
              <Input value={nome} onChange={(e) => setNome(e.target.value)} />
            </Field>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Registro CRC do Responsável"><Input value={crc} onChange={(e) => setCrc(e.target.value)} /></Field>
              <Field label="WhatsApp de Suporte"><Input value={whats} onChange={(e) => setWhats(e.target.value)} /></Field>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="flex items-center gap-2 text-[15px] font-bold"><Crosshair size={16} className="text-brand" /> Cor Primária da Plataforma (Branding)</h3>
            <p className="mt-1 text-xs text-muted">Essa cor será aplicada dinamicamente em todos os botões, realces, ícones ativos e badges dos seus clientes.</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {BRAND_COLORS.map((c) => {
                const active = color.toLowerCase() === c.hex.toLowerCase()
                return (
                  <button
                    key={c.hex}
                    onClick={() => pick(c.hex)}
                    className={cn(
                      'flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3.5 text-xs font-semibold transition',
                      active ? 'border-brand bg-brand/5 text-ink ring-2 ring-brand/15' : 'border-line text-slate-600 hover:bg-slate-50',
                    )}
                  >
                    <span className="h-3 w-3 rounded-full" style={{ background: c.hex }} />
                    {c.name}
                    {active && <Check size={13} className="text-brand" />}
                  </button>
                )
              })}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs text-slate-600">Código HEX Customizado:</span>
              <label className="flex h-9 items-center gap-2 rounded-lg border border-line px-2.5">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => pick(e.target.value)}
                  className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  value={hex}
                  onChange={(e) => {
                    const v = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value
                    setHex(v.toUpperCase())
                    if (HEX.test(v)) setColor(v)
                  }}
                  className="num w-20 bg-transparent text-[12px] outline-none"
                  maxLength={7}
                />
              </label>
            </div>
          </Card>
        </div>

        <Card className="self-start p-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-[15px] font-bold"><Sparkles size={16} className="text-brand" /> Pré-visualização em Tempo Real</h3>
            <Badge tone="brand">Ao Vivo</Badge>
          </div>
          <p className="mt-1 text-xs text-muted">Veja como a interface do seu cliente responde à sua paleta:</p>
          <div className="mt-4 space-y-2.5 rounded-xl border border-line bg-slate-50 p-3">
            <div className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2.5">
              <span className="flex min-w-0 items-center gap-2 text-[11px] font-bold">
                <span className="h-4 w-1 rounded bg-brand" />
                <span className="truncate">{nome || 'Seu escritório'}</span>
              </span>
              <span className="shrink-0 rounded-md bg-brand px-2 py-1 text-[9px] font-bold text-white">+ Nova Ação</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-lg border border-line bg-white p-3">
                <p className="text-[9px] text-muted">Tributos Pendentes</p>
                <p className="num mt-1 text-[14px]">R$ 1.240,00</p>
                <div className="mt-2 h-1 rounded bg-slate-100"><div className="h-full w-3/4 rounded bg-brand" /></div>
              </div>
              <div className="rounded-lg border border-line bg-white p-3">
                <p className="text-[9px] text-muted">Status Fiscal</p>
                <p className="mt-1 text-[11px] font-bold text-emerald-600">✓ Regular</p>
                <p className="mt-2 rounded bg-brand/10 py-1 text-center text-[9px] font-semibold text-brand">Ver Certidão</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2.5">
              <span className="flex items-center gap-2 text-[11px] font-semibold">
                <span className="rounded border border-brand/30 bg-brand/10 px-1 text-[8px] font-bold text-brand">DAS</span> Simples Nacional
              </span>
              <span className="rounded-md bg-brand px-2 py-1 text-[9px] font-bold text-white">Baixar PDF</span>
            </div>
          </div>
          <p className="mt-4 text-center text-[11px] text-muted">Ao salvar, todos os clientes do escritório verão esta paleta instantaneamente.</p>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-slate-500">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold">Domínio Personalizado (CNAME)</h3>
              <p className="text-xs text-muted">Permita que seus clientes acessem pelo endereço web do seu escritório</p>
            </div>
          </div>
          {dns === 'ok' && <Badge tone="green"><ShieldCheck size={12} /> SSL Ativo &amp; Seguro</Badge>}
          {dns === 'fail' && <Badge tone="red" dot>DNS não verificado</Badge>}
          {dns === 'testing' && <Badge tone="amber" dot>Verificando...</Badge>}
        </div>
        <div className="mt-4 flex gap-2 border-t border-line pt-4">
          <Input
            value={dominio}
            onChange={(e) => {
              setDominio(e.target.value)
              setDns('idle')
            }}
            className="num"
          />
          <Button variant="soft" className="h-10" onClick={testDns} disabled={dns === 'testing'}>
            {dns === 'testing' ? <Loader2 size={14} className="animate-spin" /> : null}
            Testar DNS
          </Button>
        </div>
        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5 text-[11px] text-slate-500">
          Configure no seu provedor: <b className="text-ink">CNAME</b> {dominio.split('.')[0] || 'app'} → <span className="num text-brand">portal.hubcontabil.com.br</span>
        </div>
      </Card>
    </div>
  )
}
