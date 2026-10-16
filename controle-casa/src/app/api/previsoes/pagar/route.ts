import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { sql, setupDb } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  await setupDb()
  const { id, mes } = await req.json()
  if (!id) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const rows = await sql`SELECT * FROM cc_previsoes WHERE id=${id} AND user_id=${session.id}` as any[]
  const p = rows[0]
  if (!p) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

  const today = new Date().toISOString().slice(0, 10)
  const mesAtual = mes || (() => {
    const d = new Date()
    return `${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
  })()

  // cria gasto
  await sql`
    INSERT INTO cc_gastos (descricao, cat, val, data, mes, user_id)
    VALUES (${p.descricao}, ${p.cat}, ${p.val}, ${today}, ${mesAtual}, ${session.id})
  `

  if (p.recorrente) {
    // avança data_prevista um mês
    const oldDate = p.data_prevista ? new Date(p.data_prevista) : new Date()
    oldDate.setMonth(oldDate.getMonth() + 1)
    const novaData = oldDate.toISOString().slice(0, 10)
    await sql`UPDATE cc_previsoes SET data_prevista=${novaData} WHERE id=${id}`
  } else {
    await sql`DELETE FROM cc_previsoes WHERE id=${id}`
  }

  return NextResponse.json({ ok: true })
}
