import type { Tone } from '../../components/ui'

export type Guia = {
  id: string
  code: string
  codeTone: Tone
  name: string
  comp: string
  venc: string
  valor: number
  status: 'pendente' | 'pago'
  folha?: boolean
}

export const guias: Guia[] = [
  { id: 'g1', code: 'DAS', codeTone: 'blue', name: 'DAS - Simples Nacional', comp: '09/2024', venc: '20/10/2024', valor: 1240, status: 'pendente' },
  { id: 'g2', code: 'FGTS', codeTone: 'gray', name: 'FGTS Digital', comp: '09/2024', venc: '07/10/2024', valor: 680, status: 'pago', folha: true },
  { id: 'g3', code: 'GPS', codeTone: 'violet', name: 'INSS / Pró-Labore Sócios', comp: '09/2024', venc: '15/10/2024', valor: 2900.5, status: 'pago', folha: true },
  { id: 'g4', code: 'DARF', codeTone: 'amber', name: 'IRPJ - Lucro Estimado', comp: '08/2024', venc: '30/09/2024', valor: 890.2, status: 'pago' },
]

export type Nota = {
  id: string
  numero: string
  tomador: string
  cnpj: string
  servico: string
  comp: string
  emissao: string
  valor: number
  status: 'autorizada' | 'pendente' | 'cancelada'
}

export const notas: Nota[] = [
  { id: 'n1', numero: '000842', tomador: 'Acme Soluções Digitais Ltda', cnpj: '11.222.333/0001-44', servico: 'Consultoria em TI e Desenvolvimento', comp: '10/2024', emissao: '02/10/2024', valor: 8500, status: 'autorizada' },
  { id: 'n2', numero: '000843', tomador: 'Bravo Marketing EIRELI', cnpj: '22.333.444/0001-55', servico: 'Gestão de Tráfego e Mídia Paga', comp: '10/2024', emissao: '05/10/2024', valor: 3200, status: 'autorizada' },
  { id: 'n3', numero: '000844', tomador: 'Delta Construções S.A.', cnpj: '33.444.555/0001-66', servico: 'Assessoria Contábil Mensal', comp: '10/2024', emissao: '08/10/2024', valor: 1800, status: 'pendente' },
  { id: 'n4', numero: '000840', tomador: 'Epsilon Educação Ltda', cnpj: '44.555.666/0001-77', servico: 'Desenvolvimento de Sistema Web', comp: '09/2024', emissao: '20/09/2024', valor: 4750, status: 'cancelada' },
  { id: 'n5', numero: '000845', tomador: 'Zeta Saúde Digital ME', cnpj: '55.666.777/0001-88', servico: 'Suporte Técnico e Infraestrutura', comp: '10/2024', emissao: '10/10/2024', valor: 1000, status: 'autorizada' },
]

export type Colaborador = {
  id: string
  nome: string
  cargo: string
  regime: 'CLT' | 'Pró-labore'
  bruto: number
  inss: number
  irrf: number
  fgts: number | null
}

export const colaboradores: Colaborador[] = [
  { id: 'c1', nome: 'Lucas Silveira', cargo: 'Designer Pleno', regime: 'CLT', bruto: 5200, inss: 572, irrf: 480.5, fgts: 416 },
  { id: 'c2', nome: 'Mateus Ramos', cargo: 'Dev. Full Stack Sênior', regime: 'CLT', bruto: 9800, inss: 908.85, irrf: 1550, fgts: 784 },
  { id: 'c3', nome: 'Sheila Rozendo', cargo: 'Sócia-Administradora', regime: 'Pró-labore', bruto: 15000, inss: 1650, irrf: 2988, fgts: null },
  { id: 'c4', nome: 'Fernanda Costa', cargo: 'Designer UX/UI', regime: 'CLT', bruto: 4500, inss: 495, irrf: 315, fgts: 360 },
]

export type Arquivo = {
  id: string
  nome: string
  ext: 'PDF' | 'XML' | 'OFX' | 'ZIP' | 'PNG' | 'DOCX'
  pasta: 'Fiscal' | 'Pessoal' | 'Contábil' | 'Societário'
  por: string
  meu: boolean
  data: string
  tamanho: string
}

