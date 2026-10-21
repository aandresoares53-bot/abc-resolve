import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { sql, setupDb } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  await setupDb()
  const rows = await sql`SELECT orcamento FROM cc_config WHERE user_id = ${session.id}` as any[]
  return NextResponse.json({ orcamento: rows[0]?.orcamento || 0 })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  await setupDb()
  const body = await req.json()
  const orcamento = Number(body.orcamento)
  if (isNaN(orcamento)) return NextResponse.json({ error: 'Valor inválido' }, { status: 400 })
  // ensure unique constraint exists
  await sql`ALTER TABLE cc_config ADD COLUMN IF NOT EXISTS orcamento NUMERIC(10,2) DEFAULT 0`
  const updated = await sql`UPDATE cc_config SET orcamento = ${orcamento}, updated_at = NOW() WHERE user_id = ${session.id} RETURNING user_id` as any[]
  if (!updated.length) {
    await sql`INSERT INTO cc_config (user_id, orcamento) VALUES (${session.id}, ${orcamento})`
  }
  const rows = await sql`SELECT orcamento FROM cc_config WHERE user_id = ${session.id}` as any[]
  return NextResponse.json({ ok: true, orcamento: rows[0]?.orcamento || 0 })
}
