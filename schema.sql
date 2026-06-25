-- ABC Resolve - Marketplace Schema

-- Usuários (clientes e prestadores)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('cliente', 'prestador', 'admin')),
  nome TEXT NOT NULL,
  telefone TEXT,
  estado TEXT,
  cidade TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  verificado BOOLEAN DEFAULT 0,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Categorias de serviços
CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT UNIQUE NOT NULL,
  descricao TEXT,
  icone TEXT,
  slug TEXT UNIQUE NOT NULL,
  criada_em TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Serviços (oferecidos por prestadores)
CREATE TABLE IF NOT EXISTS servicos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prestador_id INTEGER NOT NULL,
  categoria_id INTEGER NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  preco_minimo DECIMAL NOT NULL,
  preco_maximo DECIMAL NOT NULL,
  tempo_medio_dias INTEGER,
  experiencia_anos INTEGER DEFAULT 0,
  imagens TEXT DEFAULT '[]',
  ativo BOOLEAN DEFAULT 1,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (prestador_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Avaliações de serviços
CREATE TABLE IF NOT EXISTS avaliacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  servico_id INTEGER NOT NULL,
  cliente_id INTEGER NOT NULL,
  prestador_id INTEGER NOT NULL,
  estrelas INTEGER NOT NULL CHECK(estrelas >= 1 AND estrelas <= 5),
  comentario TEXT,
  criada_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE,
  FOREIGN KEY (cliente_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (prestador_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Solicitações de serviços (clientes postam)
CREATE TABLE IF NOT EXISTS solicitacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id INTEGER NOT NULL,
  categoria_id INTEGER NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  orcamentos_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'aberta' CHECK(status IN ('aberta', 'encerrada', 'contratada')),
  criada_em TEXT NOT NULL DEFAULT (datetime('now')),
  encerrada_em TEXT,
  FOREIGN KEY (cliente_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Orçamentos (respostas dos prestadores)
CREATE TABLE IF NOT EXISTS orcamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  solicitacao_id INTEGER NOT NULL,
  prestador_id INTEGER NOT NULL,
  valor DECIMAL NOT NULL,
  descricao TEXT,
  tempo_dias INTEGER,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK(status IN ('pendente', 'aceito', 'rejeitado')),
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  respondido_em TEXT,
  FOREIGN KEY (solicitacao_id) REFERENCES solicitacoes(id) ON DELETE CASCADE,
  FOREIGN KEY (prestador_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_tipo ON users(tipo);
CREATE INDEX IF NOT EXISTS idx_servicos_prestador ON servicos(prestador_id);
CREATE INDEX IF NOT EXISTS idx_servicos_categoria ON servicos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_servico ON avaliacoes(servico_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_prestador ON avaliacoes(prestador_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_cliente ON solicitacoes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_categoria ON solicitacoes(categoria_id);
CREATE INDEX IF NOT EXISTS idx_solicitacoes_status ON solicitacoes(status);
CREATE INDEX IF NOT EXISTS idx_orcamentos_solicitacao ON orcamentos(solicitacao_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_prestador ON orcamentos(prestador_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_status ON orcamentos(status);

-- Seed: Categorias padrão
INSERT OR IGNORE INTO categorias (nome, slug, descricao, icone) VALUES
  ('Encanador', 'encanador', 'Serviços de encanaria e hidráulica', '🔧'),
  ('Eletricista', 'eletricista', 'Serviços elétricos residenciais e comerciais', '⚡'),
  ('Marceneiro', 'marceneiro', 'Móveis e marcenaria sob medida', '🪵'),
  ('Pedreiro', 'pedreiro', 'Construção, alvenaria e reforma', '🏗️'),
  ('Pintor', 'pintor', 'Pintura residencial e comercial', '🎨'),
  ('Jardinagem', 'jardinagem', 'Paisagismo e cuidados com plantas', '🌿'),
  ('Limpeza', 'limpeza', 'Serviços de limpeza e organização', '🧹'),
  ('Mecânico', 'mecanico', 'Serviços automotivos e manutenção', '🚗'),
  ('Aulas', 'aulas', 'Reforço escolar e cursos', '📚'),
  ('Beleza', 'beleza', 'Cabelo, manicure e estética', '💇'),
  ('Consultoria', 'consultoria', 'Consultoria empresarial e profissional', '💼'),
  ('Tecnologia', 'tecnologia', 'Reparo de computadores e instalações', '💻');
