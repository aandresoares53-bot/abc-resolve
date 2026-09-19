'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/helpers'
import {
  getQuotesByUserId,
  getQuoteByIdAndUserId,
  createQuote,
  updateQuoteStatus,
} from '@/lib/db/queries/quotes'
import { quoteSchema } from '@/lib/validators/quote'
import { calculateQuoteTotals } from '@/lib/utils'

export async function getQuotesAction() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return getQuotesByUserId(user.id)
}

export async function getQuoteAction(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return getQuoteByIdAndUserId(id, user.id)
}

export async function createQuoteAction(data: unknown) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')

  const parsed = quoteSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { items, discount, discountType, additionalCost, clientId, validUntil, notes } = parsed.data

  const itemsWithTotals = items.map((item) => ({
    ...item,
    total: item.quantity * item.unitPrice,
  }))

  const { subtotal, discountAmount, total } = calculateQuoteTotals(
    items,
    discount,
    discountType,
    additionalCost
  )

  const quote = await createQuote(user.id, {
    clientId,
    subtotal,
    discount: discountAmount,
    discountType,
    additionalCost,
    total,
    validUntil: validUntil ? new Date(validUntil) : null,
    notes,
    items: itemsWithTotals,
  })

  revalidatePath('/orcamentos')
  redirect(`/orcamentos/${quote.id}`)
}

export async function updateQuoteStatusAction(id: string, status: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')

  await updateQuoteStatus(id, user.id, status)
  revalidatePath('/orcamentos')
  revalidatePath(`/orcamentos/${id}`)
}
