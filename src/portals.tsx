import {
  LayoutGrid,
  FileText,
  Receipt,
  User,
  Users,
  File,
  ShieldCheck,
  MessageSquareText,
  Clock3,
  Landmark,
  Sun,
  Building2,
  CreditCard,
  Settings,
  Briefcase,
  FileBarChart,
  AppWindow,
  FileSpreadsheet,
} from 'lucide-react'
import type { PortalConfig } from './components/PortalLayout'

export const adminPortal: PortalConfig = {
  variant: 'dark',
  prefix: 'SA',
  logoTag: { label: 'SUPER ADMIN', className: 'border-violet-500/50 bg-violet-500/10 text-violet-300' },
  headerBadge: { label: 'Super Admin', className: 'border-violet-200 bg-violet-50 text-violet-600', dot: 'bg-violet-500' },
  sections: [
    {
      label: 'MENU',
      items: [
        { to: '/admin', label: 'Dashboard', icon: LayoutGrid, num: '01', subtitle: 'Visão geral da plataforma HUBContábil' },
        { to: '/admin/escritorios', label: 'Escritórios', icon: Landmark, num: '02', subtitle: 'Gerenciamento dos escritórios contábeis' },
        { to: '/admin/usuarios', label: 'Usuários', icon: Users, num: '03', subtitle: 'Visão global de todos os usuários da plataforma' },
        { to: '/admin/planos', label: 'Planos', icon: CreditCard, num: '04', subtitle: 'Gerenciamento dos planos comerciais' },
        { to: '/admin/assinaturas', label: 'Assinaturas', icon: Clock3, num: '05', subtitle: 'Painel financeiro e gestão de assinaturas' },
        { to: '/admin/configuracoes', label: 'Configurações', icon: Sun, num: '06', subtitle: 'Configurações gerais da plataforma' },
      ],
    },
  ],
  user: { name: 'Gabriel Admin', role: 'Super Admin', initials: 'GA' },
  switches: [],
  notifications: [],
}

