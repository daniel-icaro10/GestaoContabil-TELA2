export type Status = 'Pendente' | 'Pago'

export const prazos = [
  { dia: '05 Out', texto: 'Honorários contábeis', tone: 'amber' as const, done: false },
  { dia: '20 Out', texto: 'Carnê-Leão — Setembro', tone: 'amber' as const, done: false },
  { dia: '30 Out', texto: 'Envio informe de rendimentos', tone: 'gray' as const, done: false },
  { dia: '31 Out', texto: 'Prazo DIRPF 2024 (adicional)', tone: 'green' as const, done: true },
]

export type Declaracao = {
  ano: number
  base: number
  enviado: string
  resultadoLabel: string
  valor: number
  status: string
}

export const declaracoes: Declaracao[] = [
  { ano: 2024, base: 2023, enviado: '10/04/2024', resultadoLabel: 'Restituição', valor: 1240, status: 'Enviada' },
  { ano: 2023, base: 2022, enviado: '28/04/2023', resultadoLabel: 'Imposto a pagar', valor: 320, status: 'Enviada' },
  { ano: 2022, base: 2021, enviado: '15/04/2022', resultadoLabel: 'Sem diferença', valor: 0, status: 'Enviada' },
]

export const documentosNecessarios = [
  { nome: 'Informes de rendimentos (empregador e bancos)', ok: true },
  { nome: 'Recibos de despesas médicas e plano de saúde', ok: false },
  { nome: 'Comprovantes de despesas com educação', ok: false },
  { nome: 'Documentos de compra/venda de bens e imóveis', ok: true },
  { nome: 'Extratos de investimentos e corretoras', ok: true },
  { nome: 'Recibo da declaração do ano anterior', ok: true },
]

export type Obrigacao = { id: number; tipo: string; comp: string; venc: string; valor: number; status: Status }

export const obrigacoes: Obrigacao[] = [
  { id: 1, tipo: 'Carnê-Leão', comp: '09/2024', venc: '20/10/2024', valor: 890, status: 'Pendente' },
  { id: 2, tipo: 'Carnê-Leão', comp: '08/2024', venc: '20/09/2024', valor: 830, status: 'Pago' },
  { id: 3, tipo: 'Carnê-Leão', comp: '07/2024', venc: '20/08/2024', valor: 760, status: 'Pago' },
  { id: 4, tipo: 'DARF — Ganho capital', comp: '06/2024', venc: '31/07/2024', valor: 1200, status: 'Pago' },
]

export const categoriasDoc = [
  { key: 'Informes de Rendimentos', tone: 'text-indigo-500' },
  { key: 'Declarações IRPF', tone: 'text-violet-500' },
  { key: 'Comprovantes', tone: 'text-sky-500' },
  { key: 'Documentos Pessoais', tone: 'text-emerald-500' },
  { key: 'Recibos', tone: 'text-amber-600' },
  { key: 'Outros', tone: 'text-rose-400' },
]

export type Doc = { id: number; nome: string; categoria: string; data: string; ext: string; status: 'Ok' | 'Pendente' }

export const documentos: Doc[] = [
  { id: 1, nome: 'Informe de Rendimentos — Empresa X 2024', categoria: 'Informes de Rendimentos', data: '10/03/2024', ext: 'PDF', status: 'Ok' },
  { id: 2, nome: 'Informe de Rendimentos — Banco Inter 2024', categoria: 'Informes de Rendimentos', data: '08/03/2024', ext: 'PDF', status: 'Ok' },
  { id: 3, nome: 'Recibo IRPF 2024', categoria: 'Declarações IRPF', data: '10/04/2024', ext: 'PDF', status: 'Ok' },
  { id: 4, nome: 'Comprovante plano de saúde 2024', categoria: 'Comprovantes', data: '02/01/2024', ext: 'PDF', status: 'Pendente' },
  { id: 5, nome: 'RG — Maria Souza', categoria: 'Documentos Pessoais', data: '15/06/2023', ext: 'PNG', status: 'Ok' },
  { id: 6, nome: 'CPF — Maria Souza', categoria: 'Documentos Pessoais', data: '15/06/2023', ext: 'PDF', status: 'Ok' },
]

/** Contagens exibidas nos cards de categoria (inclui arquivos históricos) */
export const categoriaTotais: Record<string, number> = {
  'Informes de Rendimentos': 4,
  'Declarações IRPF': 3,
  Comprovantes: 5,
  'Documentos Pessoais': 2,
  Recibos: 3,
  Outros: 1,
}

export type Msg = { de: 'cliente' | 'contador'; texto: string; hora: string }
export type Solicitacao = {
  id: string
  tipo: string
  titulo: string
  aberta: string
  atualizada: string
  status: 'Em andamento' | 'Concluída'
  mensagens: Msg[]
}

export const solicitacoes: Solicitacao[] = [
  {
    id: '#042',
    tipo: 'Dúvida fiscal',
    titulo: 'Imposto sobre venda de ações',
    aberta: '10/09/2024',
    atualizada: 'há 2h',
    status: 'Em andamento',
    mensagens: [
      { de: 'cliente', texto: 'Vendi ações em agosto com lucro. Preciso pagar algum imposto?', hora: '10/09 09:14' },
      { de: 'contador', texto: 'Olá Maria! Vendas acima de R$ 20 mil no mês geram DARF de ganho de capital. Pode enviar as notas de corretagem?', hora: '10/09 11:02' },
    ],
  },
  {
    id: '#041',
    tipo: 'Envio de documento',
    titulo: 'Informe de rendimentos enviado',
    aberta: '01/09/2024',
    atualizada: 'há 3d',
    status: 'Concluída',
    mensagens: [
      { de: 'cliente', texto: 'Segue o informe de rendimentos do Banco Inter.', hora: '01/09 15:30' },
      { de: 'contador', texto: 'Recebido e arquivado no seu cofre. Obrigado!', hora: '02/09 09:10' },
    ],
  },
  {
    id: '#040',
    tipo: 'Declaração IRPF',
    titulo: 'Solicitação de entrega da declaração',
    aberta: '28/03/2024',
    atualizada: 'há 1m',
    status: 'Concluída',
    mensagens: [
      { de: 'cliente', texto: 'Podem iniciar a minha declaração de 2024?', hora: '28/03 10:00' },
      { de: 'contador', texto: 'Declaração transmitida em 10/04. Recibo disponível na área de Imposto de Renda.', hora: '10/04 17:45' },
    ],
  },
]

export type Fatura = { id: number; comp: string; venc: string; valor: number; status: Status }

export const faturas: Fatura[] = [
  { id: 10, comp: 'Outubro 2024', venc: '05/10/2024', valor: 790, status: 'Pendente' },
  { id: 9, comp: 'Setembro 2024', venc: '05/09/2024', valor: 790, status: 'Pago' },
  { id: 8, comp: 'Agosto 2024', venc: '05/08/2024', valor: 790, status: 'Pago' },
]

export const PIX_CODE =
  '00020126580014BR.GOV.BCB.PIX0136contato@contadorcentral.com.br5204000053039865406790.005802BR5925CONTADOR CENTRAL ASSESSOR6009SAO PAULO62070503***6304A1B2'

export const CONTADOR_WHATSAPP = 'https://wa.me/5511987654321'
