import { useRef, useState, type ReactNode } from 'react'
import {
  Landmark,
  KeyRound,
  FileKey2,
  ShieldCheck,
  PlugZap,
  Webhook,
  Receipt,
  Save,
  Loader2,
  CheckCircle2,
  XCircle,
  Copy,
  Upload,
  ExternalLink,
  Info,
} from 'lucide-react'
import { Badge, Button, Card, Field, Input, InfoRow, Modal, Select, Toggle } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { cn, copyText } from '../../lib/utils'
import {
  CORA_URLS,
  NOTIFICATION_RULES,
  WEBHOOK_TRIGGERS,
  credentialsComplete,
  loadCoraConfig,
  saveCoraConfig,
  type CoraConfig,
  type CoraEnv,
  type CoraMode,
} from '../../lib/cora'

const envLabel: Record<CoraEnv, string> = { stage: 'Stage (homologação)', production: 'Produção' }

function Block({ icon, title, subtitle, right, children }: { icon: ReactNode; title: string; subtitle?: string; right?: ReactNode; children: ReactNode }) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">{icon}</div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-bold text-ink">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>
        {right}
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </Card>
  )
}

function FilePick({ label, accept, file, onPick }: { label: string; accept: string; file?: string; onPick: (name: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <Field label={label}>
      <div className="flex items-center gap-2 rounded-lg border border-dashed border-line bg-slate-50 px-3 py-2">
        <FileKey2 size={16} className={file ? 'text-emerald-500' : 'text-muted'} />
        <span className={cn('flex-1 truncate text-[13px]', file ? 'font-semibold text-ink' : 'text-muted')}>
          {file ?? 'Nenhum arquivo enviado'}
        </span>
        <Button size="sm" variant="secondary" icon={<Upload size={13} />} onClick={() => ref.current?.click()}>
          {file ? 'Substituir' : 'Enviar'}
        </Button>
        <input
          ref={ref}
          hidden
          type="file"
          accept={accept}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) onPick(f.name)
            e.target.value = ''
          }}
        />
      </div>
    </Field>
  )
}

