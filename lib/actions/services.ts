'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth/helpers'
import {
  getServicesByUserId,
  createService,
  updateService,
  deleteService,
} from '@/lib/db/queries/services'
import { z } from 'zod'

const serviceSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  description: z.string().optional(),
  defaultPrice: z.coerce.number().min(0),
  unit: z.string().min(1, 'Unidade obrigatória'),
  active: z.coerce.boolean().default(true),
})

export async function getServicesAction() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return getServicesByUserId(user.id)
}

export async function createServiceAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')

  const raw = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    defaultPrice: formData.get('defaultPrice') as string,
    unit: formData.get('unit') as string,
    active: formData.get('active') !== 'false',
  }

  const parsed = serviceSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  await createService(user.id, {
    name: parsed.data.name,
    description: parsed.data.description,
    defaultPrice: String(parsed.data.defaultPrice),
    unit: parsed.data.unit,
    active: parsed.data.active,
  })
  revalidatePath('/servicos')
  return { success: true }
}

export async function updateServiceAction(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')

  const raw = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    defaultPrice: formData.get('defaultPrice') as string,
    unit: formData.get('unit') as string,
    active: formData.get('active') !== 'false',
  }

  const parsed = serviceSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  await updateService(id, user.id, {
    name: parsed.data.name,
    description: parsed.data.description,
    defaultPrice: String(parsed.data.defaultPrice),
    unit: parsed.data.unit,
    active: parsed.data.active,
  })
  revalidatePath('/servicos')
  return { success: true }
}

export async function deleteServiceAction(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  await deleteService(id, user.id)
  revalidatePath('/servicos')
  return { success: true }
}
