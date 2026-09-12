/**
 * Rota para popular o banco com imóveis da região do ABC
 * POST /api/imoveis/seed - insere os imóveis de demonstração
 */
import { type NextRequest, NextResponse } from 'next/server';
import { SEED_PROPERTIES } from '../../../lib/seed-properties';

export const runtime = 'edge';

function getDB(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req as any).cf?.env?.DB as D1Database | undefined;
}

function generateId(): string {
  return crypto.randomUUID();
}

export async function POST(req: NextRequest) {
  const db = getDB(req);
  if (!db) return NextResponse.json({ error: 'DB indisponível' }, { status: 503 });

  // Verifica se já tem dados
  const existing = await db.prepare('SELECT COUNT(*) as cnt FROM properties').first<{ cnt: number }>();
  if ((existing?.cnt ?? 0) > 0) {
    // apaga e reinsere para garantir dados frescos
    await db.prepare('DELETE FROM properties').run();
  }

  const now = new Date().toISOString();
  let inserted = 0;

  for (const prop of SEED_PROPERTIES) {
    await db.prepare(`
      INSERT INTO properties
        (id, title, description, type, operation, price, area_m2, bedrooms, bathrooms,
         parking_spots, city, neighborhood, address, features, images, source, source_url,
         contact_name, contact_phone, active, scraped_at, created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?,?)
    `).bind(
      generateId(),
      prop.title,
      prop.description,
      prop.type,
      prop.operation,
      prop.price,
      prop.area_m2,
      prop.bedrooms,
      prop.bathrooms,
      prop.parking_spots,
      prop.city,
      prop.neighborhood,
      prop.address,
      JSON.stringify(prop.features),
      JSON.stringify(prop.images),
      prop.source,
      prop.source_url ?? null,
      prop.contact_name,
      prop.contact_phone,
      now,
      now,
    ).run();
    inserted++;
  }

  return NextResponse.json({ success: true, inserted, message: `${inserted} imóveis carregados com sucesso.` });
}

export async function GET(req: NextRequest) {
  const db = getDB(req);
  if (!db) return NextResponse.json({ error: 'DB indisponível' }, { status: 503 });
  const result = await db.prepare('SELECT COUNT(*) as cnt FROM properties WHERE active=1').first<{ cnt: number }>();
  return NextResponse.json({ total: result?.cnt ?? 0 });
}
