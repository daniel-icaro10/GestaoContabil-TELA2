import { useState, type ReactNode } from 'react'
import { ShieldCheck, Smartphone, KeyRound, Monitor, Check, Plug, Landmark, MessageCircle, FileSpreadsheet, Mail, Building2, CreditCard } from 'lucide-react'
import { Badge, Button, Card, Field, Input, Modal, PageTitle, Progress, Select, Tabs, Toggle } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { cn } from '../../lib/utils'

type Tab = 'escritorio' | 'notificacoes' | 'seguranca' | 'integracoes' | 'plano'

function Section({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-[15px] font-bold">{title}</h3>
        {right}
      </div>
      {children}
    </Card>
  )
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-3 last:border-0">
      <div>
        <p className="text-[13px] font-semibold text-ink">{label}</p>
        <p className="text-xs text-muted">{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

/* ---------------- Escritório ---------------- */
function TabEscritorio() {
  const toast = useToast()
  const [d, setD] = useState({
    razao: 'Contador Central Assessoria Ltda',
    cnpj: '98.765.432/0001-10',
    fantasia: 'Contador Central Ass.',
    crc: 'SP-123456/O-7',
    email: 'contato@contadorcentral.com.br',
    telefone: '(11) 3200-4500',
    cep: '04538-132',
    logradouro: 'Av. Brigadeiro Faria Lima, 2369',
    complemento: 'Sala 801',
    bairro: 'Jardim Paulistano',
    cidade: 'São Paulo',
    uf: 'SP',
  })
  const f = (k: keyof typeof d) => ({ value: d[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setD((x) => ({ ...x, [k]: e.target.value })) })
  return (
    <div className="space-y-4">
      <Section title="Dados do Escritório">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Razão Social"><Input {...f('razao')} /></Field>
          <Field label="CNPJ"><Input {...f('cnpj')} /></Field>
          <Field label="Nome fantasia"><Input {...f('fantasia')} /></Field>
          <Field label="CRC"><Input {...f('crc')} /></Field>
          <Field label="E-mail principal"><Input {...f('email')} /></Field>
          <Field label="Telefone"><Input {...f('telefone')} /></Field>
        </div>
      </Section>
      <Section title="Endereço">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="CEP">
            <div className="flex gap-2">
              <Input {...f('cep')} />
              <Button variant="secondary" onClick={() => toast('CEP consultado — endereço confirmado', 'info')}>Buscar</Button>
            </div>
          </Field>
          <Field label="Logradouro"><Input {...f('logradouro')} /></Field>
          <Field label="Complemento"><Input {...f('complemento')} /></Field>
          <Field label="Bairro"><Input {...f('bairro')} /></Field>
          <Field label="Cidade"><Input {...f('cidade')} /></Field>
          <Field label="UF"><Input {...f('uf')} maxLength={2} /></Field>
        </div>
      </Section>
      <div className="flex justify-end">
        <Button size="lg" onClick={() => toast('Dados do escritório salvos com sucesso')}>Salvar alterações</Button>
      </div>
    </div>
  )
}

/* ---------------- Notificações ---------------- */
function TabNotificacoes() {
  const toast = useToast()
  const [n, setN] = useState({
    novoDoc: true,
    novaSol: true,
    vencimentos: true,
    certificado: true,
    inadimplencia: false,
    resumo: true,
    whatsapp: false,
  })
  const [canal, setCanal] = useState('E-mail e notificações no sistema')
  const t = (k: keyof typeof n) => ({ checked: n[k], onChange: (v: boolean) => setN((x) => ({ ...x, [k]: v })) })
  return (
    <div className="space-y-4">
      <Section title="Alertas da equipe">
        <ToggleRow label="Novo documento enviado" desc="Quando um cliente enviar arquivos ao cofre" {...t('novoDoc')} />
        <ToggleRow label="Nova solicitação" desc="Quando um cliente abrir um ticket" {...t('novaSol')} />
        <ToggleRow label="Vencimentos de obrigações" desc="Aviso 3 dias antes do vencimento de guias" {...t('vencimentos')} />
        <ToggleRow label="Certificados digitais" desc="Alertar 30 dias antes do vencimento" {...t('certificado')} />
        <ToggleRow label="Inadimplência" desc="Honorários em atraso há mais de 5 dias" {...t('inadimplencia')} />
      </Section>
      <Section title="Comunicação com clientes">
        <ToggleRow label="Resumo semanal por e-mail" desc="Envia toda segunda-feira o status de cada cliente" {...t('resumo')} />
        <ToggleRow label="Lembretes via WhatsApp" desc="Lembrete automático de guias a vencer" {...t('whatsapp')} />
        <Field label="Canal padrão" className="mt-3">
          <Select
            value={canal}
            onChange={setCanal}
            options={['E-mail e notificações no sistema', 'Somente e-mail', 'Somente sistema', 'E-mail, sistema e WhatsApp']}
            className="w-full"
          />
        </Field>
      </Section>
      <div className="flex justify-end">
        <Button size="lg" onClick={() => toast('Preferências de notificação salvas')}>Salvar alterações</Button>
      </div>
    </div>
  )
}

/* ---------------- Segurança ---------------- */
function TabSeguranca() {
  const toast = useToast()
  const [twofa, setTwofa] = useState(false)
  const [setup2fa, setSetup2fa] = useState(false)
  const [code, setCode] = useState('')
  const [senhaOpen, setSenhaOpen] = useState(false)
  const [senha, setSenha] = useState({ atual: '', nova: '', conf: '' })
  const [ipRestrito, setIpRestrito] = useState(false)
  const [sessaoTimeout, setSessaoTimeout] = useState('30 minutos')
  const [sessoes, setSessoes] = useState([
    { disp: 'Chrome · Windows', local: 'São Paulo, SP', quando: 'Agora (esta sessão)', atual: true },
    { disp: 'Safari · iPhone', local: 'São Paulo, SP', quando: 'há 2 horas', atual: false },
    { disp: 'Edge · Windows', local: 'Campinas, SP', quando: 'ontem, 18:40', atual: false },
  ])
  return (
    <div className="space-y-4">
      <Section title="Autenticação">
        <div className="flex flex-wrap items-center gap-4 border-b border-line pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand"><Smartphone size={18} /></div>
          <div className="flex-1">
            <p className="flex items-center gap-2 text-[13px] font-semibold">
              Autenticação em dois fatores (2FA)
              <Badge tone={twofa ? 'green' : 'gray'}>{twofa ? 'Ativo' : 'Desativado'}</Badge>
            </p>
            <p className="text-xs text-muted">Exige um código do app autenticador a cada login</p>
          </div>
          {twofa ? (
            <Button variant="dangerOutline" onClick={() => { setTwofa(false); toast('2FA desativado', 'warning') }}>Desativar</Button>
          ) : (
            <Button onClick={() => setSetup2fa(true)}>Ativar 2FA</Button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><KeyRound size={18} /></div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold">Senha de acesso</p>
            <p className="text-xs text-muted">Última alteração há 64 dias</p>
          </div>
          <Button variant="secondary" onClick={() => setSenhaOpen(true)}>Alterar senha</Button>
        </div>
      </Section>

      <Section title="Políticas da equipe">
        <ToggleRow label="Restringir acesso por IP" desc="Somente IPs do escritório podem acessar o painel" checked={ipRestrito} onChange={setIpRestrito} />
        <Field label="Encerrar sessão por inatividade" className="mt-3">
          <Select value={sessaoTimeout} onChange={setSessaoTimeout} options={['15 minutos', '30 minutos', '1 hora', '4 horas', 'Nunca']} className="w-full" />
        </Field>
      </Section>

      <Section
        title="Sessões ativas"
        right={
          <Button
            size="sm"
            variant="dangerOutline"
            onClick={() => {
              setSessoes((s) => s.filter((x) => x.atual))
              toast('Todas as outras sessões foram encerradas')
            }}
          >
            Encerrar outras sessões
          </Button>
        }
      >
        {sessoes.map((s, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-line py-3 last:border-0">
            <Monitor size={16} className="text-slate-400" />
            <div className="flex-1">
              <p className="text-[13px] font-semibold">{s.disp}</p>
              <p className="text-xs text-muted">{s.local} · {s.quando}</p>
            </div>
            {s.atual ? (
              <Badge tone="green">Atual</Badge>
            ) : (
              <Button size="sm" variant="secondary" onClick={() => { setSessoes((all) => all.filter((_, j) => j !== i)); toast('Sessão encerrada') }}>
                Encerrar
              </Button>
            )}
          </div>
        ))}
      </Section>

      <div className="flex justify-end">
        <Button size="lg" onClick={() => toast('Configurações de segurança salvas')}>Salvar alterações</Button>
      </div>

      <Modal
        open={setup2fa}
        onClose={() => setSetup2fa(false)}
        title="Ativar autenticação em dois fatores"
        subtitle="Escaneie o QR Code com Google Authenticator ou Authy"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSetup2fa(false)}>Cancelar</Button>
            <Button
              disabled={code.length !== 6}
              onClick={() => { setTwofa(true); setSetup2fa(false); setCode(''); toast('2FA ativado com sucesso') }}
            >
              Confirmar
            </Button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-4">
          <div className="grid h-36 w-36 grid-cols-8 gap-0.5 rounded-lg border border-line p-2">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className={cn('rounded-[1px]', (i * 7 + (i % 5) * 3) % 3 === 0 ? 'bg-ink' : 'bg-white')} />
            ))}
          </div>
          <p className="num text-xs text-slate-500">HUBC-7K2M-Q9XA-4LTP</p>
          <Field label="Código de 6 dígitos" className="w-full">
            <Input value={code} maxLength={6} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="000000" />
          </Field>
        </div>
      </Modal>

      <Modal
        open={senhaOpen}
        onClose={() => setSenhaOpen(false)}
        title="Alterar senha"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSenhaOpen(false)}>Cancelar</Button>
            <Button
              onClick={() => {
                if (!senha.atual || senha.nova.length < 8) return toast('A nova senha precisa ter ao menos 8 caracteres', 'warning')
                if (senha.nova !== senha.conf) return toast('As senhas não conferem', 'warning')
                setSenha({ atual: '', nova: '', conf: '' })
                setSenhaOpen(false)
                toast('Senha alterada com sucesso')
              }}
            >
              Salvar nova senha
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Senha atual"><Input type="password" value={senha.atual} onChange={(e) => setSenha((s) => ({ ...s, atual: e.target.value }))} /></Field>
          <Field label="Nova senha" hint="Mínimo de 8 caracteres"><Input type="password" value={senha.nova} onChange={(e) => setSenha((s) => ({ ...s, nova: e.target.value }))} /></Field>
          <Field label="Confirmar nova senha"><Input type="password" value={senha.conf} onChange={(e) => setSenha((s) => ({ ...s, conf: e.target.value }))} /></Field>
        </div>
      </Modal>
    </div>
  )
}

