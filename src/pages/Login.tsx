import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Landmark, Building2, User, ArrowRight, Lock, Mail } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Button, Input, Field } from '../components/ui'
import { useToast } from '../components/Toast'
import { cn } from '../lib/utils'

const profiles = [
  {
    key: 'admin',
    to: '/admin',
    label: 'Super Admin',
    desc: 'Gestão da plataforma, escritórios e assinaturas',
    icon: ShieldCheck,
    email: 'gabriel@hubcontabil.com',
    cls: 'text-violet-600 bg-violet-50',
  },
  {
    key: 'escritorio',
    to: '/escritorio',
    label: 'Escritório Contábil',
    desc: 'Clientes, obrigações, equipe e white-label',
    icon: Landmark,
    email: 'carlos@contadorcentral.com.br',
    cls: 'text-emerald-600 bg-emerald-50',
  },
  {
    key: 'pj',
    to: '/pj',
    label: 'Cliente PJ',
    desc: 'Portal da empresa: guias, notas, folha',
    icon: Building2,
    email: 'joao@techfounders.com.br',
    cls: 'text-brand bg-brand/10',
  },
  {
    key: 'pf',
    to: '/pf',
    label: 'Cliente Pessoa Física',
    desc: 'Imposto de renda, carnê-leão e documentos',
    icon: User,
    email: 'maria.souza@email.com',
    cls: 'text-sky-600 bg-sky-50',
  },
]

export default function Login() {
  const navigate = useNavigate()
  const toast = useToast()
  const [selected, setSelected] = useState(profiles[2])
  const [email, setEmail] = useState(profiles[2].email)
  const [password, setPassword] = useState('demo1234')

  return (
    <div className="flex min-h-full">
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-navy p-10 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand/30 blur-3xl" />
        <Logo dark />
        <div className="relative">
          <h1 className="text-4xl font-extrabold leading-tight">
            A gestão contábil
            <br />
            da sua empresa,
            <br />
            <span className="text-violet-300">em um só lugar.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm text-slate-300">
            Guias, notas fiscais, folha de pagamento, documentos e comunicação com o seu contador — tudo integrado e seguro.
          </p>
          <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
            {[
              ['247', 'Escritórios'],
              ['3.841', 'Empresas'],
              ['99,9%', 'Uptime'],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="num text-lg">{v}</p>
                <p className="text-[11px] text-slate-400">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-slate-500">© 2026 HubContábil · LGPD e ICP-Brasil</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-ink lg:mt-0">Acessar plataforma</h2>
          <p className="mt-1 text-sm text-muted">Escolha o perfil de acesso para a demonstração.</p>

          <div className="mt-6 grid grid-cols-2 gap-2.5">
            {profiles.map((p) => (
              <button
                key={p.key}
                onClick={() => {
                  setSelected(p)
                  setEmail(p.email)
                }}
                className={cn(
                  'cursor-pointer rounded-xl border bg-white p-3 text-left transition',
                  selected.key === p.key ? 'border-brand ring-2 ring-brand/15' : 'border-line hover:border-brand/30',
                )}
              >
                <div className={cn('mb-2 flex h-8 w-8 items-center justify-center rounded-lg', p.cls)}>
                  <p.icon size={16} />
                </div>
                <p className="text-[13px] font-bold text-ink">{p.label}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted">{p.desc}</p>
              </button>
            ))}
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!email || !password) return toast('Informe e-mail e senha', 'warning')
              toast(`Bem-vindo(a)! Acessando ${selected.label}`)
              navigate(selected.to)
            }}
          >
            <Field label="E-mail">
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <Input className="pl-9" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </Field>
            <Field label="Senha">
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <Input className="pl-9" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </Field>
            <div className="flex items-center justify-between text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                <input type="checkbox" defaultChecked className="accent-[var(--brand)]" /> Manter conectado
              </label>
              <button
                type="button"
                onClick={() => toast(`Link de recuperação enviado para ${email}`, 'info')}
                className="cursor-pointer font-semibold text-brand hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
            <Button type="submit" size="lg" className="w-full" icon={<ArrowRight size={16} />}>
              Entrar como {selected.label}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
