/**
 * GET /api/setup — cria as tabelas no banco Neon automaticamente
 * Só precisa rodar uma vez após conectar o banco na Vercel.
 */
import { NextResponse } from 'next/server';
import { getSQL } from '../../lib/db';

export async function GET() {
  try {
    const sql = getSQL();

    await sql`
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
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        provider_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        price DOUBLE PRECISION,
        rating DOUBLE PRECISION,
        created_at TEXT NOT NULL DEFAULT NOW()::TEXT
      )
    `;

    await sql`
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
      )
    `;

    await sql`
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
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS property_matches (
        id TEXT PRIMARY KEY,
        property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
        profile_id TEXT NOT NULL REFERENCES buyer_profiles(id) ON DELETE CASCADE,
        score DOUBLE PRECISION NOT NULL,
        score_breakdown TEXT,
        notified BOOLEAN NOT NULL DEFAULT FALSE,
        notified_at TEXT,
        created_at TEXT NOT NULL DEFAULT NOW()::TEXT,
        UNIQUE(property_id, profile_id)
      )
    `;

    // Índices (ignoram erro se já existirem)
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_properties_active ON properties(active)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_buyer_profiles_active ON buyer_profiles(active)`;

    return NextResponse.json({ success: true, message: 'Banco configurado com sucesso! Acesse /imoveis para começar.' });
  } catch (error) {
    console.error('Erro no setup:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
