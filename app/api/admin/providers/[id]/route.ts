import { NextRequest, NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET ?? '';
  return request.headers.get('Authorization') === `Bearer ${secret}`;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { id } = await params;
  const sql = getSQL();

  const rows = await sql`SELECT id FROM users WHERE id = ${id} AND type = 'provider' LIMIT 1`;
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Prestador não encontrado' }, { status: 404 });
  }

  await sql`DELETE FROM users WHERE id = ${id}`;
  return NextResponse.json({ message: 'Prestador excluído com sucesso' });
}
