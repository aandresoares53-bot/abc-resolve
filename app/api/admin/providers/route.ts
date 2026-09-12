import { NextRequest, NextResponse } from 'next/server';
import { getSQL, type User } from '@/lib/db';

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET ?? '';
  return request.headers.get('Authorization') === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const sql = getSQL();
  const rows = await sql`
    SELECT id, name, email, phone, service, city, created_at
    FROM users WHERE type = 'provider'
    ORDER BY created_at DESC
  `;

  return NextResponse.json({ providers: rows as Omit<User, 'password_hash' | 'updated_at' | 'type'>[] });
}
