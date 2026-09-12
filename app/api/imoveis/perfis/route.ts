import { type NextRequest, NextResponse } from 'next/server';
import { getSQL } from '../../../lib/db';
import { normalizeProfile } from '../../../lib/matching';

export async function GET() {
  try {
    const sql = getSQL();
    const rows = await sql`SELECT * FROM buyer_profiles WHERE active = true ORDER BY created_at DESC`;
    const profiles = rows.map(r => normalizeProfile(r as Record<string, unknown>));
    return NextResponse.json({ profiles });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sql = getSQL();
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

    await sql`
      INSERT INTO buyer_profiles
        (id, name, email, phone, whatsapp, operation_type, property_types, cities,
         neighborhoods, min_price, max_price, min_area, max_area, min_bedrooms, max_bedrooms,
         required_features, notes, active, created_at, updated_at)
      VALUES (
        ${id}, ${name as string}, ${email as string ?? null}, ${phone as string ?? null},
        ${whatsapp as string ?? null}, ${operation_type as string},
        ${JSON.stringify(property_types)}, ${JSON.stringify(cities)},
        ${JSON.stringify(neighborhoods)},
        ${min_price as number ?? null}, ${max_price as number ?? null},
        ${min_area as number ?? null}, ${max_area as number ?? null},
        ${min_bedrooms as number ?? null}, ${max_bedrooms as number ?? null},
        ${JSON.stringify(required_features)}, ${notes as string ?? null},
        true, ${now}, ${now}
      )
    `;

    const rows = await sql`SELECT * FROM buyer_profiles WHERE id = ${id} LIMIT 1`;
    return NextResponse.json({ success: true, profile: normalizeProfile(rows[0] as Record<string, unknown>) }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar perfil:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
