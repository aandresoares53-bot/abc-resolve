import { NextRequest, NextResponse } from 'next/server';
import { sql, ensureSchema } from '@/lib/postgres';

export async function GET(request: NextRequest) {
  await ensureSchema();

  const { searchParams } = new URL(request.url);
  const service = searchParams.get('service') || '';
  const city = searchParams.get('city') || '';

  const rows = await sql`
    SELECT id, name, phone, service, city, created_at
    FROM users
    WHERE type = 'provider'
      AND (${service} = '' OR LOWER(service) = LOWER(${service}))
      AND (${city} = '' OR LOWER(city) = LOWER(${city}))
    ORDER BY created_at DESC
  `;

  return NextResponse.json({ providers: rows.rows });
}
