export const CIDADES_ABC = [
  'Santo André',
  'São Bernardo do Campo',
  'São Caetano do Sul',
];

export const CIDADES_SP = [
  ...CIDADES_ABC,
  'São Paulo',
  'Guarulhos',
  'Campinas',
  'São José dos Campos',
  'Sorocaba',
  'Santos',
  'Ribeirão Preto',
  'Piracicaba',
  'Jundiaí',
  'Presidente Prudente',
  'Mogi-Guaçu',
  'Marília',
  'Araçatuba',
  'Bauru',
];

export const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export const STATUS_SOLICITACAO = [
  { value: 'aberta', label: 'Aberta', color: 'blue' },
  { value: 'encerrada', label: 'Encerrada', color: 'gray' },
  { value: 'contratada', label: 'Contratada', color: 'green' },
];

export const STATUS_ORCAMENTO = [
  { value: 'pendente', label: 'Pendente', color: 'yellow' },
  { value: 'aceito', label: 'Aceito', color: 'green' },
  { value: 'rejeitado', label: 'Rejeitado', color: 'red' },
];

export const CATEGORIAS_DEFAULT = [
  'Encanador',
  'Eletricista',
  'Marceneiro',
  'Pedreiro',
  'Pintor',
  'Jardinagem',
  'Limpeza',
  'Mecânico',
  'Aulas',
  'Beleza',
  'Consultoria',
  'Tecnologia',
];

export const TEMPO_SERVICO = [
  { value: 1, label: '1 dia' },
  { value: 3, label: '3 dias' },
  { value: 7, label: '1 semana' },
  { value: 14, label: '2 semanas' },
  { value: 30, label: '1 mês' },
];
