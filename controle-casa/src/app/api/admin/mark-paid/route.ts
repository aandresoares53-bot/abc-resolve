import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { secret, userId, paid } = await req.json()
  if (secret !== process.env.ADMIN_SECRET) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await sql`UPDATE cc_users SET paid = ${paid} WHERE id = ${userId}`
  return NextResponse.json({ ok: true })
}
