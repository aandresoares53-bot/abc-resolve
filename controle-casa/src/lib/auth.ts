import { sql, setupAuth } from './db'
import { cookies } from 'next/headers'

export async function getSession() {
  await setupAuth()
  const token = (await cookies()).get('cc_session')?.value
  if (!token) return null
  const rows = await sql`
    SELECT u.id, u.name, u.email, u.trial_expires_at, u.paid
    FROM cc_sessions s
    JOIN cc_users u ON u.id = s.user_id
    WHERE s.token = ${token} AND s.expires_at > NOW()
  ` as Array<{ id: number; name: string; email: string; trial_expires_at: string; paid: boolean }>
  if (!rows[0]) return null
  const user = rows[0]
  const trialExpired = !user.paid && new Date(user.trial_expires_at) < new Date()
  return { ...user, trialExpired }
}

export async function createSession(userId: number): Promise<string> {
  const token = crypto.randomUUID() + '-' + crypto.randomUUID()
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  await sql`
    INSERT INTO cc_sessions (token, user_id, expires_at)
    VALUES (${token}, ${userId}, ${expires.toISOString()})
  `
  return token
}

export async function deleteSession(token: string) {
  await sql`DELETE FROM cc_sessions WHERE token = ${token}`
}
