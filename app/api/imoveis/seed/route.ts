import { type NextRequest, NextResponse } from 'next/server';
import { getSQL } from '../../../lib/db';
import { SEED_PROPERTIES } from '../../../lib/seed-properties';

export async function POST(_req: NextRequest) {
  try {
    const sql = getSQL();

    // Limpa e reinsere
    await sql`DELETE FROM properties`;

    const now = new Date().toISOString();
    let inserted = 0;

    for (const prop of SEED_PROPERTIES) {
      const id = crypto.randomUUID();
      await sql`
        INSERT INTO properties
          (id, title, description, type, operation, price, area_m2, bedrooms, bathrooms,
           parking_spots, city, neighborhood, address, features, images, source, source_url,
           contact_name, contact_phone, active, scraped_at, created_at)
        VALUES (
          ${id}, ${prop.title}, ${prop.description}, ${prop.type}, ${prop.operation},
          ${prop.price}, ${prop.area_m2}, ${prop.bedrooms}, ${prop.bathrooms},
          ${prop.parking_spots}, ${prop.city}, ${prop.neighborhood}, ${prop.address},
          ${JSON.stringify(prop.features)}, ${JSON.stringify(prop.images)},
          ${prop.source}, ${prop.source_url ?? null},
          ${prop.contact_name}, ${prop.contact_phone},
          true, ${now}, ${now}
        )
      `;
      inserted++;
    }

    return NextResponse.json({ success: true, inserted, message: `${inserted} imóveis carregados com sucesso.` });
  } catch (error) {
    console.error('Erro no seed:', error);
    return NextResponse.json({ error: 'Erro ao carregar imóveis', detail: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sql = getSQL();
    const rows = await sql`SELECT COUNT(*) as total FROM properties WHERE active = true`;
    const total = parseInt(String((rows[0] as Record<string, unknown>)?.total ?? '0'));
    return NextResponse.json({ total });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
