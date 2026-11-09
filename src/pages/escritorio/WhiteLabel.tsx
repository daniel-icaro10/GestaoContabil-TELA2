import { useState } from 'react'
import { Check, Save, RotateCcw } from 'lucide-react'
import { Button, Card, Field, Input, PageTitle, Textarea, Toggle } from '../../components/ui'
import { useBrand } from '../../components/Brand'
import { useToast } from '../../components/Toast'
import { cn } from '../../lib/utils'

const SWATCHES = ['#3b4fd8', '#a855f7', '#4caf7a', '#e0a020', '#dc4a3c', '#3a8fb0']

const MODULOS_INICIAIS: Record<string, boolean> = {
  Dashboard: true,
  Tributos: true,
  Documentos: true,
  'Solicitações': true,
  'Notas Fiscais': true,
  'Folha de Pagamento': true,
  'Sócios': true,
  'Certificado Digital': false,
  Financeiro: true,
  'Dados da Empresa': true,
}

const isHex = (v: string) => /^#[0-9a-f]{6}$/i.test(v)

export default function WhiteLabel() {
  const brand = useBrand()
  const toast = useToast()
  const [nome, setNome] = useState('Contador Central · Portal do Cliente')
  const [logo, setLogo] = useState('')
  const [favicon, setFavicon] = useState('')
  const [cor, setCor] = useState(brand.color)
  const [hexInput, setHexInput] = useState(brand.color.toUpperCase())
  const [dominio, setDominio] = useState('portal.contadorcentral.com.br')
  const [remetente, setRemetente] = useState('')
  const [nomeRemetente, setNomeRemetente] = useState('')
  const [rodape, setRodape] = useState('')
  const [modulos, setModulos] = useState(MODULOS_INICIAIS)
  const [verificando, setVerificando] = useState(false)
  const [dominioOk, setDominioOk] = useState(true)

  const pick = (c: string) => {
    setCor(c)
    setHexInput(c.toUpperCase())
  }

  const salvar = () => {
    brand.setColor(cor)
    brand.setOfficeName(nome.split('·')[0].trim() || nome)
    toast('White-label salvo! A nova identidade já está aplicada no portal dos clientes.')
  }

  const restaurar = () => {
    pick('#3b4fd8')
    setNome('Contador Central · Portal do Cliente')
    setModulos(MODULOS_INICIAIS)
    toast('Valores padrão restaurados (clique em Salvar para aplicar)', 'info')
  }

  const previewMenu = ['Início', ...Object.entries(modulos).filter(([k, v]) => v && k !== 'Dashboard').map(([k]) => k)].slice(0, 6)
  const shortName = nome.split('·')[0].trim() || 'Seu escritório'

  return (
    <div className="max-w-[880px] space-y-5">
      <PageTitle title="White-label" subtitle="Personalize a identidade visual do portal do cliente" />

      {/* Preview */}
      <Card className="bg-gradient-to-br from-slate-50 to-indigo-50/40 p-5">
        <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-slate-400">PREVIEW - PORTAL DO CLIENTE</p>
        <div className="flex overflow-hidden rounded-xl border border-line bg-surface">
          <div className="w-28 shrink-0 border-r border-line p-3 sm:w-32">
            <div className="mb-3 flex items-center gap-2">
              {logo ? (
                <img src={logo} alt="" className="h-6 w-6 rounded object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
              ) : (
                <div className="h-6 w-6 shrink-0 rounded-md" style={{ background: cor }} />
              )}
              <span className="truncate text-[9px] font-bold text-ink">{shortName}</span>
            </div>
            {previewMenu.map((m, i) => (
              <p
                key={m}
                className="truncate rounded px-1.5 py-1 text-[9px]"
                style={i === 0 ? { background: cor + '1a', color: cor, fontWeight: 700 } : { color: '#64748b' }}
              >
                {m}
              </p>
            ))}
          </div>
          <div className="flex-1 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-bold text-ink">Olá, Empresa Alpha</p>
              <span className="rounded px-2 py-0.5 text-[8px] font-bold text-white" style={{ background: cor }}>
                + Nova Ação
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                ['Tributos', '3', modulos.Tributos],
                ['Documentos', '12', modulos.Documentos],
                ['Solicitações', '2', modulos['Solicitações']],
              ]
                .filter(([, , v]) => v)
                .map(([l, n]) => (
                  <div key={l as string} className="rounded-md border border-line bg-surface p-2">
                    <p className="text-[8px] text-muted">{l}</p>
                    <p className="num text-sm">{n}</p>
                    <div className="mt-1 h-1 rounded-full" style={{ background: cor, width: '65%' }} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="space-y-4 p-5">
          <h3 className="text-[15px] font-bold">Identidade</h3>
          <Field label="Nome da plataforma">
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </Field>
          <Field label="Logotipo (URL)">
            <Input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://seu-site.com.br/logo.svg" />
          </Field>
          <Field label="Favicon (URL)">
            <Input value={favicon} onChange={(e) => setFavicon(e.target.value)} placeholder="https://seu-site.com.br/favicon.ico" />
          </Field>
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-600">Cor principal</p>
            <div className="flex flex-wrap items-center gap-2.5">
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  onClick={() => pick(c)}
                  className={cn(
                    'flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition',
                    cor.toLowerCase() === c ? 'ring-2 ring-offset-2' : 'hover:scale-110',
                  )}
                  style={{ background: c, ['--tw-ring-color' as string]: c }}
                >
                  {cor.toLowerCase() === c && <Check size={13} className="text-white" />}
                </button>
              ))}
              <input
                value={hexInput}
                onChange={(e) => {
                  const v = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value
                  setHexInput(v.toUpperCase())
                  if (isHex(v)) setCor(v.toLowerCase())
                }}
                className="num w-24 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-xs text-slate-500 outline-none focus:border-line"
              />
              <input
                type="color"
                value={cor}
                onChange={(e) => pick(e.target.value)}
                title="Escolher cor personalizada"
                className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-5">
          <h3 className="text-[15px] font-bold">Domínio e Comunicação</h3>
          <Field label="Domínio personalizado">
            <div className="flex gap-2">
              <Input
                value={dominio}
                onChange={(e) => {
                  setDominio(e.target.value)
                  setDominioOk(false)
                }}
              />
              <Button
                variant="secondary"
                disabled={verificando}
                onClick={() => {
                  setVerificando(true)
                  setTimeout(() => {
                    setVerificando(false)
                    setDominioOk(true)
                    toast(`DNS de ${dominio} verificado com sucesso`)
                  }, 900)
                }}
              >
                {verificando ? 'Verificando...' : 'Verificar'}
              </Button>
            </div>
            <span className={cn('mt-1 block text-[11px]', dominioOk ? 'text-emerald-600' : 'text-amber-600')}>
              {dominioOk ? '✓ Domínio ativo e verificado' : 'Domínio alterado — verifique o DNS (CNAME → app.hubcontabil.com.br)'}
            </span>
          </Field>
          <Field label="E-mail de remetente">
            <Input value={remetente} onChange={(e) => setRemetente(e.target.value)} placeholder="no-reply@contadorcentral.com.br" />
          </Field>
          <Field label="Nome remetente nos e-mails">
            <Input value={nomeRemetente} onChange={(e) => setNomeRemetente(e.target.value)} placeholder="Contador Central Assessoria" />
          </Field>
          <Field label="Rodapé dos e-mails">
            <Textarea value={rodape} onChange={(e) => setRodape(e.target.value)} placeholder="Texto que aparece no rodapé das notificações enviadas aos clientes." />
          </Field>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="mb-4 text-[15px] font-bold">Módulos visíveis para clientes</h3>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {Object.entries(modulos).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-2 rounded-lg border border-line bg-slate-50/60 px-3 py-2.5">
              <span className="text-xs font-medium text-slate-600">{k}</span>
              <Toggle checked={v} onChange={(nv) => setModulos((m) => ({ ...m, [k]: nv }))} />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" icon={<RotateCcw size={14} />} onClick={restaurar}>
          Restaurar padrão
        </Button>
        <Button size="lg" icon={<Save size={15} />} onClick={salvar}>
          Salvar alterações
        </Button>
      </div>
    </div>
  )
}
