import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql, setupAuth } from '@/lib/db'
import { createSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  await setupAuth()
  const { email, password } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

  const rows = await sql`SELECT * FROM cc_users WHERE email = ${email.toLowerCase().trim()}` as any[]
  const user = rows[0]
  if (!user) return NextResponse.json({ error: 'E-mail ou senha incorretos' }, { status: 401 })

  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) return NextResponse.json({ error: 'E-mail ou senha incorretos' }, { status: 401 })

  const token = await createSession(user.id)
  const jar = await cookies()
  jar.set('cc_session', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60, path: '/' })
  return NextResponse.json({ ok: true })
}