/* ---------------- Integrações ---------------- */
const INTEGRACOES = [
  { id: 'receita', nome: 'Receita Federal (e-CAC)', desc: 'Consulta de situação fiscal e CND automática', icon: Landmark, on: true },
  { id: 'prefeitura', nome: 'NFS-e Prefeitura SP', desc: 'Emissão e importação de notas de serviço', icon: FileSpreadsheet, on: true },
  { id: 'esocial', nome: 'eSocial', desc: 'Transmissão de eventos da folha de pagamento', icon: Building2, on: true },
  { id: 'whatsapp', nome: 'WhatsApp Business', desc: 'Envio de lembretes e atendimento aos clientes', icon: MessageCircle, on: false },
  { id: 'banco', nome: 'Open Finance (Bancos)', desc: 'Importação automática de extratos OFX', icon: CreditCard, on: false },
  { id: 'smtp', nome: 'Servidor de E-mail (SMTP)', desc: 'Envio de e-mails com o domínio do escritório', icon: Mail, on: false },
]

function TabIntegracoes() {
  const toast = useToast()
  const [on, setOn] = useState<Record<string, boolean>>(Object.fromEntries(INTEGRACOES.map((i) => [i.id, i.on])))
  const [conectando, setConectando] = useState<(typeof INTEGRACOES)[number] | null>(null)
  const [token, setToken] = useState('')
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {INTEGRACOES.map((i) => (
        <Card key={i.id} className="flex flex-col p-5">
          <div className="flex items-start gap-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', on[i.id] ? 'bg-brand/10 text-brand' : 'bg-slate-100 text-slate-400')}>
              <i.icon size={18} />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold">{i.nome}</p>
              <p className="text-xs text-muted">{i.desc}</p>
            </div>
            <Badge tone={on[i.id] ? 'green' : 'gray'} dot>{on[i.id] ? 'Conectado' : 'Desconectado'}</Badge>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            {on[i.id] ? (
              <>
                <Button size="sm" variant="secondary" onClick={() => toast(`Sincronização com ${i.nome} concluída`)}>Sincronizar</Button>
                <Button size="sm" variant="dangerOutline" onClick={() => { setOn((o) => ({ ...o, [i.id]: false })); toast(`${i.nome} desconectado`, 'warning') }}>
                  Desconectar
                </Button>
              </>
            ) : (
              <Button size="sm" icon={<Plug size={13} />} onClick={() => setConectando(i)}>Conectar</Button>
            )}
          </div>
        </Card>
      ))}
      <Modal
        open={!!conectando}
        onClose={() => setConectando(null)}
        title={conectando ? `Conectar ${conectando.nome}` : ''}
        subtitle="Informe as credenciais fornecidas pelo serviço"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConectando(null)}>Cancelar</Button>
            <Button
              disabled={!token.trim()}
              onClick={() => {
                if (!conectando) return
                setOn((o) => ({ ...o, [conectando.id]: true }))
                toast(`${conectando.nome} conectado com sucesso`)
                setToken('')
                setConectando(null)
              }}
            >
              Conectar
            </Button>
          </>
        }
      >
        <Field label="Chave de API / Token"><Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="cole aqui o token de acesso" /></Field>
      </Modal>
    </div>
  )
}

