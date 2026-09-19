'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth/helpers'
import {
  getClientsByUserId,
  getClientByIdAndUserId,
  createClient,
  updateClient,
  deleteClient,
} from '@/lib/db/queries/clients'
import { clientSchema } from '@/lib/validators/client'
import { redirect } from 'next/navigation'

export async function getClientsAction(search?: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return getClientsByUserId(user.id, search)
}

export async function getClientAction(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return getClientByIdAndUserId(id, user.id)
}

export async function createClientAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')

  const raw = Object.fromEntries(formData.entries())
  const parsed = clientSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const client = await createClient(user.id, parsed.data)
  revalidatePath('/clientes')
  redirect(`/clientes/${client.id}`)
}

export async function updateClientAction(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')

  const raw = Object.fromEntries(formData.entries())
  const parsed = clientSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  await updateClient(id, user.id, parsed.data)
  revalidatePath('/clientes')
  revalidatePath(`/clientes/${id}`)
  redirect(`/clientes/${id}`)
}

export async function deleteClientAction(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  await deleteClient(id, user.id)
  revalidatePath('/clientes')
  redirect('/clientes')
}
