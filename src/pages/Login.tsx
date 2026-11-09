import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Lock, Mail, AlertCircle, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Button, Input, Field } from '../components/ui'
import { useToast } from '../components/Toast'
import { login } from '../lib/auth'
import { ThemeToggle } from '../components/Theme'

export default function Login() {
  const navigate = useNavigate()
  const toast = useToast()
  const [params] = useSearchParams()
  const next = params.get('next')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return setError('Informe e-mail e senha.')
    setLoading(true)
    try {
      const u = await login(email, password)
      if (!u) {
        setError('E-mail ou senha inválidos.')
        return
      }
      toast(`Bem-vindo(a)! Acessando ${u.label}`)
      navigate(next && next.startsWith('/' + u.role) ? next : u.home)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
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
          <p className="mt-4 max-w-md text-sm text-[#b7bfd4]">
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
                <p className="text-[11px] text-[#9aa3bd]">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-[#7f89a3]">© 2026 HubContábil · LGPD e ICP-Brasil</p>
      </div>

      <div className="app-canvas relative flex flex-1 items-center justify-center p-6">
        <div className="absolute right-5 top-5">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-ink lg:mt-0">Acessar plataforma</h2>
          <p className="mt-1 text-sm text-muted">Entre com o e-mail e a senha da sua conta.</p>

          <form className="mt-8 space-y-4" onSubmit={submit}>
            <Field label="E-mail">
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <Input
                  className="pl-9"
                  type="email"
                  autoComplete="username"
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
                  className="pl-9 pr-10"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  title={show ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted hover:text-ink"
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
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
                  toast(email ? `Se houver uma conta para ${email}, enviaremos o link de recuperação.` : 'Informe seu e-mail primeiro', email ? 'info' : 'warning')
                }
                className="cursor-pointer font-semibold text-brand hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
              icon={loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>

          <p className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-muted">
            <ShieldCheck size={13} /> Conexão segura · Dados protegidos pela LGPD
          </p>
        </div>
      </div>
    </div>
  )
}
