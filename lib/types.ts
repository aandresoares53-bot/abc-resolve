// Usuario types
export type TipoUsuario = 'cliente' | 'prestador' | 'admin';

export interface User {
  id: number;
  email: string;
  tipo: TipoUsuario;
  nome: string;
  telefone?: string;
  estado: string;
  cidade: string;
  avatar_url?: string;
  bio?: string;
  verificado: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface AuthPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload extends AuthPayload {
  nome: string;
  tipo: TipoUsuario;
  cidade: string;
  estado: string;
  telefone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Categoria
export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  icone?: string;
  slug: string;
  criada_em: string;
}

// Serviço
export interface Servico {
  id: number;
  prestador_id: number;
  categoria_id: number;
  titulo: string;
  descricao: string;
  preco_minimo: number;
  preco_maximo: number;
  tempo_medio_dias?: number;
  experiencia_anos: number;
  imagens: string[];
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
  prestador?: User;
  categoria?: Categoria;
  avaliacoes?: Avaliacao[];
  media_avaliacoes?: number;
  total_avaliacoes?: number;
}

// Avaliação
export interface Avaliacao {
  id: number;
  servico_id: number;
  cliente_id: number;
  prestador_id: number;
  estrelas: number;
  comentario?: string;
  criada_em: string;
  cliente?: User;
}

// Solicitação
export interface Solicitacao {
  id: number;
  cliente_id: number;
  categoria_id: number;
  titulo: string;
  descricao: string;
  orcamentos_count: number;
  status: 'aberta' | 'encerrada' | 'contratada';
  criada_em: string;
  encerrada_em?: string;
  cliente?: User;
  categoria?: Categoria;
}

// Orçamento
export interface Orcamento {
  id: number;
  solicitacao_id: number;
  prestador_id: number;
  valor: number;
  descricao?: string;
  tempo_dias?: number;
  status: 'pendente' | 'aceito' | 'rejeitado';
  criado_em: string;
  respondido_em?: string;
  prestador?: User;
  solicitacao?: Solicitacao;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
