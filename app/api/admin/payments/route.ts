import { NextRequest, NextResponse } from 'next/server';
import { sql, ensureSchema } from '@/lib/postgres';
import { randomUUID } from 'crypto';

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
    SELECT p.id, p.user_id, p.amount, p.description, p.status, p.due_date, p.paid_at, p.created_at,
           u.name as user_name, u.email as user_email, u.type as user_type
    FROM payments p
    JOIN users u ON u.id = p.user_id
    ORDER BY p.created_at DESC
  `;
  return NextResponse.json({ payments: result.rows });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  await ensureSchema();
  const body = await request.json() as { user_id: string; amount: number; description: string; due_date?: string };
  const { user_id, amount, description, due_date } = body;

  if (!user_id || !amount || !description) {
    return NextResponse.json({ error: 'Campos obrigatórios: user_id, amount, description' }, { status: 400 });
  }

  const id = randomUUID();
  await sql`
    INSERT INTO payments (id, user_id, amount, description, due_date)
    VALUES (${id}, ${user_id}, ${amount}, ${description}, ${due_date ?? null})
  `;

  return NextResponse.json({ message: 'Cobrança criada com sucesso', id });
}
