import { NextRequest, NextResponse } from 'next/server';
import { sql, ensureSchema } from '@/lib/postgres';

function isAuthorized(request: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET ?? '';
  return request.headers.get('Authorization') === `Bearer ${adminSecret}`;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  await ensureSchema();
  const { id } = await params;
  const body = await request.json() as { status: string };
  const { status } = body;
  const now = new Date().toISOString();
  const paid_at = status === 'paid' ? now : null;

  await sql`
    UPDATE payments SET
      status = ${status},
      paid_at = CASE WHEN ${status} = 'paid' THEN ${now} ELSE paid_at END
    WHERE id = ${id}
  `;

  return NextResponse.json({ message: 'Pagamento atualizado', paid_at });
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
  await sql`DELETE FROM payments WHERE id = ${id}`;
  return NextResponse.json({ message: 'Excluído com sucesso' });
}
