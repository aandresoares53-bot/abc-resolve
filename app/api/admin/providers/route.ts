import { NextRequest, NextResponse } from 'next/server';
import { sql, ensureSchema } from '@/lib/postgres';
import type { User } from '@/lib/db';

function isAuthorized(request: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET ?? '';
  return request.headers.get('Authorization') === `Bearer ${adminSecret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  await ensureSchema();

  const result = await sql<Omit<User, 'password_hash' | 'updated_at' | 'type'>>`
    SELECT id, name, email, phone, service, city, created_at
    FROM users
    WHERE type = 'provider'
    ORDER BY created_at DESC
  `;

  return NextResponse.json({ providers: result.rows });
}
