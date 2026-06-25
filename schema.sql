-- Categorias de serviço
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  description TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Prestadores de serviço
CREATE TABLE IF NOT EXISTS providers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  city TEXT NOT NULL,
  neighborhood TEXT,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  description TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Solicitações de serviço
CREATE TABLE IF NOT EXISTS service_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  description TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'normal', -- urgent, normal, flexible
  status TEXT NOT NULL DEFAULT 'open', -- open, matched, closed
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Assinaturas dos prestadores
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_id INTEGER NOT NULL REFERENCES providers(id),
  status TEXT NOT NULL DEFAULT 'pending', -- pending, active, expired, cancelled
  amount TEXT NOT NULL DEFAULT '19.90',
  pix_txid TEXT,
  paid_at TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Avaliações de prestadores
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_id INTEGER NOT NULL REFERENCES providers(id),
  client_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Seed de categorias
INSERT OR IGNORE INTO categories (name, slug, icon, description) VALUES
  ('Reformas e Construção', 'reformas', '🔨', 'Pedreiros, pintores, eletricistas, encanadores e mais'),
  ('Limpeza e Organização', 'limpeza', '🧹', 'Faxineiros, diaristas, limpeza pós-obra'),
  ('Manutenção Elétrica', 'eletrica', '⚡', 'Eletricistas residenciais e comerciais'),
  ('Encanamento', 'encanamento', '🔧', 'Encanadores, desentupidores, hidráulica em geral'),
  ('Pintura', 'pintura', '🎨', 'Pintores residenciais, comerciais e artísticos'),
  ('Jardinagem', 'jardinagem', '🌱', 'Jardineiros, paisagistas e podadores'),
  ('Mudanças e Fretes', 'mudancas', '🚛', 'Fretes, mudanças locais e transportes'),
  ('Tecnologia e TI', 'tecnologia', '💻', 'Suporte técnico, redes, instalação de equipamentos'),
  ('Aulas e Cursos', 'aulas', '📚', 'Professores particulares, reforço escolar, cursos'),
  ('Beleza e Estética', 'beleza', '💇', 'Cabeleireiros, manicures, maquiadores a domicílio'),
  ('Saúde e Bem-estar', 'saude', '🏥', 'Enfermeiros, cuidadores, fisioterapeutas'),
  ('Eventos e Festas', 'eventos', '🎉', 'Fotógrafos, DJs, buffet, decoração de festas');
