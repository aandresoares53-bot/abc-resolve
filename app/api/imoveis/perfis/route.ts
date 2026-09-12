import { type NextRequest, NextResponse } from 'next/server';
import { normalizeProfile } from '../../../lib/matching';

export const runtime = 'edge';

function getDB(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req as any).cf?.env?.DB as D1Database | undefined;
}

// GET: listar perfis
export async function GET(req: NextRequest) {
  const db = getDB(req);
  if (!db) return NextResponse.json({ error: 'DB indisponível' }, { status: 503 });

  const { results } = await db.prepare('SELECT * FROM buyer_profiles WHERE active=1 ORDER BY created_at DESC').all();
  const profiles = results.map(r => normalizeProfile(r as Record<string, unknown>));
  return NextResponse.json({ profiles });
}

// POST: criar perfil
export async function POST(req: NextRequest) {
  const db = getDB(req);
  if (!db) return NextResponse.json({ error: 'DB indisponível' }, { status: 503 });

  const body = await req.json() as Record<string, unknown>;

  const {
    name, email, phone, whatsapp,
    operation_type = 'both',
    property_types = [],
    cities = [],
    neighborhoods = [],
    min_price, max_price,
    min_area, max_area,
    min_bedrooms, max_bedrooms,
    required_features = [],
    notes,
  } = body;

  if (!name) return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 });

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.prepare(`
    INSERT INTO buyer_profiles
      (id, name, email, phone, whatsapp, operation_type, property_types, cities,
       neighborhoods, min_price, max_price, min_area, max_area, min_bedrooms, max_bedrooms,
       required_features, notes, active, created_at, updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,?)
  `).bind(
    id, name, email ?? null, phone ?? null, whatsapp ?? null,
    operation_type,
    JSON.stringify(property_types),
    JSON.stringify(cities),
    JSON.stringify(neighborhoods),
    min_price ?? null, max_price ?? null,
    min_area ?? null, max_area ?? null,
    min_bedrooms ?? null, max_bedrooms ?? null,
    JSON.stringify(required_features),
    notes ?? null,
    now, now,
  ).run();

  const created = await db.prepare('SELECT * FROM buyer_profiles WHERE id=?').bind(id).first();
  return NextResponse.json({ success: true, profile: normalizeProfile(created as Record<string, unknown>) }, { status: 201 });
}