export const arquivos: Arquivo[] = [
  { id: 'a1', nome: 'Extrato_Bancario_Inter_Setembro.pdf', ext: 'PDF', pasta: 'Contábil', por: 'Sheila Rozendo (Você)', meu: true, data: 'Hoje às 09:12', tamanho: '1.4 MB' },
  { id: 'a2', nome: 'Lote_NFe_Entradas_Setembro.xml', ext: 'XML', pasta: 'Fiscal', por: 'Sheila Rozendo (Você)', meu: true, data: 'Ontem às 16:45', tamanho: '3.8 MB' },
  { id: 'a3', nome: 'Balancete_Semestral_Assinado.pdf', ext: 'PDF', pasta: 'Contábil', por: 'Carlos Eduardo (Contador)', meu: false, data: '02 Out 2024', tamanho: '4.2 MB' },
  { id: 'a4', nome: 'Cartao_CNPJ_Atualizado.pdf', ext: 'PDF', pasta: 'Societário', por: 'Carlos Eduardo (Contador)', meu: false, data: '15 Set 2024', tamanho: '520 KB' },
  { id: 'a5', nome: 'DAS_092024.pdf', ext: 'PDF', pasta: 'Fiscal', por: 'Carlos Eduardo (Contador)', meu: false, data: '12 Set 2024', tamanho: '210 KB' },
  { id: 'a6', nome: 'Folha_Set2024.pdf', ext: 'PDF', pasta: 'Pessoal', por: 'Carlos Eduardo (Contador)', meu: false, data: '05 Set 2024', tamanho: '860 KB' },
]

export type Solicitacao = {
  id: string
  protocolo: string
  assunto: string
  detalhe: string
  solicitante: string
  abertura: string
  status: 'analise' | 'assinatura' | 'concluido'
  mensagens: { de: 'cliente' | 'contador'; texto: string; hora: string }[]
}

export const solicitacoes: Solicitacao[] = [
  {
    id: 's1',
    protocolo: '#SOL-9821',
    assunto: 'Admissão CLT — Designer Pleno',
    detalhe: 'Novo colaborador: Lucas Silveira',
    solicitante: 'Sheila Rozendo (Você)',
    abertura: 'Hoje às 10:15',
    status: 'analise',
    mensagens: [
      { de: 'cliente', texto: 'Olá! Segue a ficha cadastral e a CTPS digital do Lucas.', hora: '10:15' },
      { de: 'contador', texto: 'Recebido! Estamos conferindo os documentos e retornamos em breve.', hora: '10:42' },
    ],
  },
  {
    id: 's2',
    protocolo: '#SOL-9804',
    assunto: 'Declaração de Faturamento para Banco',
    detalhe: 'Finalidade: Linha de crédito PJ',
    solicitante: 'Sheila Rozendo (Você)',
    abertura: 'Ontem às 14:30',
    status: 'assinatura',
    mensagens: [
      { de: 'cliente', texto: 'Preciso da declaração de faturamento dos últimos 12 meses.', hora: '14:30' },
      { de: 'contador', texto: 'Declaração pronta! Enviamos para sua assinatura digital.', hora: '17:05' },
    ],
  },
  {
    id: 's3',
    protocolo: '#SOL-9742',
    assunto: 'Férias Colaborador — Mateus Ramos',
    detalhe: 'Período: 01/11 a 20/11',
    solicitante: 'Sheila Rozendo (Você)',
    abertura: '08 Out 2024',
    status: 'concluido',
    mensagens: [
      { de: 'cliente', texto: 'Programar férias do Mateus de 01/11 a 20/11.', hora: '09:00' },
      { de: 'contador', texto: 'Aviso e recibo de férias gerados e arquivados no cofre.', hora: '15:20' },
    ],
  },
]

export type Fatura = {
  id: string
  comp: string
  venc: string
  valor: number
  status: 'pendente' | 'pago'
}

export const faturas: Fatura[] = [
  { id: 'f1', comp: 'Outubro 2024', venc: '05/10/2024', valor: 1490, status: 'pendente' },
  { id: 'f2', comp: 'Setembro 2024', venc: '05/09/2024', valor: 1490, status: 'pago' },
  { id: 'f3', comp: 'Agosto 2024', venc: '05/08/2024', valor: 1490, status: 'pago' },
  { id: 'f4', comp: 'Julho 2024', venc: '05/07/2024', valor: 1490, status: 'pago' },
]

export const PIX_CODE =
  '00020126580014BR.GOV.BCB.PIX0136hubcontabil-pix-demo-0001-tech-founders5204000053039865802BR5925TECH FOUNDERS LTDA6009SAO PAULO62070503***6304ABCD'
