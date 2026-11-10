import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql, setupAuth } from '@/lib/db'
import { createSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  await setupAuth()
  const { name, email, password } = await req.json()
  if (!name || !email || !password) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  if (password.length < 6) return NextResponse.json({ error: 'Senha deve ter pelo menos 6 caracteres' }, { status: 400 })

  const existing = await sql`SELECT id FROM cc_users WHERE email = ${email.toLowerCase().trim()}` as any[]
  if (existing[0]) return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 409 })

  const hash = await bcrypt.hash(password, 10)
  const rows = await sql`
    INSERT INTO cc_users (name, email, password_hash)
    VALUES (${name.trim()}, ${email.toLowerCase().trim()}, ${hash})
    RETURNING id
  ` as any[]

  const token = await createSession(rows[0].id)
  const jar = await cookies()
  jar.set('cc_session', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60, path: '/' })
  return NextResponse.json({ ok: true })
}