export const escritorioPortal: PortalConfig = {
  variant: 'light',
  prefix: 'ESCRITÓRIO',
  logoTag: { label: 'ESCRITÓRIO', className: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
  headerBadge: { label: 'Escritório', className: 'border-emerald-200 bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  selector: {
    avatarClass: 'bg-gradient-to-br from-brand to-teal-500',
    options: [{ id: 'cc', name: 'Contador Central Ass.', doc: 'CNPJ 98.765.432/0001-10', initials: 'CC' }],
  },
  sections: [
    {
      label: 'MENU',
      items: [
        { to: '/escritorio', label: 'Dashboard', icon: LayoutGrid, num: '01', subtitle: 'Central operacional do escritório' },
        { to: '/escritorio/clientes', label: 'Clientes', icon: Users, num: '02', subtitle: 'Carteira de clientes PJ e PF' },
        { to: '/escritorio/equipe', label: 'Equipe', icon: User, num: '04', subtitle: 'Gerenciamento de membros e atribuições' },
        { to: '/escritorio/dp', label: 'Departamento Pessoal', icon: Briefcase, num: '05', subtitle: 'DP consolidado de todos os clientes PJ' },
        { to: '/escritorio/tributos', label: 'Tributos & Obrigações', icon: Receipt, num: '06', subtitle: 'Visão consolidada de obrigações fiscais' },
        { to: '/escritorio/notas', label: 'Notas Fiscais', icon: FileText, num: '07', subtitle: 'NFS-e e NF-e dos clientes PJ' },
        { to: '/escritorio/documentos', label: 'Documentos', icon: File, num: '08', subtitle: 'Central documental de todos os clientes' },
        { to: '/escritorio/solicitacoes', label: 'Solicitações', icon: MessageSquareText, num: '09', subtitle: 'Central de atendimento e tickets' },
        { to: '/escritorio/financeiro', label: 'Financeiro', icon: Clock3, num: '10', subtitle: 'Receita, honorários e inadimplência' },
        { to: '/escritorio/relatorios', label: 'Relatórios', icon: FileBarChart, num: '11', subtitle: 'Geração e exportação de relatórios' },
      ],
    },
    {
      label: 'GESTÃO',
      items: [
        { to: '/escritorio/white-label', label: 'White-label', icon: AppWindow, num: '12', subtitle: 'Personalização da marca para o portal do cliente' },
        { to: '/escritorio/configuracoes', label: 'Configurações', icon: Sun, num: '13', subtitle: 'Preferências, integrações e segurança' },
      ],
    },
  ],
  user: { name: 'Carlos Andrade', role: 'Administrador', initials: 'CA' },
  switches: [
    { label: 'Portal Cliente PJ', to: '/pj', tone: 'brand' },
    { label: 'Super Admin', to: '/admin', tone: 'violet' },
  ],
  notifications: [
    { title: 'Novo documento', text: 'Alfa Contabilidade enviou extrato bancário', time: 'há 5 min' },
    { title: 'Nova solicitação', text: 'Maria Souza abriu a solicitação #0420', time: 'há 23 min' },
    { title: 'Certificado vencendo', text: 'Gama Fiscal — e-CNPJ A1 vence em 18 dias', time: 'há 1h' },
  ],
}

export const pjPortal: PortalConfig = {
  variant: 'light',
  prefix: 'CLIENTE PJ',
  selector: {
    options: [
      { id: 'tf', name: 'Tech Founders Ltda', doc: 'CNPJ 12.345.678/0001-90', initials: 'TF' },
      { id: 'tl', name: 'TF Labs Serviços Ltda', doc: 'CNPJ 45.678.901/0001-22', initials: 'TL' },
    ],
  },
  sections: [
    {
      label: 'MENU',
      items: [
        { to: '/pj', label: 'Dashboard', icon: LayoutGrid, num: '01', subtitle: 'Competência: Setembro / 2024' },
        { to: '/pj/guias', label: 'Guias & Tributos', icon: Receipt, num: '02', subtitle: 'Gestão de guias, apurações e comprovantes' },
        { to: '/pj/notas', label: 'Notas Fiscais', icon: FileText, num: '03', subtitle: 'Emissão, consulta e gestão de NFS-e' },
        { to: '/pj/folha', label: 'Folha & Funcionários', icon: User, num: '04', subtitle: 'eSocial, pró-labore e férias' },
        { to: '/pj/socios', label: 'Sócios', icon: Users, num: '05', subtitle: 'Quadro societário e participações' },
        { to: '/pj/documentos', label: 'Documentos', icon: File, num: '06', subtitle: 'Armazenamento seguro em nuvem — LGPD e ICP-Brasil' },
        { to: '/pj/certificado', label: 'Certificado Digital', icon: ShieldCheck, num: '07', subtitle: 'Gestão dos certificados ICP-Brasil' },
        { to: '/pj/solicitacoes', label: 'Solicitações', icon: MessageSquareText, num: '08', subtitle: 'Central de comunicação com o escritório' },
        { to: '/pj/financeiro', label: 'Financeiro', icon: Clock3, num: '09', subtitle: 'Honorários e faturas do escritório contábil' },
        { to: '/pj/empresa', label: 'Dados da Empresa', icon: Building2, num: '10', subtitle: 'Cadastro e informações fiscais da empresa' },
      ],
    },
    {
      label: 'CONTA',
      items: [
        { to: '/pj/configuracoes', label: 'Configurações', icon: Sun, subtitle: 'Configure a identidade visual da sua marca', noPrefix: true },
      ],
    },
  ],
  user: { name: 'João da Silva', role: 'Sócio-Administrador', initials: 'JS' },
  switches: [
    { label: 'Escritório Contábil', to: '/escritorio', tone: 'green' },
    { label: 'Portal Pessoa Física', to: '/pf', tone: 'sky' },
    { label: 'Super Admin', to: '/admin', tone: 'violet' },
  ],
  showFooter: true,
  notifications: [
    { title: 'Guia disponível', text: 'DAS - Simples Nacional 09/2024 disponível para pagamento', time: 'há 2h' },
    { title: 'Certificado Digital', text: 'Seu e-CNPJ A1 vence em 18 dias', time: 'ontem' },
    { title: 'Solicitação atualizada', text: '#SOL-9804 aguardando sua assinatura', time: 'ontem' },
  ],
}

export const pfPortal: PortalConfig = {
  variant: 'light',
  prefix: 'CLIENTE PF',
  logoTag: { label: 'PF', className: 'border-sky-200 bg-sky-50 text-sky-600' },
  headerBadge: { label: 'Pessoa Física', className: 'border-sky-200 bg-sky-50 text-sky-700', dot: 'bg-sky-500' },
  selector: {
    round: true,
    avatarClass: 'bg-gradient-to-br from-sky-500 to-brand',
    options: [{ id: 'ms', name: 'Maria Souza', doc: 'CPF 987.654.321-00', initials: 'MS' }],
  },
  sections: [
    {
      label: 'MENU',
      items: [
        { to: '/pf', label: 'Dashboard', icon: LayoutGrid, num: '01', subtitle: 'Visão geral das suas obrigações' },
        { to: '/pf/imposto-renda', label: 'Imposto de Renda', icon: FileSpreadsheet, num: '02', subtitle: 'IRPF — Declarações e pendências' },
        { to: '/pf/obrigacoes', label: 'Obrigações', icon: Receipt, num: '03', subtitle: 'Carnê-Leão e outras obrigações' },
        { to: '/pf/documentos', label: 'Documentos', icon: File, num: '04', subtitle: 'Cofre pessoal de documentos' },
        { to: '/pf/solicitacoes', label: 'Solicitações', icon: MessageSquareText, num: '05', subtitle: 'Comunicação com o escritório' },
        { to: '/pf/financeiro', label: 'Financeiro', icon: Clock3, num: '06', subtitle: 'Honorários e faturas' },
      ],
    },
    {
      label: 'CONTA',
      items: [
        { to: '/pf/dados', label: 'Dados Pessoais', icon: User, num: '07', subtitle: 'Cadastro e informações pessoais' },
        { to: '/pf/configuracoes', label: 'Configurações', icon: Settings, num: '08', subtitle: 'Preferências da conta e segurança' },
      ],
    },
  ],
  user: { name: 'Maria Souza', role: 'Cliente Pessoa Física', initials: 'MS' },
  switches: [{ label: 'Portal PJ', to: '/pj', tone: 'brand', back: true }],
  notifications: [
    { title: 'Mensagem do contador', text: 'Sua declaração de IR 2024 foi enviada com sucesso.', time: '10/09' },
    { title: 'Obrigação pendente', text: 'Carnê-Leão 09/2024 vence em 20/10/2024', time: 'há 1d' },
  ],
}
