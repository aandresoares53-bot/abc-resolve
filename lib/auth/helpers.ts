import { getSession } from './session'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const session = await getSession()
  if (!session.userId) return null
  return {
    id: session.userId,
    name: session.name,
    email: session.email,
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}
