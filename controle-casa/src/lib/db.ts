import { neon } from '@neondatabase/serverless'

export const sql = neon(process.env.DATABASE_URL!)

export async function setupAuth() {
  await sql`
    CREATE TABLE IF NOT EXISTS cc_users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      trial_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
      paid BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE cc_users ADD COLUMN IF NOT EXISTS trial_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')`
  await sql`ALTER TABLE cc_users ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT FALSE`
  await sql`
    CREATE TABLE IF NOT EXISTS cc_sessions (
      token TEXT PRIMARY KEY,
      user_id INT NOT NULL REFERENCES cc_users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
}

export async function setupDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS cc_gastos (
      id SERIAL PRIMARY KEY,
      descricao TEXT NOT NULL,
      cat TEXT NOT NULL,
      val NUMERIC(10,2) NOT NULL,
      data TEXT,
      mes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE cc_gastos ADD COLUMN IF NOT EXISTS mes TEXT`
  await sql`ALTER TABLE cc_gastos ADD COLUMN IF NOT EXISTS user_id INT REFERENCES cc_users(id) ON DELETE CASCADE`
  await sql`
    CREATE TABLE IF NOT EXISTS cc_previsoes (
      id SERIAL PRIMARY KEY,
      descricao TEXT NOT NULL,
      cat TEXT NOT NULL,
      val NUMERIC(10,2) NOT NULL,
      data_prevista TEXT,
      recorrente BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE cc_previsoes ADD COLUMN IF NOT EXISTS user_id INT REFERENCES cc_users(id) ON DELETE CASCADE`
  await sql`
    CREATE TABLE IF NOT EXISTS cc_config (
      id SERIAL PRIMARY KEY,
      user_id INT UNIQUE REFERENCES cc_users(id) ON DELETE CASCADE,
      orcamento NUMERIC(10,2) DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE cc_config ADD COLUMN IF NOT EXISTS user_id INT REFERENCES cc_users(id) ON DELETE CASCADE`
  await sql`ALTER TABLE cc_config ADD COLUMN IF NOT EXISTS orcamento NUMERIC(10,2) DEFAULT 0`
  await sql`ALTER TABLE cc_config ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()`
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS cc_config_user_id_idx ON cc_config (user_id)`
}
