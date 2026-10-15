import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { sql, setupDb } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  await setupDb()
  const rows = await sql`SELECT * FROM cc_previsoes WHERE user_id = ${session.id} ORDER BY data_prevista ASC NULLS LAST`
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  await setupDb()
  const { descricao, cat, val, data_prevista, recorrente } = await req.json()
  const rows = await sql`
    INSERT INTO cc_previsoes (descricao, cat, val, data_prevista, recorrente, user_id)
    VALUES (${descricao}, ${cat}, ${val}, ${data_prevista || null}, ${recorrente || false}, ${session.id})
    RETURNING *
  `
  return NextResponse.json(rows[0])
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  await sql`DELETE FROM cc_previsoes WHERE id = ${id} AND user_id = ${session.id}`
  return NextResponse.json({ ok: true })
}
