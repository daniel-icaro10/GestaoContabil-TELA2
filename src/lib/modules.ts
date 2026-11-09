import { useEffect, useState } from 'react'

/**
 * Catálogo de módulos da plataforma.
 * O Super Admin define quais módulos cada escritório tem; o padrão vem do plano contratado.
 * Cada módulo libera telas no Portal do Escritório e/ou nos portais dos clientes (PJ / PF).
 */
export type ModuleKey =
  | 'equipe'
  | 'dp'
  | 'tributos'
  | 'notas'
  | 'documentos'
  | 'solicitacoes'
  | 'financeiro'
  | 'relatorios'
  | 'whitelabel'
  | 'societario'
  | 'certificado'
  | 'portal_pf'
  | 'irpf'
  | 'api'

export type ModuleDef = {
  key: ModuleKey
  label: string
  desc: string
  group: 'Operação do Escritório' | 'Portal dos Clientes' | 'Avançado'
}

export const MODULES: ModuleDef[] = [
  { key: 'tributos', label: 'Tributos & Obrigações', desc: 'Guias, vencimentos e calendário fiscal (Escritório, PJ e PF)', group: 'Operação do Escritório' },
  { key: 'notas', label: 'Notas Fiscais', desc: 'Emissão e gestão de NFS-e / NF-e', group: 'Operação do Escritório' },
  { key: 'documentos', label: 'Documentos', desc: 'Cofre de documentos e uploads dos clientes', group: 'Operação do Escritório' },
  { key: 'solicitacoes', label: 'Solicitações', desc: 'Central de atendimento e tickets', group: 'Operação do Escritório' },
  { key: 'financeiro', label: 'Financeiro', desc: 'Honorários, faturas e inadimplência', group: 'Operação do Escritório' },
  { key: 'equipe', label: 'Equipe', desc: 'Membros do escritório e atribuições', group: 'Operação do Escritório' },
  { key: 'dp', label: 'Departamento Pessoal', desc: 'Folha, admissões, rescisões e eSocial', group: 'Operação do Escritório' },
  { key: 'relatorios', label: 'Relatórios', desc: 'Relatórios gerenciais e exportações', group: 'Operação do Escritório' },
  { key: 'societario', label: 'Societário', desc: 'Quadro de sócios e alterações contratuais (PJ)', group: 'Portal dos Clientes' },
  { key: 'certificado', label: 'Certificado Digital', desc: 'Gestão e renovação de certificados ICP-Brasil (PJ)', group: 'Portal dos Clientes' },
  { key: 'portal_pf', label: 'Portal Pessoa Física', desc: 'Acesso de clientes pessoa física', group: 'Portal dos Clientes' },
  { key: 'irpf', label: 'Imposto de Renda (IRPF)', desc: 'Declarações e acompanhamento de IRPF (PF)', group: 'Portal dos Clientes' },
  { key: 'whitelabel', label: 'White-label', desc: 'Marca, cores e domínio próprio do escritório', group: 'Avançado' },
  { key: 'api', label: 'API de Integração', desc: 'Acesso à API e webhooks da plataforma', group: 'Avançado' },
]

export type PlanName = 'Essencial' | 'Profissional' | 'Premium'

/** Módulos incluídos em cada plano (padrão quando o escritório não tem configuração própria). */
export const PLAN_MODULES: Record<PlanName, ModuleKey[]> = {
  Essencial: ['tributos', 'notas', 'documentos', 'solicitacoes', 'financeiro'],
  Profissional: ['tributos', 'notas', 'documentos', 'solicitacoes', 'financeiro', 'equipe', 'dp', 'relatorios', 'societario', 'certificado', 'whitelabel'],
  Premium: MODULES.map((m) => m.key),
}

/** Escritório usado pelo Portal do Escritório / clientes nesta demonstração. */
export const CURRENT_OFFICE = { id: 11, plan: 'Profissional' as PlanName }

const KEY = 'hub.modules'
const EVENT = 'hub:modules'

type Store = Record<string, ModuleKey[]>

function read(): Store {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}')
  } catch {
    return {}
  }
}

/** Módulos ativos de um escritório (configuração própria ou padrão do plano). */
export function getOfficeModules(officeId: number, plan: PlanName): ModuleKey[] {
  return read()[officeId] ?? PLAN_MODULES[plan]
}

export function hasCustomModules(officeId: number) {
  return read()[officeId] !== undefined
}

export function setOfficeModules(officeId: number, modules: ModuleKey[] | null) {
  const store = read()
  if (modules) store[officeId] = modules
  else delete store[officeId]
  try {
    localStorage.setItem(KEY, JSON.stringify(store))
  } catch {}
  window.dispatchEvent(new Event(EVENT))
}

/** Hook: módulos do escritório atual, atualizado em tempo real quando o Super Admin muda algo. */
export function useOfficeModules(officeId = CURRENT_OFFICE.id, plan = CURRENT_OFFICE.plan) {
  const [mods, setMods] = useState(() => getOfficeModules(officeId, plan))
  useEffect(() => {
    const sync = () => setMods(getOfficeModules(officeId, plan))
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [officeId, plan])
  return mods
}

export const moduleLabel = (k: ModuleKey) => MODULES.find((m) => m.key === k)?.label ?? k
