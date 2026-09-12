import { type NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { normalizeProperty } from '../../lib/matching';

function getSQL() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) throw new Error('DATABASE_URL não configurada');
  return neon(url);
}

export async function GET(req: NextRequest) {
  try {
    const sql = getSQL();
    const url = new URL(req.url);

    const operation = url.searchParams.get('operation');
    const type = url.searchParams.get('type');
    const city = url.searchParams.get('city');
    const minPrice = url.searchParams.get('min_price');
    const maxPrice = url.searchParams.get('max_price');
    const minBedrooms = url.searchParams.get('min_bedrooms');
    const limit = parseInt(url.searchParams.get('limit') ?? '50');
    const offset = parseInt(url.searchParams.get('offset') ?? '0');

    // Use parameterized tagged template for safety
    // Build filters using conditional chaining
    let rows;
    if (operation && type && city) {
      rows = await sql`SELECT * FROM properties WHERE active = true AND operation = ${operation} AND type = ${type} AND city ILIKE ${'%' + city + '%'} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else if (operation && type) {
      rows = await sql`SELECT * FROM properties WHERE active = true AND operation = ${operation} AND type = ${type} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else if (operation && city) {
      rows = await sql`SELECT * FROM properties WHERE active = true AND operation = ${operation} AND city ILIKE ${'%' + city + '%'} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else if (type && city) {
      rows = await sql`SELECT * FROM properties WHERE active = true AND type = ${type} AND city ILIKE ${'%' + city + '%'} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else if (operation) {
      rows = await sql`SELECT * FROM properties WHERE active = true AND operation = ${operation} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else if (type) {
      rows = await sql`SELECT * FROM properties WHERE active = true AND type = ${type} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else if (city) {
      rows = await sql`SELECT * FROM properties WHERE active = true AND city ILIKE ${'%' + city + '%'} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    } else {
      rows = await sql`SELECT * FROM properties WHERE active = true ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    }

    // Apply remaining filters in JS (simpler than building more combos)
    let filtered = rows as Record<string, unknown>[];
    if (minPrice) filtered = filtered.filter(r => Number(r.price) >= parseFloat(minPrice));
    if (maxPrice) filtered = filtered.filter(r => Number(r.price) <= parseFloat(maxPrice));
    if (minBedrooms) filtered = filtered.filter(r => Number(r.bedrooms) >= parseInt(minBedrooms));

    const properties = filtered.map(r => normalizeProperty(r));
    const countRows = await sql`SELECT COUNT(*) as total FROM properties WHERE active = true`;
    const total = parseInt(String((countRows[0] as Record<string, unknown>).total));

    return NextResponse.json({ properties, total, limit, offset });
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    return NextResponse.json({ error: 'Erro ao buscar imóveis', detail: String(error) }, { status: 500 });
  }
}
