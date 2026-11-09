/**
 * Configuração da integração com o Banco Cora (cobrança das assinaturas dos escritórios).
 * Referência: https://developers.cora.com.br/docs/instrucoes-iniciais
 *
 * IMPORTANTE: neste protótipo a configuração é guardada no navegador SEM o conteúdo do certificado,
 * da chave privada ou do client-secret (só nomes de arquivo / indicação de que foram informados).
 * Em produção esses segredos devem ser enviados ao backend, criptografados, e nunca voltar ao front-end.
 */

export type CoraEnv = 'stage' | 'production'
export type CoraMode = 'direta' | 'parceria'

export type CoraCredentials = {
  clientId: string
  /** Integração Direta (mTLS) */
  certificateFile?: string
  privateKeyFile?: string
  /** Parceria Cora */
  clientSecretSet?: boolean
  lastTest?: { ok: boolean; at: string; message: string }
}

export type CoraConfig = {
  enabled: boolean
  mode: CoraMode
  activeEnv: CoraEnv
  credentials: Record<CoraEnv, CoraCredentials>
  billing: {
    paymentForms: { BANK_SLIP: boolean; PIX: boolean }
    dueDay: number
    finePercent: number
    interestPercent: number
    discountType: 'NONE' | 'FIXED' | 'PERCENT'
    discountValue: number
    notifyEmail: boolean
    notifySms: boolean
    rules: string[]
  }
  webhook: {
    url: string
    triggers: string[]
    registeredAt?: string
  }
}

export const CORA_URLS: Record<CoraMode, Record<CoraEnv, string>> = {
  direta: {
    stage: 'https://matls-clients.api.stage.cora.com.br',
    production: 'https://matls-clients.api.cora.com.br',
  },
  parceria: {
    stage: 'https://api.stage.cora.com.br',
    production: 'https://api.cora.com.br',
  },
}

export const NOTIFICATION_RULES = [
  { key: 'NOTIFY_TWO_DAYS_BEFORE_DUE_DATE', label: '2 dias antes do vencimento' },
  { key: 'NOTIFY_ON_DUE_DATE', label: 'No dia do vencimento' },
  { key: 'NOTIFY_TWO_DAYS_AFTER_DUE_DATE', label: '2 dias após o vencimento' },
  { key: 'NOTIFY_WHEN_PAID', label: 'Quando o pagamento for confirmado' },
]

export const WEBHOOK_TRIGGERS = [
  { key: 'created', label: 'invoice.created', desc: 'Boleto emitido (OPEN)' },
  { key: 'paid', label: 'invoice.paid', desc: 'Pagamento confirmado' },
  { key: 'overdue', label: 'invoice.overdue', desc: 'Boleto vencido (LATE)' },
  { key: 'canceled', label: 'invoice.canceled', desc: 'Boleto cancelado' },
]

export const defaultCoraConfig: CoraConfig = {
  enabled: false,
  mode: 'direta',
  activeEnv: 'stage',
  credentials: {
    stage: { clientId: '' },
    production: { clientId: '' },
  },
  billing: {
    paymentForms: { BANK_SLIP: true, PIX: true },
    dueDay: 10,
    finePercent: 2,
    interestPercent: 1,
    discountType: 'NONE',
    discountValue: 0,
    notifyEmail: true,
    notifySms: false,
    rules: ['NOTIFY_TWO_DAYS_BEFORE_DUE_DATE', 'NOTIFY_ON_DUE_DATE', 'NOTIFY_WHEN_PAID'],
  },
  webhook: {
    url: 'https://api.hubcontabil.com.br/webhooks/cora',
    triggers: ['created', 'paid', 'overdue', 'canceled'],
  },
}

const KEY = 'hub.cora'

export function loadCoraConfig(): CoraConfig {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (saved) return { ...defaultCoraConfig, ...saved, billing: { ...defaultCoraConfig.billing, ...saved.billing } }
  } catch {}
  return defaultCoraConfig
}

export function saveCoraConfig(cfg: CoraConfig) {
  try {
    localStorage.setItem(KEY, JSON.stringify(cfg))
  } catch {}
}

/** Credenciais mínimas para cada modalidade estão preenchidas? */
export function credentialsComplete(mode: CoraMode, c: CoraCredentials) {
  if (!c.clientId.trim()) return false
  return mode === 'direta' ? !!c.certificateFile && !!c.privateKeyFile : !!c.clientSecretSet
}
