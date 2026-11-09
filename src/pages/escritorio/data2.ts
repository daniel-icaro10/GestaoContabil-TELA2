import type { Tone } from '../../components/ui'

/* ---------------- Documentos ---------------- */
export type DocCategoria = 'Extrato' | 'Contrato' | 'Guia' | 'Certidão' | 'NF-e/NFS-e' | 'Folha' | 'IRPF' | 'Alvará'
export type DocStatus = 'Novo' | 'Revisão' | 'OK'

export type EsDoc = {
  id: number
  nome: string
  cliente: string
  tamanho: string
  categoria: DocCategoria
  data: string
  status: DocStatus
}

export const docCategorias: DocCategoria[] = ['Extrato', 'Contrato', 'Guia', 'Certidão', 'NF-e/NFS-e', 'Folha', 'IRPF', 'Alvará']

export const docsIniciais: EsDoc[] = [
  { id: 1, nome: 'Extrato bancário Set/2024', cliente: 'Alfa Contabilidade', tamanho: '218 KB', categoria: 'Extrato', data: '20/10/2024', status: 'Novo' },
  { id: 2, nome: 'Contrato social atualizado', cliente: 'Beta Assessoria', tamanho: '1.4 MB', categoria: 'Contrato', data: '19/10/2024', status: 'Revisão' },
  { id: 3, nome: 'DAS outubro 2024', cliente: 'Gama Fiscal', tamanho: '48 KB', categoria: 'Guia', data: '18/10/2024', status: 'OK' },
  { id: 4, nome: 'Certidão negativa PGFN', cliente: 'Delta Contadores', tamanho: '620 KB', categoria: 'Certidão', data: '17/10/2024', status: 'OK' },
  { id: 5, nome: 'NFS-e XML #1248', cliente: 'Alfa Contabilidade', tamanho: '8 KB', categoria: 'NF-e/NFS-e', data: '16/10/2024', status: 'OK' },
  { id: 6, nome: 'Folha pagamento Set/2024', cliente: 'Epsilon Finanças', tamanho: '340 KB', categoria: 'Folha', data: '15/10/2024', status: 'Revisão' },
  { id: 7, nome: 'Comprovante IRPF 2024', cliente: 'Maria Souza', tamanho: '156 KB', categoria: 'IRPF', data: '14/10/2024', status: 'Novo' },
  { id: 8, nome: 'Alvará municipal 2024', cliente: 'Beta Assessoria', tamanho: '900 KB', categoria: 'Alvará', data: '10/10/2024', status: 'OK' },
]

export const docStatusTone: Record<DocStatus, Tone> = { Novo: 'blue', 'Revisão': 'amber', OK: 'green' }

export const clientesLista = [
  'Alfa Contabilidade',
  'Beta Assessoria',
  'Gama Fiscal',
  'Delta Contadores',
  'Epsilon Finanças',
  'Maria Souza',
  'João Ferreira',
]

/* ---------------- Solicitações ---------------- */
export type SolStatus = 'Aberto' | 'Em andamento' | 'Aguardando' | 'Resolvido'
export type SolPrioridade = 'Normal' | 'Alta' | 'Urgente'

export type ChatMsg = { autor: string; texto: string; hora: string; escritorio: boolean }

export type EsSolicitacao = {
  id: string
  cliente: string
  tipo: 'PJ' | 'PF'
  assunto: string
  responsavel: string
  data: string
  prioridade: SolPrioridade
  status: SolStatus
  mensagens: ChatMsg[]
}

