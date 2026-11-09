export type ClienteTipo = 'PJ' | 'PF'
export type Cliente = {
  id: string
  nome: string
  tipo: ClienteTipo
  doc: string
  regime: string
  responsavel: string
  honorario: number
  status: 'Ativo' | 'Inativo'
  email: string
  telefone: string
  cidade: string
  desde: string
}

export const clientes: Cliente[] = [
  { id: 'alfa', nome: 'Alfa Contabilidade', tipo: 'PJ', doc: '11.222.333/0001-44', regime: 'Simples Nacional', responsavel: 'Ana Lima', honorario: 890, status: 'Ativo', email: 'contato@alfa.com.br', telefone: '(11) 3333-1000', cidade: 'São Paulo/SP', desde: '03/2022' },
  { id: 'beta', nome: 'Beta Assessoria', tipo: 'PJ', doc: '22.333.444/0001-55', regime: 'Lucro Presumido', responsavel: 'Pedro Costa', honorario: 650, status: 'Ativo', email: 'financeiro@beta.com.br', telefone: '(41) 3222-2000', cidade: 'Curitiba/PR', desde: '07/2022' },
  { id: 'gama', nome: 'Gama Fiscal', tipo: 'PJ', doc: '33.444.555/0001-66', regime: 'Simples Nacional', responsavel: 'Carlos Andrade', honorario: 890, status: 'Ativo', email: 'adm@gamafiscal.com.br', telefone: '(81) 3111-3000', cidade: 'Recife/PE', desde: '01/2023' },
  { id: 'delta', nome: 'Delta Contadores', tipo: 'PJ', doc: '44.555.666/0001-77', regime: 'Lucro Real', responsavel: 'Mariana Souza', honorario: 890, status: 'Ativo', email: 'contato@delta.com.br', telefone: '(31) 3444-4000', cidade: 'Belo Horizonte/MG', desde: '05/2021' },
  { id: 'epsilon', nome: 'Epsilon Finanças', tipo: 'PJ', doc: '55.666.777/0001-88', regime: 'Lucro Presumido', responsavel: 'Ana Lima', honorario: 1890, status: 'Ativo', email: 'contato@epsilon.com.br', telefone: '(51) 3555-5000', cidade: 'Porto Alegre/RS', desde: '09/2023' },
  { id: 'tech', nome: 'Tech Founders Ltda', tipo: 'PJ', doc: '12.345.678/0001-90', regime: 'Simples Nacional', responsavel: 'Carlos Andrade', honorario: 1490, status: 'Ativo', email: 'joao@techfounders.com.br', telefone: '(11) 98765-4321', cidade: 'São Paulo/SP', desde: '01/2022' },
  { id: 'maria', nome: 'Maria Souza', tipo: 'PF', doc: '987.654.321-00', regime: 'Pessoa Física', responsavel: 'Carlos Andrade', honorario: 390, status: 'Ativo', email: 'maria.souza@email.com', telefone: '(11) 98765-4321', cidade: 'São Paulo/SP', desde: '01/2023' },
  { id: 'joao', nome: 'João Ferreira', tipo: 'PF', doc: '123.987.456-11', regime: 'Pessoa Física', responsavel: 'Ana Lima', honorario: 390, status: 'Ativo', email: 'joao.ferreira@email.com', telefone: '(11) 97777-1234', cidade: 'Campinas/SP', desde: '02/2024' },
  { id: 'omega', nome: 'Omega Serviços Ltda', tipo: 'PJ', doc: '66.777.888/0001-99', regime: 'Simples Nacional', responsavel: 'Lucas Ferreira', honorario: 590, status: 'Inativo', email: 'contato@omega.com.br', telefone: '(21) 3666-6000', cidade: 'Rio de Janeiro/RJ', desde: '06/2021' },
]

export type Membro = {
  id: string
  nome: string
  email: string
  papel: string
  status: 'Ativo' | 'Inativo'
  clientes: number
  tarefas: number
  acesso: string
}

export const equipe: Membro[] = [
  { id: 'ca', nome: 'Carlos Andrade', email: 'carlos@contadorcentral.com.br', papel: 'Administrador', status: 'Ativo', clientes: 48, tarefas: 3, acesso: 'há 2 min' },
  { id: 'al', nome: 'Ana Lima', email: 'ana@contadorcentral.com.br', papel: 'Contador', status: 'Ativo', clientes: 62, tarefas: 7, acesso: 'há 1h' },
  { id: 'pc', nome: 'Pedro Costa', email: 'pedro@contadorcentral.com.br', papel: 'Analista', status: 'Ativo', clientes: 38, tarefas: 5, acesso: 'há 3h' },
  { id: 'ms', nome: 'Mariana Souza', email: 'mariana@contadorcentral.com.br', papel: 'Dep. Pessoal', status: 'Ativo', clientes: 55, tarefas: 12, acesso: 'há 1d' },
  { id: 'lf', nome: 'Lucas Ferreira', email: 'lucas@contadorcentral.com.br', papel: 'Assistente', status: 'Inativo', clientes: 29, tarefas: 2, acesso: 'há 2s' },
]

