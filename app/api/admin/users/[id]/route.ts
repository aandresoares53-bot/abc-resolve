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
  const body = await request.json() as { plan?: string; status?: string; notes?: string; name?: string; phone?: string; service?: string; city?: string };

  const { plan, status, notes, name, phone, service, city } = body;
  const now = new Date().toISOString();

  await sql`
    UPDATE users SET
      plan = COALESCE(${plan ?? null}, plan),
      status = COALESCE(${status ?? null}, status),
      notes = COALESCE(${notes ?? null}, notes),
      name = COALESCE(${name ?? null}, name),
      phone = COALESCE(${phone ?? null}, phone),
      service = COALESCE(${service ?? null}, service),
      city = COALESCE(${city ?? null}, city),
      updated_at = ${now}
    WHERE id = ${id}
  `;

  return NextResponse.json({ message: 'Atualizado com sucesso' });
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
  await sql`DELETE FROM users WHERE id = ${id}`;
  return NextResponse.json({ message: 'Usuário excluído com sucesso' });
}
