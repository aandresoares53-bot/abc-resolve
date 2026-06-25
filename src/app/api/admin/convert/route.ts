import { NextRequest, NextResponse } from 'next/server';
import { getDB, getEnv } from '@/lib/db';
import { verifyAdminToken, TOKEN_NAME } from '@/lib/auth';

async function isAuthorized(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(TOKEN_NAME)?.value;
  if (!token) return false;
  const env = await getEnv();
  return verifyAdminToken(token, env.ADMIN_SECRET);
}

// Converte solicitação → prestador
export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const body = await req.json() as Record<string, unknown>;
  const { direction, source_id, whatsapp, neighborhood, experience_years, urgency } = body;

  if (!direction || !source_id) return NextResponse.json({ error: 'Dados obrigatórios faltando' }, { status: 400 });

  const db = await getDB();

  if (direction === 'request_to_provider') {
    const req_row = await db.prepare(
      `SELECT r.*, r.category_id FROM service_requests r WHERE r.id = ?`
    ).bind(source_id).first<{ id: number; client_name: string; client_email: string; client_phone: string; city: string; neighborhood?: string; description: string; category_id: number }>();

    if (!req_row) return NextResponse.json({ error: 'Solicitação não encontrada' }, { status: 404 });

    const existing = await db.prepare('SELECT id FROM providers WHERE email = ?').bind(req_row.client_email).first<{ id: number }>();
    if (existing) return NextResponse.json({ error: 'E-mail já cadastrado como prestador' }, { status: 409 });

    const insert = await db.prepare(
      `INSERT INTO providers (name, email, phone, whatsapp, city, neighborhood, category_id, description, experience_years, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
    ).bind(
      req_row.client_name, req_row.client_email, req_row.client_phone,
      whatsapp || null, req_row.city, neighborhood || req_row.neighborhood || null,
      req_row.category_id, req_row.description, Number(experience_years) || 0
    ).run();

    if (insert.meta.last_row_id) {
      await db.prepare(
        `INSERT INTO subscriptions (provider_id, status, amount) VALUES (?, 'pending', '19.90')`
      ).bind(insert.meta.last_row_id).run();
    }

    return NextResponse.json({ success: true, new_id: insert.meta.last_row_id });
  }

  if (direction === 'provider_to_request') {
    const prov = await db.prepare(
      `SELECT p.*, p.category_id FROM providers p WHERE p.id = ?`
    ).bind(source_id).first<{ id: number; name: string; email: string; phone: string; city: string; neighborhood?: string; description: string; category_id: number }>();

    if (!prov) return NextResponse.json({ error: 'Prestador não encontrado' }, { status: 404 });

    const insert = await db.prepare(
      `INSERT INTO service_requests (client_name, client_email, client_phone, city, neighborhood, category_id, description, urgency, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open')`
    ).bind(
      prov.name, prov.email, prov.phone,
      prov.city, prov.neighborhood || null,
      prov.category_id, prov.description, urgency || 'normal'
    ).run();

    return NextResponse.json({ success: true, new_id: insert.meta.last_row_id });
  }

  return NextResponse.json({ error: 'Direção inválida' }, { status: 400 });
}
