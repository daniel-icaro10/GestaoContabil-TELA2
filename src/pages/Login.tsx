import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ShieldCheck, Landmark, Building2, User, ArrowRight, Lock, Mail, KeyRound, Copy, AlertCircle } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Button, Input, Field } from '../components/ui'
import { useToast } from '../components/Toast'
import { cn, copyText } from '../lib/utils'
import { USERS, login, type Role } from '../lib/auth'

const profiles: { role: Role; desc: string; icon: typeof ShieldCheck; cls: string }[] = [
  { role: 'admin', desc: 'Gestão da plataforma, escritórios e assinaturas', icon: ShieldCheck, cls: 'text-violet-600 bg-violet-50' },
  { role: 'escritorio', desc: 'Clientes, obrigações, equipe e white-label', icon: Landmark, cls: 'text-emerald-600 bg-emerald-50' },
  { role: 'pj', desc: 'Portal da empresa: guias, notas, folha', icon: Building2, cls: 'text-brand bg-brand/10' },
  { role: 'pf', desc: 'Imposto de renda, carnê-leão e documentos', icon: User, cls: 'text-sky-600 bg-sky-50' },
]

const userOf = (role: Role) => USERS.find((u) => u.role === role)!

export default function Login() {
  const navigate = useNavigate()
  const toast = useToast()
  const [params] = useSearchParams()
  const initial = (profiles.find((p) => p.role === params.get('perfil'))?.role ?? 'pj') as Role
  const next = params.get('next')

  const [selected, setSelected] = useState<Role>(initial)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function fill(role: Role) {
    const u = userOf(role)
    setSelected(role)
    setEmail(u.email)
    setPassword(u.password)
    setError('')
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const u = login(email, password)
    if (!u) {
      setError('E-mail ou senha inválidos. Use um dos acessos de demonstração abaixo.')
      return
    }
    toast(`Bem-vindo(a)! Acessando ${u.label}`)
    navigate(next && next.startsWith('/' + u.role) ? next : u.home)
  }

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
          <p className="mt-1 text-sm text-muted">Escolha o perfil para preencher o acesso automaticamente.</p>

          <div className="mt-6 grid grid-cols-2 gap-2.5">
            {profiles.map((p) => (
              <button
                key={p.role}
                type="button"
                onClick={() => fill(p.role)}
                className={cn(
                  'cursor-pointer rounded-xl border bg-white p-3 text-left transition',
                  selected === p.role ? 'border-brand ring-2 ring-brand/15' : 'border-line hover:border-brand/30',
                )}
              >
                <div className={cn('mb-2 flex h-8 w-8 items-center justify-center rounded-lg', p.cls)}>
                  <p.icon size={16} />
                </div>
                <p className="text-[13px] font-bold text-ink">{userOf(p.role).label}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted">{p.desc}</p>
              </button>
            ))}
          </div>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <Field label="E-mail">
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <Input
                  className="pl-9"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                />
              </div>
            </Field>
            <Field label="Senha">
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <Input
                  className="pl-9"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                />
              </div>
            </Field>
            {error && (
              <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                <AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}
              </p>
            )}
            <div className="flex items-center justify-between text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                <input type="checkbox" defaultChecked className="accent-[var(--brand)]" /> Manter conectado
              </label>
              <button
                type="button"
                onClick={() =>
                  toast(email ? `Link de recuperação enviado para ${email}` : 'Informe seu e-mail primeiro', email ? 'info' : 'warning')
                }
                className="cursor-pointer font-semibold text-brand hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
            <Button type="submit" size="lg" className="w-full" icon={<ArrowRight size={16} />}>
              Entrar
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-dashed border-line bg-white p-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-bold text-ink">
              <KeyRound size={14} className="text-brand" /> Acessos de demonstração
            </p>
            <div className="space-y-1.5">
              {USERS.map((u) => (
                <div
                  key={u.role}
                  onClick={() => fill(u.role)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-left text-[11.5px] hover:bg-slate-50"
                >
                  <span className="w-28 shrink-0 font-semibold text-ink">{u.label}</span>
                  <span className="flex-1 truncate font-mono text-slate-600">{u.email}</span>
                  <span className="font-mono text-slate-500">{u.password}</span>
                  <button
                    type="button"
                    title="Copiar acesso"
                    className="shrink-0 cursor-pointer text-muted hover:text-brand"
                    onClick={async (e) => {
                      e.stopPropagation()
                      await copyText(`${u.email} / ${u.password}`)
                      toast('Acesso copiado')
                    }}
                  >
                    <Copy size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