/* ---------------- Plano ---------------- */
const PLANOS = [
  { nome: 'Essencial', preco: 199, clientes: 30, usuarios: 5, storage: '5 GB' },
  { nome: 'Profissional', preco: 399, clientes: 100, usuarios: 15, storage: '25 GB' },
  { nome: 'Premium', preco: 799, clientes: Infinity, usuarios: Infinity, storage: '100 GB' },
]

function TabPlano() {
  const toast = useToast()
  const [atual, setAtual] = useState('Profissional')
  const [upgrade, setUpgrade] = useState(false)
  const plano = PLANOS.find((p) => p.nome === atual)!
  const uso = [
    { label: 'Clientes', usado: 87, total: plano.clientes },
    { label: 'Usuários', usado: 5, total: plano.usuarios },
    { label: 'Armazenamento', usado: 3.4, total: parseFloat(plano.storage), suf: ' GB' },
  ]
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand"><ShieldCheck size={22} /></div>
          <div className="flex-1">
            <p className="text-xs text-muted">Plano atual</p>
            <p className="text-lg font-bold">
              {plano.nome} <span className="num text-base text-brand">R$ {plano.preco}</span>
              <span className="text-xs text-muted">/mês</span>
            </p>
            <p className="text-xs text-muted">Próxima cobrança em 10/11/2024 · Cartão final 4242</p>
          </div>
          <Badge tone="green" dot>Ativo</Badge>
          {atual !== 'Premium' && <Button onClick={() => setUpgrade(true)}>Fazer upgrade</Button>}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {uso.map((u) => (
            <div key={u.label} className="rounded-xl border border-line bg-slate-50/60 p-4">
              <p className="text-xs text-muted">{u.label}</p>
              <p className="num mt-1 text-lg">
                {u.usado}
                {u.suf ?? ''}
                <span className="text-xs text-muted"> / {u.total === Infinity ? '∞' : `${u.total}${u.suf ?? ''}`}</span>
              </p>
              <Progress value={u.total === Infinity ? 5 : (u.usado / u.total) * 100} className="mt-2" />
            </div>
          ))}
        </div>
      </Card>
      <Section title="Histórico de cobranças">
        {['Outubro 2024', 'Setembro 2024', 'Agosto 2024'].map((m) => (
          <div key={m} className="flex items-center justify-between border-b border-line py-3 text-[13px] last:border-0">
            <span className="font-semibold">{m}</span>
            <span className="num text-slate-500">R$ {plano.preco},00</span>
            <Badge tone="green">Pago</Badge>
            <Button size="sm" variant="soft" onClick={() => toast(`Recibo de ${m} enviado para seu e-mail`, 'info')}>Recibo</Button>
          </div>
        ))}
      </Section>
      <Modal open={upgrade} onClose={() => setUpgrade(false)} title="Escolha seu novo plano" width="max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-3">
          {PLANOS.map((p) => (
            <div key={p.nome} className={cn('rounded-xl border p-4', p.nome === atual ? 'border-brand bg-brand/5' : 'border-line')}>
              <p className="font-bold">{p.nome}</p>
              <p className="num mt-2 text-xl text-brand">R$ {p.preco}<span className="text-xs text-muted">/mês</span></p>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                <li className="flex gap-1.5"><Check size={13} className="text-emerald-500" />{p.clientes === Infinity ? 'Clientes ilimitados' : `${p.clientes} clientes`}</li>
                <li className="flex gap-1.5"><Check size={13} className="text-emerald-500" />{p.usuarios === Infinity ? 'Usuários ilimitados' : `${p.usuarios} usuários`}</li>
                <li className="flex gap-1.5"><Check size={13} className="text-emerald-500" />{p.storage} de armazenamento</li>
              </ul>
              <Button
                className="mt-4 w-full"
                variant={p.nome === atual ? 'secondary' : 'primary'}
                disabled={p.nome === atual}
                onClick={() => { setAtual(p.nome); setUpgrade(false); toast(`Plano alterado para ${p.nome}`) }}
              >
                {p.nome === atual ? 'Plano atual' : 'Selecionar'}
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default function Configuracoes() {
  const [tab, setTab] = useState<Tab>('escritorio')
  return (
    <div className="max-w-[880px] space-y-5">
      <PageTitle title="Configurações" subtitle="Preferências e parâmetros do escritório" />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'escritorio', label: 'Escritório' },
          { value: 'notificacoes', label: 'Notificações' },
          { value: 'seguranca', label: 'Segurança' },
          { value: 'integracoes', label: 'Integrações' },
          { value: 'plano', label: 'Plano' },
        ]}
      />
      {tab === 'escritorio' && <TabEscritorio />}
      {tab === 'notificacoes' && <TabNotificacoes />}
      {tab === 'seguranca' && <TabSeguranca />}
      {tab === 'integracoes' && <TabIntegracoes />}
      {tab === 'plano' && <TabPlano />}
    </div>
  )
}
