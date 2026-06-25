import { NextRequest, NextResponse } from 'next/server';
import { getDB, getEnv } from '@/lib/db';
import { verifyAdminToken, TOKEN_NAME } from '@/lib/auth';

async function isAuthorized(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(TOKEN_NAME)?.value;
  if (!token) return false;
  const env = await getEnv();
  return verifyAdminToken(token, env.ADMIN_SECRET);
}

export async function GET(req: NextRequest) {
  if (!(await isAuthorized(req))) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || 'open';
  const db = await getDB();

  const rows = await db.prepare(
    `SELECT r.*, c.name as category_name FROM service_requests r
     JOIN categories c ON c.id = r.category_id
     WHERE r.status = ?
     ORDER BY r.created_at DESC LIMIT 100`
  ).bind(status).all();

  return NextResponse.json({ requests: rows.results });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthorized(req))) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const body = await req.json() as Record<string, unknown>;
  const { id, status, client_name, client_email, client_phone, city, neighborhood, description, urgency } = body;

  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

  const db = await getDB();

  // Atualização de status apenas
  if (status !== undefined && !client_name) {
    if (!['open', 'matched', 'closed'].includes(status as string)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
    }
    await db.prepare(`UPDATE service_requests SET status = ?, updated_at = datetime('now') WHERE id = ?`).bind(status, id).run();
    return NextResponse.json({ success: true });
  }

  // Edição completa
  await db.prepare(
    `UPDATE service_requests SET client_name=?, client_email=?, client_phone=?, city=?, neighborhood=?,
     description=?, urgency=?, updated_at=datetime('now') WHERE id=?`
  ).bind(client_name, client_email, client_phone, city, neighborhood || null, description, urgency || 'normal', id).run();

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthorized(req))) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { id } = await req.json() as { id: number };
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

  const db = await getDB();
  await db.prepare('DELETE FROM service_requests WHERE id = ?').bind(id).run();
  return NextResponse.json({ success: true });
}
