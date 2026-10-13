import { NextRequest, NextResponse } from 'next/server';
import { sql, ensureSchema } from '@/lib/postgres';

function isAuthorized(request: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET ?? '';
  return request.headers.get('Authorization') === `Bearer ${adminSecret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  await ensureSchema();
  const result = await sql`
    SELECT id, name, email, phone, type, service, city, plan, status, notes, created_at
    FROM users
    ORDER BY created_at DESC
  `;
  return NextResponse.json({ users: result.rows });
}
