-- =====================================================
-- ABCResolve — Setup completo para Neon/Postgres
-- Execute via: Vercel dashboard → Storage → Neon → Query
-- =====================================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('provider', 'consumer')),
  service TEXT,
  city TEXT,
  created_at TEXT NOT NULL DEFAULT NOW()::TEXT,
  updated_at TEXT NOT NULL DEFAULT NOW()::TEXT
);

-- Tabela de serviços dos prestadores
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DOUBLE PRECISION CHECK (price IS NULL OR price >= 0),
  rating DOUBLE PRECISION CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
  created_at TEXT NOT NULL DEFAULT NOW()::TEXT,
  FOREIGN KEY(provider_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de imóveis
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('apartment','house','commercial','land','kitnet')),
  operation TEXT NOT NULL CHECK (operation IN ('sale','rent')),
  price DOUBLE PRECISION NOT NULL,
  area_m2 DOUBLE PRECISION,
  bedrooms INTEGER,
  bathrooms INTEGER,
  parking_spots INTEGER,
  city TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  address TEXT,
  features TEXT DEFAULT '[]',
  images TEXT DEFAULT '[]',
  source TEXT NOT NULL DEFAULT 'manual',
  source_url TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  scraped_at TEXT NOT NULL DEFAULT NOW()::TEXT,
  created_at TEXT NOT NULL DEFAULT NOW()::TEXT
);

-- Perfis de compradores/locatários
CREATE TABLE IF NOT EXISTS buyer_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  operation_type TEXT NOT NULL DEFAULT 'both' CHECK (operation_type IN ('sale','rent','both')),
  property_types TEXT DEFAULT '[]',
  cities TEXT DEFAULT '[]',
  neighborhoods TEXT DEFAULT '[]',
  min_price DOUBLE PRECISION,
  max_price DOUBLE PRECISION,
  min_area DOUBLE PRECISION,
  max_area DOUBLE PRECISION,
  min_bedrooms INTEGER,
  max_bedrooms INTEGER,
  required_features TEXT DEFAULT '[]',
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TEXT NOT NULL DEFAULT NOW()::TEXT,
  updated_at TEXT NOT NULL DEFAULT NOW()::TEXT
);

-- Matches
CREATE TABLE IF NOT EXISTS property_matches (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  score DOUBLE PRECISION NOT NULL,
  score_breakdown TEXT,
  notified BOOLEAN NOT NULL DEFAULT FALSE,
  notified_at TEXT,
  created_at TEXT NOT NULL DEFAULT NOW()::TEXT,
  FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY(profile_id) REFERENCES buyer_profiles(id) ON DELETE CASCADE,
  UNIQUE(property_id, profile_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_operation ON properties(operation);
CREATE INDEX IF NOT EXISTS idx_properties_active ON properties(active);
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_active ON buyer_profiles(active);
CREATE INDEX IF NOT EXISTS idx_matches_profile ON property_matches(profile_id);
CREATE INDEX IF NOT EXISTS idx_matches_score ON property_matches(score DESC);
