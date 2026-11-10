import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { sql, setupDb } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    try {
      const rows = await sql`SELECT orcamento FROM cc_config WHERE user_id = ${session.id}` as any[]
      return NextResponse.json({ orcamento: Number(rows[0]?.orcamento) || 0 })
    } catch {
      // Table might not exist yet or missing columns — return 0 gracefully
      return NextResponse.json({ orcamento: 0 })
    }
  } catch (e) {
    console.error('GET /api/orcamento error:', e)
    return NextResponse.json({ orcamento: 0 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    await setupDb()
    const body = await req.json()
    const orcamento = Number(body.orcamento)
    if (isNaN(orcamento)) return NextResponse.json({ error: 'Valor inválido' }, { status: 400 })

    // Fix legacy schema — table was originally key-value with chave+valor NOT NULL
    try { await sql`ALTER TABLE cc_config ALTER COLUMN chave DROP NOT NULL` } catch {}
    try { await sql`ALTER TABLE cc_config ALTER COLUMN chave SET DEFAULT ''` } catch {}
    try { await sql`ALTER TABLE cc_config ALTER COLUMN valor DROP NOT NULL` } catch {}
    try { await sql`ALTER TABLE cc_config ALTER COLUMN valor SET DEFAULT ''` } catch {}

    // Check if row exists for this user
    const existing = await sql`SELECT 1 FROM cc_config WHERE user_id = ${session.id} LIMIT 1` as any[]

    if (existing.length > 0) {
      // Row exists — just update
      await sql`UPDATE cc_config SET orcamento = ${orcamento}, updated_at = NOW() WHERE user_id = ${session.id}`
    } else {
      // No row — try insert with legacy columns, fallback to minimal
      try {
        await sql`INSERT INTO cc_config (user_id, orcamento, chave, valor) VALUES (${session.id}, ${orcamento}, 'orcamento', ${String(orcamento)})`
      } catch {
        try {
          await sql`INSERT INTO cc_config (user_id, orcamento, chave) VALUES (${session.id}, ${orcamento}, '')`
        } catch {
          await sql`INSERT INTO cc_config (user_id, orcamento) VALUES (${session.id}, ${orcamento})`
        }
      }
    }

    const rows = await sql`SELECT orcamento FROM cc_config WHERE user_id = ${session.id}` as any[]
    return NextResponse.json({ ok: true, orcamento: Number(rows[0]?.orcamento) || orcamento })
  } catch (e) {
    console.error('POST /api/orcamento error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
