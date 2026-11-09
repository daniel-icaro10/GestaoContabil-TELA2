import type { Tone } from '../../components/ui'

export type PlanName = 'Essencial' | 'Profissional' | 'Premium'
export const planTone: Record<PlanName, Tone> = { Essencial: 'sky', Profissional: 'blue', Premium: 'violet' }
export const planPrice: Record<PlanName, number> = { Essencial: 199, Profissional: 399, Premium: 799 }

export type OfficeStatus = 'Ativo' | 'Teste' | 'Suspenso'
export const officeStatusTone: Record<OfficeStatus, Tone> = { Ativo: 'green', Teste: 'blue', Suspenso: 'red' }

export type Office = {
  id: number
  name: string
  responsible: string
  clients: number
  plan: PlanName
  status: OfficeStatus
  createdAt: string
  city: string
  email: string
}

export const offices: Office[] = [
  { id: 1, name: 'Alfa Contabilidade Ltda', responsible: 'Ana Souza', clients: 87, plan: 'Premium', status: 'Ativo', createdAt: '03/01/2024', city: 'São Paulo, SP', email: 'ana@alfacontabil.com.br' },
  { id: 2, name: 'Beta Assessoria Fiscal', responsible: 'Carlos Mendes', clients: 54, plan: 'Profissional', status: 'Ativo', createdAt: '15/02/2024', city: 'Curitiba, PR', email: 'carlos@beta.com' },
  { id: 3, name: 'Gama Contadores Associados', responsible: 'Juliana Ramos', clients: 28, plan: 'Essencial', status: 'Ativo', createdAt: '20/03/2024', city: 'Recife, PE', email: 'juliana@gama.com.br' },
  { id: 4, name: 'Delta Finanças & Tributos', responsible: 'Pedro Oliveira', clients: 112, plan: 'Premium', status: 'Ativo', createdAt: '07/04/2024', city: 'Belo Horizonte, MG', email: 'pedro@deltafinancas.com' },
  { id: 5, name: 'Épsilon Contábil ME', responsible: 'Fernanda Lima', clients: 15, plan: 'Essencial', status: 'Teste', createdAt: '01/09/2024', city: 'Porto Alegre, RS', email: 'f.lima@epsilonme.com' },
  { id: 6, name: 'Zeta Gestão Empresarial', responsible: 'Ricardo Alves', clients: 63, plan: 'Profissional', status: 'Ativo', createdAt: '11/05/2024', city: 'Campinas, SP', email: 'r.alves@zeta.com.br' },
  { id: 7, name: 'Eta Escritório Contábil', responsible: 'Marcia Costa', clients: 9, plan: 'Essencial', status: 'Suspenso', createdAt: '19/06/2024', city: 'Salvador, BA', email: 'marcia@eta.com.br' },
  { id: 8, name: 'Theta Assessoria Completa', responsible: 'Leandro Barros', clients: 41, plan: 'Profissional', status: 'Teste', createdAt: '08/09/2024', city: 'Florianópolis, SC', email: 'l.barros@theta.com' },
  { id: 9, name: 'Iota Fiscal Ltda', responsible: 'Bruno Teixeira', clients: 22, plan: 'Profissional', status: 'Ativo', createdAt: '02/07/2024', city: 'Goiânia, GO', email: 'bruno@iotafiscal.com' },
  { id: 10, name: 'Kappa Contadores', responsible: 'Patrícia Nunes', clients: 18, plan: 'Essencial', status: 'Ativo', createdAt: '25/07/2024', city: 'Fortaleza, CE', email: 'patricia@kappa.com.br' },
]

export type Profile = 'Super Admin' | 'Admin do Escritório' | 'Contador' | 'Colaborador' | 'Cliente'
export const profileTone: Record<Profile, Tone> = {
  'Super Admin': 'violet',
  'Admin do Escritório': 'blue',
  Contador: 'sky',
  Colaborador: 'gray',
  Cliente: 'green',
}

export type PlatformUser = {
  id: number
  name: string
  email: string
  office: string
  profile: Profile
  active: boolean
  lastAccess: string
}

