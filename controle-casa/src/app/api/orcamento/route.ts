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

    // Ensure schema is ready
    try { await sql`ALTER TABLE cc_config ALTER COLUMN chave DROP NOT NULL` } catch {}
    try { await sql`ALTER TABLE cc_config ALTER COLUMN chave SET DEFAULT ''` } catch {}
    try { await sql`ALTER TABLE cc_config ADD CONSTRAINT cc_config_user_id_unique UNIQUE (user_id)` } catch {}

    // Try upsert with chave='' fallback for legacy NOT NULL column
    let saved = false
    try {
      await sql`
        INSERT INTO cc_config (user_id, orcamento, chave) VALUES (${session.id}, ${orcamento}, '')
        ON CONFLICT (user_id) DO UPDATE SET orcamento = EXCLUDED.orcamento, updated_at = NOW()
      `
      saved = true
    } catch {}

    if (!saved) {
      try {
        await sql`UPDATE cc_config SET orcamento = ${orcamento}, updated_at = NOW() WHERE user_id = ${session.id}`
        saved = true
      } catch {}
    }

    if (!saved) {
      try {
        await sql`INSERT INTO cc_config (user_id, orcamento, chave) VALUES (${session.id}, ${orcamento}, '')`
        saved = true
      } catch {}
    }

    if (!saved) {
      return NextResponse.json({ error: 'Não foi possível salvar o orçamento no banco de dados' }, { status: 500 })
    }

    const rows = await sql`SELECT orcamento FROM cc_config WHERE user_id = ${session.id}` as any[]
    return NextResponse.json({ ok: true, orcamento: Number(rows[0]?.orcamento) || orcamento })
  } catch (e) {
    console.error('POST /api/orcamento error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
