import { NextRequest, NextResponse } from 'next/server';
import { getDB, getEnv } from '@/lib/db';
import { verifyAdminToken, TOKEN_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const env = await getEnv();
  const token = req.cookies.get(TOKEN_NAME)?.value;
  if (!token || !(await verifyAdminToken(token, env.ADMIN_SECRET))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const db = await getDB();

  // Suspende subscriptions expiradas e seus prestadores
  const expired = await db.prepare(
    `SELECT s.id as sub_id, s.provider_id
     FROM subscriptions s
     WHERE s.status = 'active'
       AND s.expires_at IS NOT NULL
       AND datetime(s.expires_at) < datetime('now')`
  ).all<{ sub_id: number; provider_id: number }>();

  if (expired.results.length > 0) {
    for (const row of expired.results) {
      await db.prepare(`UPDATE subscriptions SET status = 'expired', updated_at = datetime('now') WHERE id = ?`).bind(row.sub_id).run();
      await db.prepare(`UPDATE providers SET status = 'suspended', updated_at = datetime('now') WHERE id = ?`).bind(row.provider_id).run();
    }
  }

  return NextResponse.json({ suspended: expired.results.length });
}
