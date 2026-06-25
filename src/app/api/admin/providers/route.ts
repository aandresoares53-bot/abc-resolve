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
  const status = searchParams.get('status') || 'pending';
  const db = await getDB();

  const rows = await db.prepare(
    `SELECT p.*, c.name as category_name, c.slug as category_slug,
      COALESCE(s.status, 'none') as pix_status,
      s.paid_at as pix_paid_at
     FROM providers p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN subscriptions s ON s.provider_id = p.id
     WHERE p.status = ?
     ORDER BY p.created_at DESC LIMIT 100`
  ).bind(status).all();

  return NextResponse.json({ providers: rows.results });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAuthorized(req))) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const body = await req.json() as Record<string, unknown>;
  const { id, status, name, email, phone, whatsapp, city, neighborhood, description, experience_years, category_slug } = body;

  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

  const db = await getDB();

  // Atualização de status apenas
  if (status !== undefined && !name) {
    if (!['approved', 'rejected', 'pending', 'suspended'].includes(status as string)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
    }
    await db.prepare(`UPDATE providers SET status = ?, updated_at = datetime('now') WHERE id = ?`).bind(status, id).run();
    return NextResponse.json({ success: true });
  }

  // Resolve category_id se category_slug foi enviado
  let categoryId: number | null = null;
  if (category_slug) {
    const cat = await db.prepare('SELECT id FROM categories WHERE slug = ?').bind(category_slug).first<{ id: number }>();
    if (!cat) return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 });
    categoryId = cat.id;
  }

  // Edição completa
  await db.prepare(
    `UPDATE providers SET name=?, email=?, phone=?, whatsapp=?, city=?, neighborhood=?,
     description=?, experience_years=?,
     category_id=COALESCE(?, category_id),
     updated_at=datetime('now') WHERE id=?`
  ).bind(
    name, email, phone, whatsapp || null, city, neighborhood || null,
    description, Number(experience_years) || 0, categoryId, id
  ).run();

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthorized(req))) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { id } = await req.json() as { id: number };
  if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

  const db = await getDB();
  await db.prepare('DELETE FROM subscriptions WHERE provider_id = ?').bind(id).run();
  await db.prepare('DELETE FROM reviews WHERE provider_id = ?').bind(id).run();
  await db.prepare('DELETE FROM providers WHERE id = ?').bind(id).run();

  return NextResponse.json({ success: true });
}
