import { useState } from 'react'
import {
  KeyRound,
  FileText,
  Building2,
  Webhook,
  PlugZap,
  Save,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Plus,
  Trash2,
  Info,
} from 'lucide-react'
import { Badge, Button, Card, EmptyRow, Field, Input, Modal, Select, Table, Td, Toggle } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { cn } from '../../lib/utils'
import {
  SPEDY_URLS,
  SPEDY_WEBHOOK_EVENTS,
  TAX_REGIMES,
  loadSpedyConfig,
  nfseEnvLabel,
  saveSpedyConfig,
  type NfseEnvironment,
  type SpedyCompany,
  type SpedyConfig,
  type SpedyEnv,
} from '../../lib/spedy'
import { offices } from './data'
import { Block, FilePick } from './CoraSettings'

const envLabel: Record<SpedyEnv, string> = { sandbox: 'Sandbox (testes)', production: 'Produção' }

const emptyCompany = {
  legalName: '',
  name: '',
  federalTaxNumber: '',
  cityTaxNumber: '',
  taxRegime: 'simplesNacional',
  cityCode: '',
  cityName: '',
  office: offices[0].name,
  certificateFile: '',
  certificatePassword: '',
}

export default function SpedySettings() {
  const toast = useToast()
  const [cfg, setCfg] = useState<SpedyConfig>(loadSpedyConfig)
  const [key, setKey] = useState('')
  const [testing, setTesting] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [form, setForm] = useState(emptyCompany)
  const [creating, setCreating] = useState(false)

  const keySet = cfg.ownerKeySet[cfg.env]
  const patch = (p: Partial<SpedyConfig>) => setCfg((c) => ({ ...c, ...p }))

  function persist(next: SpedyConfig, msg = 'Configurações da Spedy salvas.') {
    setCfg(next)
    saveSpedyConfig(next)
    toast(msg)
  }

  function save() {
    let next = cfg
    if (key) {
      next = { ...cfg, ownerKeySet: { ...cfg.ownerKeySet, [cfg.env]: true }, lastTest: undefined }
      setKey('')
    }
    if (next.enabled && !next.ownerKeySet[next.env]) toast(`Informe a chave de API de ${envLabel[next.env]}.`, 'warning')
    if (next.env === 'production' && next.nfse.environmentType !== 'production')
      toast('Atenção: conta em Produção, mas as NFS-e estão configuradas para ' + nfseEnvLabel[next.nfse.environmentType] + '.', 'info')
    persist(next)
  }

  function testConnection() {
    if (!keySet && !key) {
      patch({ lastTest: { ok: false, at: new Date().toLocaleString('pt-BR'), message: 'Chave de API não informada.' } })
      return toast('Informe a chave de API da empresa titular.', 'warning')
    }
    setTesting(true)
    setTimeout(() => {
      setTesting(false)
      patch({
        lastTest: {
          ok: true,
          at: new Date().toLocaleString('pt-BR'),
          message: `GET /companies respondeu 200 · ${cfg.companies.length} empresa(s) na conta.`,
        },
      })
      toast(`Conexão com a Spedy (${envLabel[cfg.env]}) validada.`)
    }, 1200)
  }

  function registerWebhook() {
    if (!keySet) return toast('Salve a chave de API antes de registrar o webhook.', 'warning')
    if (!/^https:\/\//.test(cfg.webhook.url)) return toast('A URL do webhook precisa usar HTTPS.', 'warning')
    if (!cfg.webhook.events.length) return toast('Selecione ao menos um evento.', 'warning')
    setRegistering(true)
    setTimeout(() => {
      setRegistering(false)
      persist(
        { ...cfg, webhook: { ...cfg.webhook, registeredAt: new Date().toLocaleString('pt-BR') } },
        `${cfg.webhook.events.length} webhook(s) registrado(s) na Spedy (um por evento).`,
      )
    }, 1000)
  }

  function createCompany() {
    const digits = form.federalTaxNumber.replace(/\D/g, '')
    if (!form.legalName.trim() || !form.name.trim()) return toast('Informe razão social e nome fantasia.', 'warning')
    if (digits.length !== 14) return toast('CNPJ inválido — informe os 14 dígitos.', 'warning')
    if (!/^\d{7}$/.test(form.cityCode)) return toast('Código IBGE do município deve ter 7 dígitos.', 'warning')
    if (form.certificateFile && !form.certificatePassword) return toast('Informe a senha do certificado A1.', 'warning')
    if (!keySet) return toast('Configure a chave da empresa titular antes de cadastrar emissores.', 'warning')
    setCreating(true)
    setTimeout(() => {
      setCreating(false)
      const company: SpedyCompany = {
        id: 'cmp_' + Math.random().toString(36).slice(2, 8),
        legalName: form.legalName,
        name: form.name,
        federalTaxNumber: digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5'),
        cityTaxNumber: form.cityTaxNumber,
        taxRegime: form.taxRegime,
        cityCode: form.cityCode,
        cityName: form.cityName || form.cityCode,
        office: form.office,
        certificateFile: form.certificateFile || undefined,
        certificateExpiresAt: form.certificateFile ? new Date(Date.now() + 365 * 86400000).toLocaleDateString('pt-BR') : undefined,
        apiKeyMasked: `sk_${cfg.env === 'production' ? 'live' : 'test'}_••••••••${Math.random().toString(16).slice(2, 6)}`,
        status: form.certificateFile ? 'Ativa' : 'Sem certificado',
      }
      persist({ ...cfg, companies: [company, ...cfg.companies] }, `${company.name} cadastrada na Spedy. Chave da empresa gerada e armazenada no servidor.`)
      setCompanyOpen(false)
      setForm(emptyCompany)
    }, 1100)
  }

  function removeCompany(c: SpedyCompany) {
    if (!confirm(`Remover ${c.name} da Spedy? As notas já emitidas continuam válidas.`)) return
    persist({ ...cfg, companies: cfg.companies.filter((x) => x.id !== c.id) }, `${c.name} removida da Spedy.`, )
  }

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-4 bg-gradient-to-r from-[#00b37e]/10 to-transparent p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00b37e] text-white">
            <FileText size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-bold text-ink">Spedy — Emissão de NFS-e</h3>
              {cfg.enabled ? (
                <Badge tone={keySet ? 'green' : 'amber'} dot>
                  {keySet ? `Ativo · ${envLabel[cfg.env]}` : 'Ativo · chave pendente'}
                </Badge>
              ) : (
                <Badge tone="gray">Desativado</Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted">
              Emissão, consulta, cancelamento e download (PDF/XML) de notas fiscais de serviço dos clientes dos escritórios.
            </p>
          </div>
          <a
            href="https://docs.spedy.com.br"
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

      <Block
        icon={<KeyRound size={18} />}
        title="Conta Spedy (empresa titular)"
        subtitle="A chave da empresa titular é a única que cadastra e gerencia as empresas emissoras"
        right={
          <Field label="Ambiente da conta">
            <Select
              value={cfg.env}
              onChange={(v) => {
                patch({ env: v as SpedyEnv, lastTest: undefined })
                setKey('')
              }}
              options={[
                { value: 'sandbox', label: 'Sandbox (testes)' },
                { value: 'production', label: 'Produção' },
              ]}
            />
          </Field>
        }
      >
        <div className="grid gap-2 rounded-lg border border-line bg-slate-50 px-4 py-3 text-xs sm:grid-cols-2">
          <div>
            <p className="text-muted">URL base</p>
            <p className="mt-0.5 break-all font-mono text-ink">{SPEDY_URLS[cfg.env]}</p>
          </div>
          <div>
            <p className="text-muted">Autenticação</p>
            <p className="mt-0.5 font-mono text-ink">Header X-Api-Key</p>
          </div>
        </div>
        <Field
          label={`Chave de API — ${envLabel[cfg.env]}`}
          hint="Spedy › menu do perfil › Minha empresa › Credenciais de API. Chaves de sandbox e produção são diferentes."
        >
          <Input
            type="password"
            autoComplete="new-password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={keySet ? '•••••••••••••••• (salva — preencha só para substituir)' : 'Cole a chave da empresa titular'}
          />
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            icon={testing ? <Loader2 size={14} className="animate-spin" /> : <PlugZap size={14} />}
            disabled={testing}
            onClick={testConnection}
          >
            {testing ? 'Testando…' : 'Testar conexão'}
          </Button>
          {cfg.lastTest && (
            <span className={cn('flex items-center gap-1.5 text-xs', cfg.lastTest.ok ? 'text-emerald-600' : 'text-red-600')}>
              {cfg.lastTest.ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {cfg.lastTest.message} <span className="text-muted">· {cfg.lastTest.at}</span>
            </span>
          )}
        </div>
      </Block>

      <Block icon={<FileText size={18} />} title="Padrão de emissão de NFS-e" subtitle="Aplicado ao cadastrar novas empresas emissoras (settings.serviceInvoice)">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Ambiente das notas" hint={cfg.nfse.environmentType === 'simulation' ? 'Simulação não valida a tributação real.' : undefined}>
            <Select
              value={cfg.nfse.environmentType}
              onChange={(v) => patch({ nfse: { ...cfg.nfse, environmentType: v as NfseEnvironment } })}
              className="h-10 w-full"
              options={[
                { value: 'simulation', label: 'Simulação' },
                { value: 'homologation', label: 'Homologação' },
                { value: 'production', label: 'Produção (validade fiscal)' },
              ]}
            />
          </Field>
          <Field label="Série do RPS">
            <Input value={cfg.nfse.series} onChange={(e) => patch({ nfse: { ...cfg.nfse, series: e.target.value } })} />
          </Field>
          <Field label="Alíquota ISS padrão (%)">
            <Input
              type="number"
              min={0}
              max={5}
              step={0.01}
              value={cfg.nfse.defaultIssRate}
              onChange={(e) => patch({ nfse: { ...cfg.nfse, defaultIssRate: Number(e.target.value) } })}
            />
          </Field>
        </div>
        <label className="flex items-center gap-3 text-[13px]">
          <Toggle checked={cfg.nfse.sendEmailToReceiver} onChange={(v) => patch({ nfse: { ...cfg.nfse, sendEmailToReceiver: v } })} />
          Enviar a nota por e-mail ao tomador após a autorização
        </label>
        {cfg.env === 'production' && cfg.nfse.environmentType === 'production' && (
          <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[11.5px] text-red-600">
            <Info size={14} className="mt-0.5 shrink-0" /> Notas emitidas neste modo têm validade fiscal.
          </p>
        )}
      </Block>

      <Block
        icon={<Building2 size={18} />}
        title="Empresas emissoras"
        subtitle="Clientes PJ cadastrados na Spedy — cada um recebe uma chave própria para emitir as notas do seu CNPJ"
        right={
          <Button size="sm" icon={<Plus size={14} />} onClick={() => setCompanyOpen(true)}>
            Cadastrar empresa
          </Button>
        }
      >
        <div className="-mx-5">
          <Table head={['Empresa', 'CNPJ', 'Município', 'Escritório', 'Certificado A1', 'Chave', 'Ações']}>
            {cfg.companies.length === 0 && <EmptyRow cols={7} text="Nenhuma empresa emissora cadastrada." />}
            {cfg.companies.map((c) => (
              <tr key={c.id}>
                <Td>
                  <p className="whitespace-nowrap font-semibold text-ink">{c.name}</p>
                  <p className="text-[11px] text-muted">{TAX_REGIMES.find((r) => r.value === c.taxRegime)?.label}</p>
                </Td>
                <Td className="num whitespace-nowrap text-[12px] text-ink">{c.federalTaxNumber}</Td>
                <Td className="whitespace-nowrap">{c.cityName}</Td>
                <Td className="whitespace-nowrap text-xs">{c.office}</Td>
                <Td>
                  {c.certificateFile ? (
                    <Badge tone="green">válido até {c.certificateExpiresAt}</Badge>
                  ) : (
                    <Badge tone="amber">Sem certificado</Badge>
                  )}
                </Td>
                <Td className="font-mono text-[11px]">{c.apiKeyMasked}</Td>
                <Td right>
                  <button title="Remover" onClick={() => removeCompany(c)} className="cursor-pointer text-slate-400 hover:text-red-500">
                    <Trash2 size={15} />
                  </button>
                </Td>
              </tr>
            ))}
          </Table>
        </div>
      </Block>

      <Block
        icon={<Webhook size={18} />}
        title="Webhook de retorno"
        subtitle="A Spedy avisa quando a nota é autorizada, rejeitada ou cancelada (vale para todas as empresas da conta)"
        right={cfg.webhook.registeredAt ? <Badge tone="green">Registrado {cfg.webhook.registeredAt}</Badge> : <Badge tone="gray">Não registrado</Badge>}
      >
        <Field label="URL de recebimento (HTTPS)">
          <Input value={cfg.webhook.url} onChange={(e) => patch({ webhook: { ...cfg.webhook, url: e.target.value, registeredAt: undefined } })} />
        </Field>
        <div className="grid gap-2 sm:grid-cols-2">
          {SPEDY_WEBHOOK_EVENTS.map((ev) => (
            <label key={ev.key} className="flex cursor-pointer items-start gap-2 rounded-lg border border-line px-3 py-2">
              <input
                type="checkbox"
                className="mt-0.5 accent-[var(--brand)]"
                checked={cfg.webhook.events.includes(ev.key)}
                onChange={(e) =>
                  patch({
                    webhook: {
                      ...cfg.webhook,
                      registeredAt: undefined,
                      events: e.target.checked ? [...cfg.webhook.events, ev.key] : cfg.webhook.events.filter((x) => x !== ev.key),
                    },
                  })
                }
              />
              <span>
                <span className="block font-mono text-[12px] text-ink">{ev.key}</span>
                <span className="text-[11px] text-muted">{ev.desc}</span>
              </span>
            </label>
          ))}
        </div>
        <p className="text-[11px] text-muted">
          Os eventos são assinados (header <span className="font-mono">webhook-signature</span>). Após 5 falhas seguidas a Spedy desativa o
          webhook.
        </p>
        <Button
          variant="outline"
          icon={registering ? <Loader2 size={14} className="animate-spin" /> : <Webhook size={14} />}
          disabled={registering}
          onClick={registerWebhook}
        >
          {registering ? 'Registrando…' : 'Registrar webhooks na Spedy'}
        </Button>
      </Block>

      <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11.5px] text-amber-800">
        <ShieldCheck size={14} className="mt-0.5 shrink-0" />
        As chaves de API, os certificados A1 e as senhas ficam somente no servidor, criptografados. Protótipo: as chamadas à Spedy são simuladas.
      </p>

      <div className="flex justify-end">
        <Button size="lg" icon={<Save size={16} />} onClick={save}>
          Salvar integração Spedy
        </Button>
      </div>

      <Modal
        open={companyOpen}
        onClose={() => setCompanyOpen(false)}
        width="max-w-2xl"
        title="Cadastrar empresa emissora"
        subtitle="POST /companies + envio do certificado A1 — a Spedy devolve a chave de API desta empresa"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCompanyOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={createCompany} disabled={creating} icon={creating ? <Loader2 size={14} className="animate-spin" /> : undefined}>
              {creating ? 'Cadastrando…' : 'Cadastrar na Spedy'}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Razão social" className="sm:col-span-2">
            <Input value={form.legalName} maxLength={80} onChange={(e) => setForm({ ...form, legalName: e.target.value })} />
          </Field>
          <Field label="Nome fantasia">
            <Input value={form.name} maxLength={80} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="CNPJ">
            <Input value={form.federalTaxNumber} onChange={(e) => setForm({ ...form, federalTaxNumber: e.target.value })} placeholder="00.000.000/0000-00" />
          </Field>
          <Field label="Inscrição municipal">
            <Input value={form.cityTaxNumber} maxLength={20} onChange={(e) => setForm({ ...form, cityTaxNumber: e.target.value })} />
          </Field>
          <Field label="Regime tributário">
            <Select value={form.taxRegime} onChange={(v) => setForm({ ...form, taxRegime: v })} options={TAX_REGIMES} className="h-10 w-full" />
          </Field>
          <Field label="Código IBGE do município" hint="Ex.: 3550308 (São Paulo). A Spedy informa se o município é atendido.">
            <Input value={form.cityCode} maxLength={7} onChange={(e) => setForm({ ...form, cityCode: e.target.value.replace(/\D/g, '') })} />
          </Field>
          <Field label="Município / UF">
            <Input value={form.cityName} onChange={(e) => setForm({ ...form, cityName: e.target.value })} placeholder="São Paulo/SP" />
          </Field>
          <Field label="Escritório responsável" className="sm:col-span-2">
            <Select value={form.office} onChange={(v) => setForm({ ...form, office: v })} options={offices.map((o) => o.name)} className="h-10 w-full" />
          </Field>
          <div className="sm:col-span-2">
            <FilePick label="Certificado digital A1 (.pfx)" accept=".pfx,.p12" file={form.certificateFile || undefined} onPick={(n) => setForm({ ...form, certificateFile: n })} />
          </div>
          {form.certificateFile && (
            <Field label="Senha do certificado">
              <Input type="password" autoComplete="new-password" value={form.certificatePassword} onChange={(e) => setForm({ ...form, certificatePassword: e.target.value })} />
            </Field>
          )}
        </div>
      </Modal>
    </div>
  )
}