export const solicitacoesIniciais: EsSolicitacao[] = [
  {
    id: '#0421',
    cliente: 'Alfa Contabilidade',
    tipo: 'PJ',
    assunto: 'Emissão de Certidão Negativa',
    responsavel: 'Ana',
    data: 'hoje 09:12',
    prioridade: 'Alta',
    status: 'Aberto',
    mensagens: [{ autor: 'Alfa Contabilidade', texto: 'Precisamos da CND Federal para participar de uma licitação na próxima semana.', hora: '09:12', escritorio: false }],
  },
  {
    id: '#0420',
    cliente: 'Maria Souza',
    tipo: 'PF',
    assunto: 'Dúvida sobre Carnê-Leão setembro',
    responsavel: 'Carlos',
    data: 'hoje 08:45',
    prioridade: 'Normal',
    status: 'Em andamento',
    mensagens: [
      { autor: 'Maria Souza', texto: 'Recebi um aluguel extra em setembro, preciso incluir no Carnê-Leão?', hora: '08:45', escritorio: false },
      { autor: 'Carlos', texto: 'Olá Maria! Sim, precisa. Pode me enviar o recibo do aluguel?', hora: '09:02', escritorio: true },
    ],
  },
  {
    id: '#0419',
    cliente: 'Beta Assessoria',
    tipo: 'PJ',
    assunto: 'Solicitação de alvará renovação',
    responsavel: 'Pedro',
    data: 'ontem 16:30',
    prioridade: 'Alta',
    status: 'Aguardando',
    mensagens: [
      { autor: 'Beta Assessoria', texto: 'Nosso alvará vence no fim do mês, podem dar entrada na renovação?', hora: '16:30', escritorio: false },
      { autor: 'Pedro', texto: 'Claro! Precisamos do IPTU atualizado do imóvel. Aguardamos o envio.', hora: '17:05', escritorio: true },
    ],
  },
  {
    id: '#0418',
    cliente: 'Delta Contadores',
    tipo: 'PJ',
    assunto: 'Rescisão funcionário — urgente',
    responsavel: 'Mariana',
    data: 'ontem 14:00',
    prioridade: 'Urgente',
    status: 'Em andamento',
    mensagens: [{ autor: 'Delta Contadores', texto: 'Precisamos calcular a rescisão do Sérgio Lima com urgência.', hora: '14:00', escritorio: false }],
  },
  {
    id: '#0417',
    cliente: 'Gama Fiscal',
    tipo: 'PJ',
    assunto: 'Parcelamento DAS em aberto',
    responsavel: 'Ana',
    data: '18/10',
    prioridade: 'Alta',
    status: 'Aberto',
    mensagens: [{ autor: 'Gama Fiscal', texto: 'Gostaríamos de parcelar o DAS de setembro que está em atraso.', hora: '10:20', escritorio: false }],
  },
  {
    id: '#0416',
    cliente: 'João Ferreira',
    tipo: 'PF',
    assunto: 'Declaração IRPF 2024 — revisão',
    responsavel: 'Carlos',
    data: '17/10',
    prioridade: 'Normal',
    status: 'Resolvido',
    mensagens: [
      { autor: 'João Ferreira', texto: 'Recebi uma notificação de malha fina, podem revisar?', hora: '11:00', escritorio: false },
      { autor: 'Carlos', texto: 'Revisado e retificadora enviada. Tudo certo agora!', hora: '15:40', escritorio: true },
    ],
  },
]

export const solStatusTone: Record<SolStatus, Tone> = {
  Aberto: 'blue',
  'Em andamento': 'amber',
  Aguardando: 'violet',
  Resolvido: 'green',
}
export const solPrioridadeTone: Record<SolPrioridade, Tone> = { Normal: 'gray', Alta: 'amber', Urgente: 'red' }
export const responsaveis = ['Carlos', 'Ana', 'Pedro', 'Mariana', 'Lucas']

/* ---------------- Financeiro ---------------- */
export type CobStatus = 'Pago' | 'Pendente' | 'Em atraso'
export type Cobranca = {
  id: number
  cliente: string
  tipo: 'PJ' | 'PF'
  plano: string
  valor: number
  vencimento: string
  status: CobStatus
}