export default function CoraSettings() {
  const toast = useToast()
  const [cfg, setCfg] = useState<CoraConfig>(loadCoraConfig)
  const [env, setEnv] = useState<CoraEnv>(cfg.activeEnv)
  const [secret, setSecret] = useState('')
  const [testing, setTesting] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [invoice, setInvoice] = useState<null | { id: string; digitable: string; pix: string; due: string }>(null)

  const cred = cfg.credentials[env]
  const base = CORA_URLS[cfg.mode][env]
  const activeOk = credentialsComplete(cfg.mode, cfg.credentials[cfg.activeEnv])

  const patch = (p: Partial<CoraConfig>) => setCfg((c) => ({ ...c, ...p }))
  const patchCred = (p: Partial<CoraConfig['credentials'][CoraEnv]>) =>
    setCfg((c) => ({ ...c, credentials: { ...c.credentials, [env]: { ...c.credentials[env], ...p, lastTest: undefined } } }))
  const patchBilling = (p: Partial<CoraConfig['billing']>) => setCfg((c) => ({ ...c, billing: { ...c.billing, ...p } }))

  function missing() {
    const m: string[] = []
    if (!cred.clientId.trim()) m.push('client-id')
    if (cfg.mode === 'direta') {
      if (!cred.certificateFile) m.push('certificado')
      if (!cred.privateKeyFile) m.push('chave privada')
    } else if (!cred.clientSecretSet && !secret) m.push('client-secret')
    return m
  }

  function persist(next = cfg, msg = 'Configurações do Banco Cora salvas.') {
    saveCoraConfig(next)
    toast(msg)
  }

  function save() {
    let next = cfg
    if (cfg.mode === 'parceria' && secret) {
      next = { ...cfg, credentials: { ...cfg.credentials, [env]: { ...cred, clientSecretSet: true } } }
      setSecret('')
    }
    if (next.enabled && !credentialsComplete(next.mode, next.credentials[next.activeEnv])) {
      toast(`Credenciais de ${envLabel[next.activeEnv]} incompletas — a integração não poderá emitir cobranças.`, 'warning')
    }
    setCfg(next)
    persist(next)
  }

  function testConnection() {
    const m = missing()
    if (m.length) {
      const lastTest = { ok: false, at: new Date().toLocaleString('pt-BR'), message: `Faltando: ${m.join(', ')}` }
      setCfg((c) => ({ ...c, credentials: { ...c.credentials, [env]: { ...c.credentials[env], lastTest } } }))
      toast(`Não foi possível testar: faltando ${m.join(', ')}.`, 'warning')
      return
    }
    setTesting(true)
    setTimeout(() => {
      setTesting(false)
      const lastTest = {
        ok: true,
        at: new Date().toLocaleString('pt-BR'),
        message: 'Token obtido com sucesso (Bearer, expira em 24h).',
      }
      setCfg((c) => ({ ...c, credentials: { ...c.credentials, [env]: { ...c.credentials[env], lastTest } } }))
      toast(`Conexão com a Cora (${envLabel[env]}) validada.`)
    }, 1300)
  }

  function registerWebhook() {
    if (!activeOk) return toast('Configure e teste as credenciais do ambiente ativo antes de registrar o webhook.', 'warning')
    if (!/^https:\/\//.test(cfg.webhook.url)) return toast('A URL do webhook precisa usar HTTPS.', 'warning')
    if (!cfg.webhook.triggers.length) return toast('Selecione ao menos um evento.', 'warning')
    setRegistering(true)
    setTimeout(() => {
      setRegistering(false)
      const next = { ...cfg, webhook: { ...cfg.webhook, registeredAt: new Date().toLocaleString('pt-BR') } }
      setCfg(next)
      persist(next, `Webhook registrado na Cora para ${cfg.webhook.triggers.length} evento(s).`)
    }, 1100)
  }

  function testInvoice() {
    if (!cfg.enabled) return toast('Ative a integração para emitir uma cobrança de teste.', 'warning')
    if (!activeOk) return toast('Credenciais do ambiente ativo incompletas.', 'warning')
    const due = new Date(Date.now() + 3 * 86400000)
    const rnd = () => Math.floor(Math.random() * 1e5).toString().padStart(5, '0')
    setInvoice({
      id: `inv_${Math.random().toString(36).slice(2, 12)}`,
      due: due.toLocaleDateString('pt-BR'),
      digitable: `40390.00007 ${rnd()}.${rnd()}0 ${rnd()}.${rnd()}1 1 ${9800 + Math.floor(Math.random() * 99)}0000000500`,
      pix: `00020101021226930014br.gov.bcb.pix2571pix.cora.com.br/qr/v2/${Math.random().toString(36).slice(2, 14)}5204000053039865406500.005802BR`,
    })
  }

  return (
    <div className="space-y-5">
      {/* Status */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-4 bg-gradient-to-r from-[#fe3e6d]/10 to-transparent p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fe3e6d] text-lg font-extrabold text-white">C</div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-bold text-ink">Banco Cora</h3>
              {cfg.enabled ? (
                <Badge tone={activeOk ? 'green' : 'amber'} dot>
                  {activeOk ? `Ativo · ${envLabel[cfg.activeEnv]}` : 'Ativo · credenciais incompletas'}
                </Badge>
              ) : (
                <Badge tone="gray">Desativado</Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted">
              Emissão de boletos e Pix para cobrar as assinaturas dos escritórios, com baixa automática via webhook.
            </p>
          </div>
          <a
            href="https://developers.cora.com.br/docs/instrucoes-iniciais"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
          >
            Documentação <ExternalLink size={12} />
          </a>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            Integração ativa
            <Toggle checked={cfg.enabled} onChange={(v) => patch({ enabled: v })} />
          </div>
        </div>
      </Card>

      {/* Modalidade */}
      <Block icon={<Landmark size={18} />} title="Modalidade de integração" subtitle="Escolha conforme o tipo de credencial liberada pela Cora (Conta › Integrações via APIs)">
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              { key: 'direta', title: 'Integração Direta', desc: 'mTLS com client-id + certificado (.pem) + chave privada (.key). A conta Cora é da própria plataforma.' },
              { key: 'parceria', title: 'Parceria Cora', desc: 'client-id + client-secret de aplicação parceira, com escopo "invoice".' },
            ] as { key: CoraMode; title: string; desc: string }[]
          ).map((m) => (
            <button
              key={m.key}
              onClick={() => patch({ mode: m.key })}
              className={cn(
                'cursor-pointer rounded-xl border p-4 text-left transition',
                cfg.mode === m.key ? 'border-brand bg-brand/5 ring-2 ring-brand/15' : 'border-line hover:border-brand/30',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-ink">{m.title}</span>
                {cfg.mode === m.key && <CheckCircle2 size={16} className="text-brand" />}
              </div>
              <p className="mt-1 text-[11.5px] leading-snug text-muted">{m.desc}</p>
            </button>
          ))}
        </div>
      </Block>

      {/* Credenciais */}
      <Block
        icon={<KeyRound size={18} />}
        title="Credenciais"
        subtitle="Cada ambiente tem suas próprias credenciais — não misture stage e produção"
        right={
          <Field label="Ambiente em uso">
            <Select
              value={cfg.activeEnv}
              onChange={(v) => patch({ activeEnv: v as CoraEnv })}
              options={[
                { value: 'stage', label: 'Stage (homologação)' },
                { value: 'production', label: 'Produção' },
              ]}
            />
          </Field>
        }
      >
        <div className="flex gap-1 rounded-lg border border-line bg-slate-50 p-1">
          {(['stage', 'production'] as CoraEnv[]).map((e) => {
            const ok = credentialsComplete(cfg.mode, cfg.credentials[e])
            return (
              <button
                key={e}
                onClick={() => {
                  setEnv(e)
                  setSecret('')
                }}
                className={cn(
                  'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-[13px] font-semibold transition',
                  env === e ? 'bg-surface text-ink shadow-sm' : 'text-slate-500 hover:text-ink',
                )}
              >
                {envLabel[e]}
                <span className={cn('h-2 w-2 rounded-full', ok ? 'bg-emerald-500' : 'bg-slate-300')} />
              </button>
            )
          })}
        </div>

        <div className="grid gap-2 rounded-lg border border-line bg-slate-50 px-4 py-3 text-xs sm:grid-cols-2">
          <div>
            <p className="text-muted">URL base</p>
            <p className="mt-0.5 break-all font-mono text-ink">{base}</p>
          </div>
          <div>
            <p className="text-muted">Autenticação</p>
            <p className="mt-0.5 break-all font-mono text-ink">
              {cfg.mode === 'direta' ? `POST ${base}/token · client_credentials + mTLS` : 'OAuth da aplicação parceira (client-id/secret)'}
            </p>
          </div>
        </div>

        <Field label="Client ID" hint={cfg.mode === 'direta' ? 'Ex.: int-xxxxxxxx' : 'Ex.: app-sua-plataforma'}>
          <Input value={cred.clientId} onChange={(e) => patchCred({ clientId: e.target.value })} placeholder="client-id fornecido pela Cora" />
        </Field>

        {cfg.mode === 'direta' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <FilePick label="Certificado (.pem)" accept=".pem,.crt,.cer" file={cred.certificateFile} onPick={(n) => patchCred({ certificateFile: n })} />
            <FilePick label="Chave privada (.key)" accept=".key,.pem" file={cred.privateKeyFile} onPick={(n) => patchCred({ privateKeyFile: n })} />
          </div>
        ) : (
          <Field label="Client Secret" hint={cred.clientSecretSet ? 'Um secret já está salvo. Preencha apenas para substituir.' : undefined}>
            <Input
              type="password"
              autoComplete="new-password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder={cred.clientSecretSet ? '•••••••••••• (salvo)' : 'client-secret fornecido pela Cora'}
            />
          </Field>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            icon={testing ? <Loader2 size={14} className="animate-spin" /> : <PlugZap size={14} />}
            disabled={testing}
            onClick={testConnection}
          >
            {testing ? 'Testando…' : 'Testar conexão'}
          </Button>
          {cred.lastTest && (
            <span className={cn('flex items-center gap-1.5 text-xs', cred.lastTest.ok ? 'text-emerald-600' : 'text-red-600')}>
              {cred.lastTest.ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {cred.lastTest.message} <span className="text-muted">· {cred.lastTest.at}</span>
            </span>
          )}
        </div>

        <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11.5px] text-amber-800">
          <ShieldCheck size={14} className="mt-0.5 shrink-0" />
          Certificado, chave privada e client-secret são enviados apenas ao servidor e armazenados criptografados. Eles nunca são exibidos
          novamente nesta tela.
        </p>
      </Block>

      {/* Cobrança */}
      <Block icon={<Receipt size={18} />} title="Padrão das cobranças" subtitle="Aplicado aos boletos/Pix das assinaturas dos escritórios">
        <div className="flex flex-wrap gap-3">
          {(
            [
              ['BANK_SLIP', 'Boleto'],
              ['PIX', 'Pix (requer chave Pix na conta Cora)'],
            ] as const
          ).map(([k, l]) => (
            <label key={k} className="flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-2 text-[13px]">
              <input
                type="checkbox"
                className="accent-[var(--brand)]"
                checked={cfg.billing.paymentForms[k]}
                onChange={(e) => patchBilling({ paymentForms: { ...cfg.billing.paymentForms, [k]: e.target.checked } })}
              />
              {l}
            </label>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Dia de vencimento">
            <Input type="number" min={1} max={28} value={cfg.billing.dueDay} onChange={(e) => patchBilling({ dueDay: Number(e.target.value) })} />
          </Field>
          <Field label="Multa (%)" hint="payment_terms.fine.rate">
            <Input type="number" min={0} max={100} step={0.01} value={cfg.billing.finePercent} onChange={(e) => patchBilling({ finePercent: Number(e.target.value) })} />
          </Field>
          <Field label="Juros (% ao mês)" hint="payment_terms.interest.rate">
            <Input
              type="number"
              min={0}
              max={100}
              step={0.01}
              value={cfg.billing.interestPercent}
              onChange={(e) => patchBilling({ interestPercent: Number(e.target.value) })}
            />
          </Field>
          <Field label="Desconto até o vencimento">
            <Select
              value={cfg.billing.discountType}
              onChange={(v) => patchBilling({ discountType: v as CoraConfig['billing']['discountType'] })}
              className="h-10 w-full"
              options={[
                { value: 'NONE', label: 'Sem desconto' },
                { value: 'PERCENT', label: 'Percentual (%)' },
                { value: 'FIXED', label: 'Valor fixo (R$)' },
              ]}
            />
          </Field>
          {cfg.billing.discountType !== 'NONE' && (
            <Field label={cfg.billing.discountType === 'PERCENT' ? 'Desconto (%)' : 'Desconto (R$)'}>
              <Input type="number" min={0} step={0.01} value={cfg.billing.discountValue} onChange={(e) => patchBilling({ discountValue: Number(e.target.value) })} />
            </Field>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-slate-600">Notificações enviadas pela Cora ao escritório</p>
          <div className="mb-3 flex flex-wrap gap-4 text-[13px]">
            <label className="flex items-center gap-2">
              <Toggle checked={cfg.billing.notifyEmail} onChange={(v) => patchBilling({ notifyEmail: v })} /> E-mail
            </label>
            <label className="flex items-center gap-2">
              <Toggle checked={cfg.billing.notifySms} onChange={(v) => patchBilling({ notifySms: v })} /> SMS <Badge tone="gray">Cora Pro</Badge>
            </label>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {NOTIFICATION_RULES.map((r) => (
              <label key={r.key} className="flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-2 text-[12.5px]">
                <input
                  type="checkbox"
                  className="accent-[var(--brand)]"
                  checked={cfg.billing.rules.includes(r.key)}
                  onChange={(e) =>
                    patchBilling({ rules: e.target.checked ? [...cfg.billing.rules, r.key] : cfg.billing.rules.filter((x) => x !== r.key) })
                  }
                />
                {r.label}
              </label>
            ))}
          </div>
        </div>
      </Block>

      {/* Webhook */}
      <Block
        icon={<Webhook size={18} />}
        title="Webhook de baixa automática"
        subtitle="A Cora avisa a plataforma quando um boleto é pago, vence ou é cancelado"
        right={cfg.webhook.registeredAt ? <Badge tone="green">Registrado {cfg.webhook.registeredAt}</Badge> : <Badge tone="gray">Não registrado</Badge>}
      >
        <Field label="URL de recebimento (HTTPS)">
          <Input value={cfg.webhook.url} onChange={(e) => patch({ webhook: { ...cfg.webhook, url: e.target.value, registeredAt: undefined } })} />
        </Field>
        <div className="grid gap-2 sm:grid-cols-2">
          {WEBHOOK_TRIGGERS.map((t) => (
            <label key={t.key} className="flex cursor-pointer items-start gap-2 rounded-lg border border-line px-3 py-2">
              <input
                type="checkbox"
                className="mt-0.5 accent-[var(--brand)]"
                checked={cfg.webhook.triggers.includes(t.key)}
                onChange={(e) =>
                  patch({
                    webhook: {
                      ...cfg.webhook,
                      registeredAt: undefined,
                      triggers: e.target.checked ? [...cfg.webhook.triggers, t.key] : cfg.webhook.triggers.filter((x) => x !== t.key),
                    },
                  })
                }
              />
              <span>
                <span className="block font-mono text-[12px] text-ink">{t.label}</span>
                <span className="text-[11px] text-muted">{t.desc}</span>
              </span>
            </label>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            icon={registering ? <Loader2 size={14} className="animate-spin" /> : <Webhook size={14} />}
            disabled={registering}
            onClick={registerWebhook}
          >
            {registering ? 'Registrando…' : 'Registrar webhook na Cora'}
          </Button>
          <Button variant="secondary" icon={<Receipt size={14} />} onClick={testInvoice}>
            Emitir boleto de teste (R$ 5,00)
          </Button>
        </div>
      </Block>

      <p className="flex items-start gap-2 text-[11.5px] text-muted">
        <Info size={14} className="mt-0.5 shrink-0" />
        Protótipo: as chamadas à API da Cora (token, emissão e webhook) são simuladas. A conexão real será feita pelo backend, que é quem
        guarda as credenciais.
      </p>

      <div className="flex justify-end">
        <Button size="lg" icon={<Save size={16} />} onClick={save}>
          Salvar integração Cora
        </Button>
      </div>

      <Modal
        open={!!invoice}
        onClose={() => setInvoice(null)}
        title="Boleto de teste emitido"
        subtitle={`Ambiente: ${envLabel[cfg.activeEnv]} · simulação`}
        footer={<Button onClick={() => setInvoice(null)}>Fechar</Button>}
      >
        {invoice && (
          <div className="space-y-4">
            <div>
              <InfoRow label="ID da fatura" value={<span className="font-mono">{invoice.id}</span>} />
              <InfoRow label="Status" value={<Badge tone="blue">OPEN</Badge>} />
              <InfoRow label="Valor" value="R$ 5,00" />
              <InfoRow label="Vencimento" value={invoice.due} />
            </div>
            {[
              ['Linha digitável', invoice.digitable],
              ['Pix copia e cola', invoice.pix],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="mb-1 text-xs font-semibold text-slate-600">{l}</p>
                <div className="flex items-center gap-2 rounded-lg border border-line bg-slate-50 px-3 py-2">
                  <span className="flex-1 break-all font-mono text-[11px] text-ink">{v}</span>
                  <button
                    className="cursor-pointer text-muted hover:text-brand"
                    onClick={async () => {
                      await copyText(v)
                      toast(`${l} copiado.`)
                    }}
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
