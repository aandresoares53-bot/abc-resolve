import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { sql, setupDb } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  await setupDb()
  const mes = req.nextUrl.searchParams.get('mes')
  const rows = mes
    ? await sql`SELECT * FROM cc_gastos WHERE user_id = ${session.id} AND mes = ${mes} ORDER BY created_at DESC`
    : await sql`SELECT * FROM cc_gastos WHERE user_id = ${session.id} ORDER BY created_at DESC`
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  await setupDb()
  const { descricao, cat, val, data, mes } = await req.json()
  if (!descricao || !cat || !val) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  const rows = await sql`
    INSERT INTO cc_gastos (descricao, cat, val, data, mes, user_id)
    VALUES (${descricao}, ${cat}, ${val}, ${data || null}, ${mes || null}, ${session.id})
    RETURNING *
  `
  return NextResponse.json(rows[0])
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  await setupDb()
  const { id, descricao, cat, val, data } = await req.json()
  if (!id || !descricao || !cat || !val) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  const rows = await sql`
    UPDATE cc_gastos SET descricao=${descricao}, cat=${cat}, val=${val}, data=${data||null}
    WHERE id=${id} AND user_id=${session.id} RETURNING *
  `
  return NextResponse.json(rows[0])
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  await sql`DELETE FROM cc_gastos WHERE id = ${id} AND user_id = ${session.id}`
  return NextResponse.json({ ok: true })
}
