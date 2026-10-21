import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    // Check table structure
    const cols = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'cc_config'
      ORDER BY ordinal_position
    ` as any[]

    // Check all rows
    let rows: any[] = []
    try {
      rows = await sql`SELECT * FROM cc_config` as any[]
    } catch (e) { rows = [{ error: String(e) }] }

    return NextResponse.json({
      session_id: session.id,
      columns: cols,
      all_rows: rows,
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
