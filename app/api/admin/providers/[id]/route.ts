import { NextRequest, NextResponse } from 'next/server';
import { sql, ensureSchema } from '@/lib/postgres';

function isAuthorized(request: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET ?? '';
  return request.headers.get('Authorization') === `Bearer ${adminSecret}`;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  await ensureSchema();

  const { id } = await params;

  const existing = await sql`
    SELECT id FROM users WHERE id = ${id} AND type = 'provider' LIMIT 1
  `;

  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Prestador não encontrado' }, { status: 404 });
  }

  await sql`DELETE FROM users WHERE id = ${id}`;

  return NextResponse.json({ message: 'Prestador excluído com sucesso' });
}
