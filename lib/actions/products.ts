'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth/helpers'
import {
  getProductsByUserId,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/db/queries/products'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  description: z.string().optional(),
  costPrice: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0),
  unit: z.string().min(1, 'Unidade obrigatória'),
  active: z.coerce.boolean().default(true),
})

export async function getProductsAction() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return getProductsByUserId(user.id)
}

export async function createProductAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')

  const raw = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    costPrice: formData.get('costPrice') as string,
    salePrice: formData.get('salePrice') as string,
    unit: formData.get('unit') as string,
    active: formData.get('active') !== 'false',
  }

  const parsed = productSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  await createProduct(user.id, {
    name: parsed.data.name,
    description: parsed.data.description,
    costPrice: String(parsed.data.costPrice),
    salePrice: String(parsed.data.salePrice),
    unit: parsed.data.unit,
    active: parsed.data.active,
  })
  revalidatePath('/produtos')
  return { success: true }
}

export async function updateProductAction(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')

  const raw = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    costPrice: formData.get('costPrice') as string,
    salePrice: formData.get('salePrice') as string,
    unit: formData.get('unit') as string,
    active: formData.get('active') !== 'false',
  }

  const parsed = productSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  await updateProduct(id, user.id, {
    name: parsed.data.name,
    description: parsed.data.description,
    costPrice: String(parsed.data.costPrice),
    salePrice: String(parsed.data.salePrice),
    unit: parsed.data.unit,
    active: parsed.data.active,
  })
  revalidatePath('/produtos')
  return { success: true }
}

export async function deleteProductAction(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  await deleteProduct(id, user.id)
  revalidatePath('/produtos')
  return { success: true }
}
