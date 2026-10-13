import { NextRequest, NextResponse } from 'next/server';
import { sql, ensureSchema } from '@/lib/postgres';

function isAuthorized(request: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET ?? '';
  return request.headers.get('Authorization') === `Bearer ${adminSecret}`;
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  await ensureSchema();
  await sql`DELETE FROM users`;

  return NextResponse.json({ message: 'Banco zerado com sucesso' });
}
