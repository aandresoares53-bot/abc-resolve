-- Tabela de imóveis capturados
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('apartment','house','commercial','land','kitnet')),
  operation TEXT NOT NULL CHECK (operation IN ('sale','rent')),
  price REAL NOT NULL,
  area_m2 REAL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  parking_spots INTEGER,
  city TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  address TEXT,
  features TEXT DEFAULT '[]',   -- JSON array: ['pool','gym','elevator','furnished','pet_friendly','gated','balcony']
  images TEXT DEFAULT '[]',     -- JSON array of image URLs
  source TEXT NOT NULL DEFAULT 'manual', -- vivareal | zapimoveis | olx | manual
  source_url TEXT,
  source_id TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  scraped_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Perfis de compradores/locatários interessados
CREATE TABLE IF NOT EXISTS buyer_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  operation_type TEXT NOT NULL DEFAULT 'both' CHECK (operation_type IN ('sale','rent','both')),
  property_types TEXT DEFAULT '[]',   -- JSON: ['apartment','house',...]
  cities TEXT DEFAULT '[]',           -- JSON: ['Santo André','São Bernardo do Campo',...]
  neighborhoods TEXT DEFAULT '[]',    -- JSON: ['Centro','Vila Gomes Cardim',...]
  min_price REAL,
  max_price REAL,
  min_area REAL,
  max_area REAL,
  min_bedrooms INTEGER,
  max_bedrooms INTEGER,
  required_features TEXT DEFAULT '[]', -- JSON array of required features
  notes TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Matches entre imóveis e perfis
CREATE TABLE IF NOT EXISTS property_matches (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  profile_id TEXT NOT NULL,
  score REAL NOT NULL,           -- 0.0 – 1.0
  score_breakdown TEXT,         -- JSON: {"price":0.9,"location":1.0,"type":1.0,...}
  notified INTEGER NOT NULL DEFAULT 0,
  notified_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY(profile_id) REFERENCES buyer_profiles(id) ON DELETE CASCADE,
  UNIQUE(property_id, profile_id)
);

CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_operation ON properties(operation);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_active ON properties(active);
CREATE INDEX IF NOT EXISTS idx_buyer_profiles_active ON buyer_profiles(active);
CREATE INDEX IF NOT EXISTS idx_matches_property ON property_matches(property_id);
CREATE INDEX IF NOT EXISTS idx_matches_profile ON property_matches(profile_id);
CREATE INDEX IF NOT EXISTS idx_matches_score ON property_matches(score DESC);
