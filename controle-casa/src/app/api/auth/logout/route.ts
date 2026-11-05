import { NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST() {
  const jar = await cookies()
  const token = jar.get('cc_session')?.value
  if (token) await deleteSession(token)
  jar.delete('cc_session')
  return NextResponse.json({ ok: true })
}