export type Obrigacao = {
  id: string
  codigo: string
  cliente: string
  tipo: ClienteTipo
  referencia: string
  vencimento: string
  valor: number
  status: 'Vencendo hoje' | 'A vencer' | 'Pendente' | 'Atrasado' | 'Pago'
  prioridade: 'Urgente' | 'Alta' | 'Normal'
}

export const obrigacoes: Obrigacao[] = [
  { id: 'o1', codigo: 'DAS-SN', cliente: 'Alfa Contabilidade', tipo: 'PJ', referencia: 'Set/2024', vencimento: '20/10/2024', valor: 1248.9, status: 'Vencendo hoje', prioridade: 'Urgente' },
  { id: 'o2', codigo: 'DARF', cliente: 'Beta Assessoria', tipo: 'PJ', referencia: 'Set/2024', vencimento: '25/10/2024', valor: 3720, status: 'A vencer', prioridade: 'Alta' },
  { id: 'o3', codigo: 'FGTS', cliente: 'Alfa Contabilidade', tipo: 'PJ', referencia: 'Set/2024', vencimento: '07/11/2024', valor: 893.4, status: 'A vencer', prioridade: 'Normal' },
  { id: 'o4', codigo: 'Carnê-L', cliente: 'Maria Souza', tipo: 'PF', referencia: 'Set/2024', vencimento: '30/10/2024', valor: 340, status: 'Pendente', prioridade: 'Alta' },
  { id: 'o5', codigo: 'INSS', cliente: 'Delta Contadores', tipo: 'PJ', referencia: 'Set/2024', vencimento: '20/10/2024', valor: 2150, status: 'Vencendo hoje', prioridade: 'Urgente' },
  { id: 'o6', codigo: 'ISS', cliente: 'Epsilon Finanças', tipo: 'PJ', referencia: 'Set/2024', vencimento: '10/11/2024', valor: 580, status: 'A vencer', prioridade: 'Normal' },
  { id: 'o7', codigo: 'DAS-SN', cliente: 'Gama Fiscal', tipo: 'PJ', referencia: 'Set/2024', vencimento: '20/10/2024', valor: 4130, status: 'Atrasado', prioridade: 'Urgente' },
  { id: 'o8', codigo: 'IRPF', cliente: 'João Ferreira', tipo: 'PF', referencia: '2024', vencimento: '30/11/2024', valor: 980, status: 'A vencer', prioridade: 'Normal' },
]

export type Nota = {
  id: string
  numero: string
  modelo: 'NFS-e' | 'NF-e'
  cliente: string
  tomador: string
  emissao: string
  valor: number
  tipo: 'Saída' | 'Entrada'
  status: 'Autorizada' | 'Cancelada' | 'Pendente'
}

export const notas: Nota[] = [
  { id: 'n1', numero: '#1250', modelo: 'NFS-e', cliente: 'Alfa Contabilidade', tomador: 'Omega Serviços Ltda', emissao: '20/10/2024', valor: 8500, tipo: 'Saída', status: 'Autorizada' },
  { id: 'n2', numero: '#1249', modelo: 'NFS-e', cliente: 'Beta Assessoria', tomador: 'Prime Consulting', emissao: '19/10/2024', valor: 3200, tipo: 'Saída', status: 'Autorizada' },
  { id: 'n3', numero: '#1248', modelo: 'NFS-e', cliente: 'Alfa Contabilidade', tomador: 'TechBrasil Ltda', emissao: '18/10/2024', valor: 12000, tipo: 'Saída', status: 'Autorizada' },
  { id: 'n4', numero: '#0551', modelo: 'NF-e', cliente: 'Gama Fiscal', tomador: 'Distribuidora Sul', emissao: '17/10/2024', valor: 45000, tipo: 'Saída', status: 'Cancelada' },
  { id: 'n5', numero: '#1247', modelo: 'NFS-e', cliente: 'Delta Contadores', tomador: 'Imobiliária Centro', emissao: '16/10/2024', valor: 6300, tipo: 'Saída', status: 'Pendente' },
  { id: 'n6', numero: '#3311', modelo: 'NF-e', cliente: 'Epsilon Finanças', tomador: 'Epsilon Finanças', emissao: '15/10/2024', valor: 22500, tipo: 'Entrada', status: 'Autorizada' },
]

export type Funcionario = {
  id: string
  nome: string
  empresa: string
  cargo: string
  admissao: string
  salario: number
  status: 'Ativo' | 'Férias' | 'Demitido'
  pendencia: string
}

