'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { getUserByEmail, createUser } from '@/lib/db/queries/users'
import { loginSchema, registerSchema } from '@/lib/validators/auth'

export async function loginAction(formData: FormData) {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { email, password } = parsed.data
  const user = await getUserByEmail(email)
  if (!user) {
    return { error: 'E-mail ou senha incorretos' }
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return { error: 'E-mail ou senha incorretos' }
  }

  const session = await getSession()
  session.userId = user.id
  session.name = user.name
  session.email = user.email
  await session.save()

  redirect('/dashboard')
}

export async function registerAction(formData: FormData) {
  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const parsed = registerSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { name, email, password } = parsed.data

  const existing = await getUserByEmail(email)
  if (existing) {
    return { error: 'Este e-mail já está em uso' }
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await createUser({ name, email, passwordHash })

  const session = await getSession()
  session.userId = user.id
  session.name = user.name
  session.email = user.email
  await session.save()

  redirect('/dashboard')
}

export async function logoutAction() {
  const session = await getSession()
  session.destroy()
  redirect('/login')
}
