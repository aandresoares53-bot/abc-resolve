import { NextRequest, NextResponse } from 'next/server'
import { sql, setupAuth, setupDb } from '@/lib/db'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.ADMIN_SECRET) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await setupAuth(); await setupDb()
  const users = await sql`
    SELECT u.id, u.name, u.email, u.trial_expires_at, u.paid, u.created_at,
      COALESCE((SELECT SUM(val) FROM cc_gastos WHERE user_id = u.id), 0) as total_gastos
    FROM cc_users u ORDER BY u.created_at DESC
  `
  return NextResponse.json(users)
}