export const funcionarios: Funcionario[] = [
  { id: 'f1', nome: 'Roberto Silva', empresa: 'Alfa Contabilidade', cargo: 'Gerente', admissao: '01/03/2021', salario: 4200, status: 'Ativo', pendencia: '—' },
  { id: 'f2', nome: 'Fernanda Costa', empresa: 'Beta Assessoria', cargo: 'Analista', admissao: '15/07/2022', salario: 3100, status: 'Ativo', pendencia: 'FGTS' },
  { id: 'f3', nome: 'Marcos Alves', empresa: 'Alfa Contabilidade', cargo: 'Assistente', admissao: '01/01/2023', salario: 2200, status: 'Férias', pendencia: '—' },
  { id: 'f4', nome: 'Juliana Mendes', empresa: 'Delta Contadores', cargo: 'Coordenadora', admissao: '10/06/2020', salario: 5500, status: 'Ativo', pendencia: 'Admissão doc.' },
  { id: 'f5', nome: 'Sérgio Lima', empresa: 'Beta Assessoria', cargo: 'Operador', admissao: '01/09/2023', salario: 1900, status: 'Demitido', pendencia: 'Rescisão' },
]

export const solicitacoesCliente = [
  { protocolo: '#0421', cliente: 'Alfa Contabilidade', assunto: 'Emissão de Certidão Negativa', status: 'Aberto', data: 'hoje 09:12' },
  { protocolo: '#0420', cliente: 'Maria Souza', assunto: 'Dúvida sobre Carnê-Leão setembro', status: 'Em andamento', data: 'hoje 08:45' },
  { protocolo: '#0419', cliente: 'Beta Assessoria', assunto: 'Solicitação de alvará renovação', status: 'Aguardando', data: 'ontem 16:30' },
  { protocolo: '#0418', cliente: 'Delta Contadores', assunto: 'Rescisão funcionário — urgente', status: 'Em andamento', data: 'ontem 14:00' },
  { protocolo: '#0417', cliente: 'Gama Fiscal', assunto: 'Parcelamento DAS em aberto', status: 'Aberto', data: '18/10' },
  { protocolo: '#0416', cliente: 'João Ferreira', assunto: 'Declaração IRPF 2024 — revisão', status: 'Resolvido', data: '17/10' },
]

export const documentosCliente = [
  { nome: 'Extrato bancário Set/2024', cliente: 'Alfa Contabilidade', tipo: 'Extrato', data: '20/10/2024', tamanho: '218 KB' },
  { nome: 'Contrato social atualizado', cliente: 'Beta Assessoria', tipo: 'Contrato', data: '19/10/2024', tamanho: '1.4 MB' },
  { nome: 'DAS outubro 2024', cliente: 'Gama Fiscal', tipo: 'Guia', data: '18/10/2024', tamanho: '48 KB' },
  { nome: 'Certidão negativa PGFN', cliente: 'Delta Contadores', tipo: 'Certidão', data: '17/10/2024', tamanho: '620 KB' },
  { nome: 'NFS-e XML #1248', cliente: 'Alfa Contabilidade', tipo: 'NF-e/NFS-e', data: '16/10/2024', tamanho: '8 KB' },
  { nome: 'Folha pagamento Set/2024', cliente: 'Epsilon Finanças', tipo: 'Folha', data: '15/10/2024', tamanho: '340 KB' },
  { nome: 'Comprovante IRPF 2024', cliente: 'Maria Souza', tipo: 'IRPF', data: '14/10/2024', tamanho: '156 KB' },
  { nome: 'Alvará municipal 2024', cliente: 'Beta Assessoria', tipo: 'Alvará', data: '10/10/2024', tamanho: '900 KB' },
]

export const faturasCliente = [
  { cliente: 'Alfa Contabilidade', competencia: 'Out/2024', vencimento: '10/10/2024', valor: 890, status: 'Pago' },
  { cliente: 'Alfa Contabilidade', competencia: 'Set/2024', vencimento: '10/09/2024', valor: 890, status: 'Pago' },
  { cliente: 'Beta Assessoria', competencia: 'Out/2024', vencimento: '10/10/2024', valor: 650, status: 'Pago' },
  { cliente: 'Gama Fiscal', competencia: 'Out/2024', vencimento: '10/10/2024', valor: 890, status: 'Em atraso' },
  { cliente: 'Maria Souza', competencia: 'Out/2024', vencimento: '15/10/2024', valor: 390, status: 'Pago' },
  { cliente: 'Delta Contadores', competencia: 'Nov/2024', vencimento: '10/11/2024', valor: 890, status: 'Pendente' },
  { cliente: 'João Ferreira', competencia: 'Nov/2024', vencimento: '15/11/2024', valor: 390, status: 'Pendente' },
  { cliente: 'Epsilon Finanças', competencia: 'Nov/2024', vencimento: '10/11/2024', valor: 1890, status: 'Pendente' },
  { cliente: 'Tech Founders Ltda', competencia: 'Out/2024', vencimento: '05/10/2024', valor: 1490, status: 'Pendente' },
]

export const responsaveis = equipe.map((m) => m.nome)
