import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { sql, setupDb } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  await setupDb()

  // últimos 6 meses
  const meses: string[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    meses.push(`${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`)
  }

  const rows = await sql`
    SELECT mes, SUM(val)::numeric as total
    FROM cc_gastos
    WHERE user_id=${session.id} AND mes = ANY(${meses})
    GROUP BY mes
  ` as Array<{ mes: string; total: number }>

  const byMes: Record<string, number> = {}
  rows.forEach(r => { byMes[r.mes] = Number(r.total) })

  return NextResponse.json(meses.map(m => ({ mes: m, total: byMes[m] || 0 })))
}
