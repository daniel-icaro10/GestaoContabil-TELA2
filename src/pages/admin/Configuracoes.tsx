import { useState, type ReactNode } from 'react'
import { Check, Save } from 'lucide-react'
import { Badge, Button, Card, Field, Input, Select, Tabs, Textarea, Toggle } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { BRAND_COLORS, useBrand } from '../../components/Brand'
import { cn } from '../../lib/utils'

type Tab = 'geral' | 'marca' | 'notificacoes' | 'seguranca' | 'integracoes'

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <Card className="p-5">
      <h3 className="text-[14px] font-bold">{title}</h3>
      {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </Card>
  )
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-line px-4 py-3">
      <div>
        <p className="text-[13px] font-semibold text-ink">{label}</p>
        {desc && <p className="text-[11px] text-muted">{desc}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

export default function Configuracoes() {
  const toast = useToast()
  const brand = useBrand()
  const [tab, setTab] = useState<Tab>('geral')

  const [geral, setGeral] = useState({
    nome: 'HUBContábil Financial',
    url: 'https://app.hubcontabil.com.br',
    email: 'suporte@hubcontabil.com.br',
    telefone: '+55 11 4000-0000',
    fuso: 'America/Sao_Paulo',
    maxClientes: 30,
    maxUsuarios: 5,
    trial: 14,
  })
  const [marca, setMarca] = useState({ logo: 'https://app.hubcontabil.com.br/logo.svg', favicon: 'https://app.hubcontabil.com.br/favicon.ico', rodape: '© 2026 HubContábil — Todos os direitos reservados.' })
  const [notif, setNotif] = useState({ novoEscritorio: true, inadimplencia: true, limitePlano: true, resumoSemanal: false, emailAlertas: 'alertas@hubcontabil.com.br' })
  const [seg, setSeg] = useState({ twoFactor: true, sessao: '60', senhaMin: 8, bloqueio: true, ipRestrito: false, logs: true })
  const [integ, setInteg] = useState([
    { id: 'gateway', name: 'Gateway de Pagamentos', desc: 'Cobrança recorrente via cartão, boleto e Pix', on: true },
    { id: 'receita', name: 'Receita Federal (e-CAC)', desc: 'Consulta de situação fiscal e CND', on: true },
    { id: 'esocial', name: 'eSocial', desc: 'Transmissão de eventos de folha', on: true },
    { id: 'nfse', name: 'NFS-e Nacional', desc: 'Emissão de notas fiscais de serviço', on: true },
    { id: 'whatsapp', name: 'WhatsApp Business API', desc: 'Notificações e atendimento', on: false },
    { id: 'smtp', name: 'SMTP Personalizado', desc: 'Envio de e-mails transacionais', on: false },
  ])

  const save = () => toast('Configurações salvas com sucesso.')

  return (
    <div className="max-w-[680px] space-y-5">
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'geral', label: 'Geral' },
          { value: 'marca', label: 'Marca' },
          { value: 'notificacoes', label: 'Notificações' },
          { value: 'seguranca', label: 'Segurança' },
          { value: 'integracoes', label: 'Integrações' },
        ]}
      />

      {tab === 'geral' && (
        <>
          <Section title="Informações da Plataforma">
            <Field label="Nome da Plataforma">
              <Input value={geral.nome} onChange={(e) => setGeral({ ...geral, nome: e.target.value })} />
            </Field>
            <Field label="URL de Acesso" hint="URL principal da aplicação">
              <Input value={geral.url} onChange={(e) => setGeral({ ...geral, url: e.target.value })} />
            </Field>
            <Field label="E-mail de Suporte">
              <Input value={geral.email} onChange={(e) => setGeral({ ...geral, email: e.target.value })} />
            </Field>
            <Field label="Telefone de Suporte">
              <Input value={geral.telefone} onChange={(e) => setGeral({ ...geral, telefone: e.target.value })} />
            </Field>
            <Field label="Fuso Horário">
              <Select
                value={geral.fuso}
                onChange={(v) => setGeral({ ...geral, fuso: v })}
                options={[
                  { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (UTC-3)' },
                  { value: 'America/Manaus', label: 'America/Manaus (UTC-4)' },
                  { value: 'America/Rio_Branco', label: 'America/Rio_Branco (UTC-5)' },
                  { value: 'America/Noronha', label: 'America/Noronha (UTC-2)' },
                ]}
                className="h-10 w-full"
              />
            </Field>
          </Section>
          <Section title="Limites da Plataforma">
            <Field label="Máximo de Clientes por Escritório (Essencial)">
              <Input type="number" value={geral.maxClientes} onChange={(e) => setGeral({ ...geral, maxClientes: Number(e.target.value) })} />
            </Field>
            <Field label="Máximo de Usuários por Escritório (Essencial)">
              <Input type="number" value={geral.maxUsuarios} onChange={(e) => setGeral({ ...geral, maxUsuarios: Number(e.target.value) })} />
            </Field>
            <Field label="Dias de Trial Gratuito">
              <Input type="number" value={geral.trial} onChange={(e) => setGeral({ ...geral, trial: Number(e.target.value) })} />
            </Field>
          </Section>
        </>
      )}

      {tab === 'marca' && (
        <Section title="Identidade da Plataforma" subtitle="Aplicada ao Super Admin e como padrão para novos escritórios">
          <Field label="Cor primária">
            <div className="flex flex-wrap gap-2">
              {BRAND_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => brand.setColor(c.hex)}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold',
                    brand.color === c.hex ? 'border-brand bg-brand/5 text-ink' : 'border-line text-slate-600 hover:bg-slate-50',
                  )}
                >
                  <span className="h-3.5 w-3.5 rounded-full" style={{ background: c.hex }} />
                  {c.name}
                  {brand.color === c.hex && <Check size={13} className="text-brand" />}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Código HEX">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brand.color}
                onChange={(e) => brand.setColor(e.target.value)}
                className="h-10 w-12 cursor-pointer rounded-lg border border-line bg-white p-1"
              />
              <Input value={brand.color} onChange={(e) => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && brand.setColor(e.target.value)} className="w-32 uppercase" />
            </div>
          </Field>
          <Field label="Logotipo (URL)">
            <Input value={marca.logo} onChange={(e) => setMarca({ ...marca, logo: e.target.value })} />
          </Field>
          <Field label="Favicon (URL)">
            <Input value={marca.favicon} onChange={(e) => setMarca({ ...marca, favicon: e.target.value })} />
          </Field>
          <Field label="Texto de rodapé">
            <Textarea value={marca.rodape} onChange={(e) => setMarca({ ...marca, rodape: e.target.value })} />
          </Field>
        </Section>
      )}

      {tab === 'notificacoes' && (
        <Section title="Notificações Administrativas" subtitle="Escolha quais eventos geram alertas para a equipe Super Admin">
          <ToggleRow label="Novo escritório cadastrado" desc="Alerta quando um escritório inicia trial" checked={notif.novoEscritorio} onChange={(v) => setNotif({ ...notif, novoEscritorio: v })} />
          <ToggleRow label="Inadimplência" desc="Assinaturas com mais de 5 dias de atraso" checked={notif.inadimplencia} onChange={(v) => setNotif({ ...notif, inadimplencia: v })} />
          <ToggleRow label="Limite de plano atingido" desc="Escritório atingiu 90% do limite de clientes" checked={notif.limitePlano} onChange={(v) => setNotif({ ...notif, limitePlano: v })} />
          <ToggleRow label="Resumo semanal por e-mail" desc="Indicadores da plataforma toda segunda-feira" checked={notif.resumoSemanal} onChange={(v) => setNotif({ ...notif, resumoSemanal: v })} />
          <Field label="E-mail para alertas">
            <Input value={notif.emailAlertas} onChange={(e) => setNotif({ ...notif, emailAlertas: e.target.value })} />
          </Field>
        </Section>
      )}

      {tab === 'seguranca' && (
        <Section title="Segurança e Acesso">
          <ToggleRow label="Autenticação em dois fatores obrigatória" desc="Para Super Admins e Admins de escritório" checked={seg.twoFactor} onChange={(v) => setSeg({ ...seg, twoFactor: v })} />
          <ToggleRow label="Bloqueio após 5 tentativas de login" checked={seg.bloqueio} onChange={(v) => setSeg({ ...seg, bloqueio: v })} />
          <ToggleRow label="Restringir acesso Super Admin por IP" checked={seg.ipRestrito} onChange={(v) => setSeg({ ...seg, ipRestrito: v })} />
          <ToggleRow label="Registro de auditoria (logs)" desc="Armazena ações de usuários por 12 meses" checked={seg.logs} onChange={(v) => setSeg({ ...seg, logs: v })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Expiração de sessão">
              <Select
                value={seg.sessao}
                onChange={(v) => setSeg({ ...seg, sessao: v })}
                options={[
                  { value: '30', label: '30 minutos' },
                  { value: '60', label: '1 hora' },
                  { value: '240', label: '4 horas' },
                  { value: '1440', label: '24 horas' },
                ]}
                className="h-10 w-full"
              />
            </Field>
            <Field label="Tamanho mínimo da senha">
              <Input type="number" min={6} value={seg.senhaMin} onChange={(e) => setSeg({ ...seg, senhaMin: Number(e.target.value) })} />
            </Field>
          </div>
          <Button variant="dangerOutline" onClick={() => toast('Todas as sessões ativas foram encerradas.', 'warning')}>
            Encerrar todas as sessões
          </Button>
        </Section>
      )}

      {tab === 'integracoes' && (
        <Section title="Integrações" subtitle="Serviços externos conectados à plataforma">
          {integ.map((i) => (
            <div key={i.id} className="flex items-center justify-between gap-4 rounded-lg border border-line px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold text-ink">{i.name}</p>
                  <Badge tone={i.on ? 'green' : 'gray'}>{i.on ? 'Conectado' : 'Desconectado'}</Badge>
                </div>
                <p className="text-[11px] text-muted">{i.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                {i.on && (
                  <Button size="sm" variant="secondary" onClick={() => toast(`Conexão com ${i.name} testada: OK.`, 'info')}>
                    Testar
                  </Button>
                )}
                <Toggle
                  checked={i.on}
                  onChange={(v) => {
                    setInteg((l) => l.map((x) => (x.id === i.id ? { ...x, on: v } : x)))
                    toast(v ? `${i.name} conectado.` : `${i.name} desconectado.`, v ? 'success' : 'warning')
                  }}
                />
              </div>
            </div>
          ))}
        </Section>
      )}

      <div className="flex justify-end">
        <Button size="lg" icon={<Save size={16} />} onClick={save}>
          Salvar alterações
        </Button>
      </div>
    </div>
  )
}