export const cobrancasIniciais: Cobranca[] = [
  { id: 1, cliente: 'Alfa Contabilidade', tipo: 'PJ', plano: 'Plano Pro', valor: 890, vencimento: '10/10/2024', status: 'Pago' },
  { id: 2, cliente: 'Beta Assessoria', tipo: 'PJ', plano: 'Plano Plus', valor: 650, vencimento: '10/10/2024', status: 'Pago' },
  { id: 3, cliente: 'Gama Fiscal', tipo: 'PJ', plano: 'Plano Pro', valor: 890, vencimento: '10/10/2024', status: 'Em atraso' },
  { id: 4, cliente: 'Maria Souza', tipo: 'PF', plano: 'Plano PF', valor: 390, vencimento: '15/10/2024', status: 'Pago' },
  { id: 5, cliente: 'Delta Contadores', tipo: 'PJ', plano: 'Plano Pro', valor: 890, vencimento: '10/11/2024', status: 'Pendente' },
  { id: 6, cliente: 'João Ferreira', tipo: 'PF', plano: 'Plano PF', valor: 390, vencimento: '15/11/2024', status: 'Pendente' },
  { id: 7, cliente: 'Epsilon Finanças', tipo: 'PJ', plano: 'Plano Enterprise', valor: 1890, vencimento: '10/11/2024', status: 'Pendente' },
]

export const cobStatusTone: Record<CobStatus, Tone> = { Pago: 'green', Pendente: 'amber', 'Em atraso': 'red' }

export const receitaMensal = [
  { mes: 'Jul', valor: 18400 },
  { mes: 'Ago', valor: 19200 },
  { mes: 'Set', valor: 21500 },
  { mes: 'Out', valor: 17800 },
]

/* ---------------- Relatórios ---------------- */
export type Relatorio = { nome: string; desc: string; formatos: ('PDF' | 'XLSX')[] }
export const relatorioGrupos: { titulo: string; itens: Relatorio[] }[] = [
  {
    titulo: 'GESTÃO DE CLIENTES',
    itens: [
      { nome: 'Carteira de Clientes', desc: 'Lista completa com regime, status, responsável', formatos: ['PDF', 'XLSX'] },
      { nome: 'Clientes com Pendências', desc: 'Clientes com documentos ou obrigações em aberto', formatos: ['PDF', 'XLSX'] },
      { nome: 'Clientes Inativos (90 dias+)', desc: 'Relação de clientes sem interação recente', formatos: ['PDF'] },
    ],
  },
  {
    titulo: 'OBRIGAÇÕES E TRIBUTOS',
    itens: [
      { nome: 'Calendário Fiscal Mensal', desc: 'Vencimentos do mês agrupados por tipo e cliente', formatos: ['PDF', 'XLSX'] },
      { nome: 'Guias Emitidas', desc: 'DAS, DARF, FGTS e outros — histórico consolidado', formatos: ['XLSX'] },
      { nome: 'Obrigações Atrasadas', desc: 'Pendências vencidas por cliente e responsável', formatos: ['PDF'] },
    ],
  },
  {
    titulo: 'NOTAS FISCAIS',
    itens: [
      { nome: 'NFS-e Emitidas por Cliente', desc: 'Emissões por período com totalizadores', formatos: ['PDF', 'XLSX'] },
      { nome: 'SPED Contribuições', desc: 'Escrituração de contribuições sociais', formatos: ['XLSX'] },
    ],
  },
  {
    titulo: 'FINANCEIRO DO ESCRITÓRIO',
    itens: [
      { nome: 'Honorários Recebidos', desc: 'Recebimentos do período por cliente e forma de pagamento', formatos: ['PDF', 'XLSX'] },
      { nome: 'Inadimplência', desc: 'Clientes com honorários em atraso e dias de atraso', formatos: ['PDF', 'XLSX'] },
      { nome: 'DRE do Escritório', desc: 'Demonstrativo de resultado mensal do escritório', formatos: ['PDF'] },
    ],
  },
]