export const users: PlatformUser[] = [
  { id: 1, name: 'Gabriel Admin', email: 'gabriel@hubcontabil.com', office: 'HUBContábil', profile: 'Super Admin', active: true, lastAccess: 'hoje, 14:32' },
  { id: 2, name: 'Ana Souza', email: 'ana@alfacontabil.com.br', office: 'Alfa Contabilidade', profile: 'Admin do Escritório', active: true, lastAccess: 'hoje, 09:12' },
  { id: 3, name: 'Carlos Mendes', email: 'carlos@beta.com', office: 'Beta Assessoria', profile: 'Admin do Escritório', active: true, lastAccess: 'ontem, 18:50' },
  { id: 4, name: 'Juliana Ramos', email: 'juliana@gama.com.br', office: 'Gama Contadores', profile: 'Contador', active: true, lastAccess: 'ontem, 10:05' },
  { id: 5, name: 'Pedro Oliveira', email: 'pedro@deltafinancas.com', office: 'Delta Finanças', profile: 'Admin do Escritório', active: true, lastAccess: '17/09/2024' },
  { id: 6, name: 'Fernanda Lima', email: 'f.lima@epsilonme.com', office: 'Épsilon Contábil', profile: 'Colaborador', active: true, lastAccess: '16/09/2024' },
  { id: 7, name: 'Ricardo Alves', email: 'r.alves@zeta.com.br', office: 'Zeta Gestão', profile: 'Contador', active: false, lastAccess: '30/08/2024' },
  { id: 8, name: 'Marcela Rocha', email: 'm.rocha@clientes.com', office: 'Alfa Contabilidade', profile: 'Cliente', active: true, lastAccess: 'hoje, 11:20' },
  { id: 9, name: 'Leandro Barros', email: 'l.barros@theta.com', office: 'Theta Assessoria', profile: 'Admin do Escritório', active: true, lastAccess: '18/09/2024' },
  { id: 10, name: 'Sandra Neves', email: 's.neves@gama.com.br', office: 'Gama Contadores', profile: 'Colaborador', active: false, lastAccess: '01/08/2024' },
]

export type SubStatus = 'Ativa' | 'Trial' | 'Pendente' | 'Inadimplente' | 'Cancelada'
export const subStatusTone: Record<SubStatus, Tone> = {
  Ativa: 'green',
  Trial: 'blue',
  Pendente: 'amber',
  Inadimplente: 'red',
  Cancelada: 'gray',
}

export type Subscription = {
  id: number
  office: string
  plan: PlanName
  value: number
  nextCharge: string
  payment: string
  status: SubStatus
}

export const subscriptions: Subscription[] = [
  { id: 1, office: 'Delta Finanças & Tributos', plan: 'Premium', value: 799, nextCharge: '01/11/2024', payment: 'Cartão', status: 'Ativa' },
  { id: 2, office: 'Alfa Contabilidade Ltda', plan: 'Premium', value: 799, nextCharge: '05/11/2024', payment: 'Boleto', status: 'Ativa' },
  { id: 3, office: 'Zeta Gestão Empresarial', plan: 'Profissional', value: 399, nextCharge: '10/11/2024', payment: 'Cartão', status: 'Ativa' },
  { id: 4, office: 'Beta Assessoria Fiscal', plan: 'Profissional', value: 399, nextCharge: '12/11/2024', payment: 'Pix', status: 'Ativa' },
  { id: 5, office: 'Épsilon Contábil ME', plan: 'Essencial', value: 199, nextCharge: '–', payment: '—', status: 'Trial' },
  { id: 6, office: 'Theta Assessoria Completa', plan: 'Profissional', value: 399, nextCharge: '–', payment: '—', status: 'Trial' },
  { id: 7, office: 'Eta Escritório Contábil', plan: 'Essencial', value: 199, nextCharge: '15/10/2024', payment: 'Boleto', status: 'Inadimplente' },
  { id: 8, office: 'Iota Fiscal Ltda', plan: 'Profissional', value: 399, nextCharge: '–', payment: 'Cartão', status: 'Cancelada' },
  { id: 9, office: 'Kappa Contadores', plan: 'Essencial', value: 199, nextCharge: '20/11/2024', payment: 'Pix', status: 'Pendente' },
  { id: 10, office: 'Gama Contadores Assoc.', plan: 'Essencial', value: 199, nextCharge: '22/11/2024', payment: 'Boleto', status: 'Ativa' },
]

export function letterTone(name: string): Tone {
  const tones: Tone[] = ['violet', 'blue', 'sky', 'blue', 'sky']
  return tones[name.charCodeAt(0) % tones.length]
}

export function todayBR() {
  return new Date().toLocaleDateString('pt-BR')
}
