import { NextRequest, NextResponse } from 'next/server';
import { getDB, getEnv } from '@/lib/db';
import { verifyAdminToken, TOKEN_NAME } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const env = await getEnv();
  const token = req.cookies.get(TOKEN_NAME)?.value;
  if (!token || !(await verifyAdminToken(token, env.ADMIN_SECRET))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const db = await getDB();
  const [providers, requests, approved, open, pixPending, pixActive, suspended] = await Promise.all([
    db.prepare('SELECT COUNT(*) as count FROM providers').first<{ count: number }>(),
    db.prepare('SELECT COUNT(*) as count FROM service_requests').first<{ count: number }>(),
    db.prepare("SELECT COUNT(*) as count FROM providers WHERE status = 'approved'").first<{ count: number }>(),
    db.prepare("SELECT COUNT(*) as count FROM service_requests WHERE status = 'open'").first<{ count: number }>(),
    db.prepare("SELECT COUNT(*) as count FROM subscriptions WHERE status = 'pending'").first<{ count: number }>(),
    db.prepare("SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'").first<{ count: number }>(),
    db.prepare("SELECT COUNT(*) as count FROM providers WHERE status = 'suspended'").first<{ count: number }>(),
  ]);

  return NextResponse.json({
    total_providers: providers?.count ?? 0,
    total_requests: requests?.count ?? 0,
    approved_providers: approved?.count ?? 0,
    open_requests: open?.count ?? 0,
    pix_pending: pixPending?.count ?? 0,
    pix_active: pixActive?.count ?? 0,
    suspended_providers: suspended?.count ?? 0,
  });
}
