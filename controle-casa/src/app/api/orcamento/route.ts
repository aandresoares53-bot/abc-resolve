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
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    await setupDb()
    const body = await req.json()
    const orcamento = Number(body.orcamento)
    if (isNaN(orcamento)) return NextResponse.json({ error: 'Valor inválido' }, { status: 400 })

    // Fix legacy table: remove NOT NULL constraints that block insert
    try { await sql`ALTER TABLE cc_config ALTER COLUMN chave DROP NOT NULL` } catch {}
    try { await sql`ALTER TABLE cc_config ADD CONSTRAINT cc_config_user_id_unique UNIQUE (user_id)` } catch {}

    // Try upsert, fall back to update then insert
    try {
      await sql`
        INSERT INTO cc_config (user_id, orcamento) VALUES (${session.id}, ${orcamento})
        ON CONFLICT (user_id) DO UPDATE SET orcamento = EXCLUDED.orcamento, updated_at = NOW()
      `
    } catch {
      try {
        await sql`UPDATE cc_config SET orcamento = ${orcamento} WHERE user_id = ${session.id}`
      } catch {
        await sql`INSERT INTO cc_config (user_id, orcamento) VALUES (${session.id}, ${orcamento})`
      }
    }

    const rows = await sql`SELECT orcamento FROM cc_config WHERE user_id = ${session.id}` as any[]
    return NextResponse.json({ ok: true, orcamento: rows[0]?.orcamento || 0 })
  } catch (e) {
    console.error('POST /api/orcamento error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
