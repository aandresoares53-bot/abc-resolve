import { type NextRequest, NextResponse } from 'next/server';
import { normalizeProperty } from '../../lib/matching';

export const runtime = 'edge';

function getDB(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req as any).cf?.env?.DB as D1Database | undefined;
}

export async function GET(req: NextRequest) {
  const db = getDB(req);
  if (!db) return NextResponse.json({ error: 'DB indisponível' }, { status: 503 });

  const url = new URL(req.url);
  const operation = url.searchParams.get('operation'); // sale | rent
  const type = url.searchParams.get('type');
  const city = url.searchParams.get('city');
  const minPrice = url.searchParams.get('min_price');
  const maxPrice = url.searchParams.get('max_price');
  const minBedrooms = url.searchParams.get('min_bedrooms');
  const limit = parseInt(url.searchParams.get('limit') ?? '50');
  const offset = parseInt(url.searchParams.get('offset') ?? '0');

  let query = 'SELECT * FROM properties WHERE active = 1';
  const params: (string | number)[] = [];

  if (operation) { query += ' AND operation = ?'; params.push(operation); }
  if (type) { query += ' AND type = ?'; params.push(type); }
  if (city) { query += ' AND city LIKE ?'; params.push(`%${city}%`); }
  if (minPrice) { query += ' AND price >= ?'; params.push(parseFloat(minPrice)); }
  if (maxPrice) { query += ' AND price <= ?'; params.push(parseFloat(maxPrice)); }
  if (minBedrooms) { query += ' AND bedrooms >= ?'; params.push(parseInt(minBedrooms)); }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const { results } = await db.prepare(query).bind(...params).all();
  const properties = results.map(r => normalizeProperty(r as Record<string, unknown>));

  // count
  let countQuery = 'SELECT COUNT(*) as total FROM properties WHERE active = 1';
  const countParams: (string | number)[] = [];
  if (operation) { countQuery += ' AND operation = ?'; countParams.push(operation); }
  if (type) { countQuery += ' AND type = ?'; countParams.push(type); }
  if (city) { countQuery += ' AND city LIKE ?'; countParams.push(`%${city}%`); }
  if (minPrice) { countQuery += ' AND price >= ?'; countParams.push(parseFloat(minPrice)); }
  if (maxPrice) { countQuery += ' AND price <= ?'; countParams.push(parseFloat(maxPrice)); }
  if (minBedrooms) { countQuery += ' AND bedrooms >= ?'; countParams.push(parseInt(minBedrooms)); }

  const countResult = await db.prepare(countQuery).bind(...countParams).first<{ total: number }>();

  return NextResponse.json({ properties, total: countResult?.total ?? 0, limit, offset });
}
