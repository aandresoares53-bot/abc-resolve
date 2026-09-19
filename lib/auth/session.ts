import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  userId: string
  name: string
  email: string
}

const sessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: 'orcamento_facil_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}
