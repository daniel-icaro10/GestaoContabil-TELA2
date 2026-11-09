/**
 * Integração de emissão de NFS-e via Spedy.
 * Referência: https://docs.spedy.com.br (autenticação por header X-Api-Key)
 *
 * Modelo:
 *  - O Super Admin guarda a chave da EMPRESA TITULAR da conta Spedy (única que gerencia /v1/companies).
 *  - Cada cliente emissor é cadastrado via POST /v1/companies e recebe uma chave própria (apiCredentials.apiKey),
 *    usada para emitir as notas daquele CNPJ (POST /v1/service-invoices).
 *  - A autorização é assíncrona (status enqueued → authorized/rejected), com retorno por webhook.
 *
 * IMPORTANTE: neste protótipo nenhuma chave, certificado ou senha é guardada no navegador — apenas a
 * indicação de que foi informada. Em produção tudo isso fica no backend, criptografado.
 */

export type SpedyEnv = 'sandbox' | 'production'
export type NfseEnvironment = 'simulation' | 'homologation' | 'production'

export const SPEDY_URLS: Record<SpedyEnv, string> = {
  sandbox: 'https://sandbox-api.spedy.com.br/v1',
  production: 'https://api.spedy.com.br/v1',
}

export const SPEDY_WEBHOOK_EVENTS = [
  { key: 'invoice.status_changed', desc: 'Qualquer mudança de status (ciclo completo)' },
  { key: 'invoice.authorized', desc: 'Nota autorizada pela prefeitura' },
  { key: 'invoice.rejected', desc: 'Nota rejeitada' },
  { key: 'invoice.canceled', desc: 'Nota cancelada' },
]

export const TAX_REGIMES = [
  { value: 'simplesNacional', label: 'Simples Nacional' },
  { value: 'simplesNacionalMEI', label: 'Simples Nacional — MEI' },
  { value: 'simplesNacionalExcessoSublimite', label: 'Simples Nacional — excesso de sublimite' },
  { value: 'regimeNormal', label: 'Regime Normal (Lucro Presumido / Real)' },
]

export type SpedyCompany = {
  id: string
  legalName: string
  name: string
  federalTaxNumber: string
  cityTaxNumber: string
  taxRegime: string
  cityCode: string
  cityName: string
  office: string
  certificateFile?: string
  certificateExpiresAt?: string
  apiKeyMasked: string
  status: 'Ativa' | 'Sem certificado'
}

export type SpedyConfig = {
  enabled: boolean
  env: SpedyEnv
  ownerKeySet: Record<SpedyEnv, boolean>
  lastTest?: { ok: boolean; at: string; message: string }
  nfse: {
    environmentType: NfseEnvironment
    series: string
    sendEmailToReceiver: boolean
    defaultIssRate: number
  }
  webhook: { url: string; events: string[]; registeredAt?: string }
  companies: SpedyCompany[]
}

export const defaultSpedyConfig: SpedyConfig = {
  enabled: false,
  env: 'sandbox',
  ownerKeySet: { sandbox: false, production: false },
  nfse: { environmentType: 'simulation', series: '1', sendEmailToReceiver: true, defaultIssRate: 5 },
  webhook: { url: 'https://api.hubcontabil.com.br/webhooks/spedy', events: ['invoice.status_changed'] },
  companies: [
    {
      id: 'cmp_7f3a91',
      legalName: 'Tech Founders Ltda',
      name: 'Tech Founders',
      federalTaxNumber: '12.345.678/0001-90',
      cityTaxNumber: '98765432',
      taxRegime: 'simplesNacional',
      cityCode: '3550308',
      cityName: 'São Paulo/SP',
      office: 'Contador Central Assessoria',
      certificateFile: 'tech-founders-a1.pfx',
      certificateExpiresAt: '18/11/2026',
      apiKeyMasked: 'sk_live_••••••••3f9a',
      status: 'Ativa',
    },
  ],
}

const KEY = 'hub.spedy'

export function loadSpedyConfig(): SpedyConfig {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (saved) return { ...defaultSpedyConfig, ...saved, nfse: { ...defaultSpedyConfig.nfse, ...saved.nfse } }
  } catch {}
  return defaultSpedyConfig
}

export function saveSpedyConfig(cfg: SpedyConfig) {
  try {
    localStorage.setItem(KEY, JSON.stringify(cfg))
  } catch {}
}

export function spedyReady(cfg = loadSpedyConfig()) {
  return cfg.enabled && cfg.ownerKeySet[cfg.env]
}

/**
 * Simula o POST /v1/service-invoices: a nota entra na fila (enqueued) e a confirmação da prefeitura
 * chega depois, como faria o webhook invoice.status_changed. Retorna false se a integração não estiver pronta.
 * Em produção esta chamada é feita pelo backend, com a chave da empresa emissora.
 */
export function enviarNfseSpedy(onAutorizada: () => void): boolean {
  if (!spedyReady()) return false
  setTimeout(onAutorizada, 2500)
  return true
}

export const nfseEnvLabel: Record<NfseEnvironment, string> = {
  simulation: 'Simulação',
  homologation: 'Homologação',
  production: 'Produção',
}
