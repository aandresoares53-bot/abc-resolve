'use server'

import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth/helpers'
import { upsertBusiness, getBusinessByUserId } from '@/lib/db/queries/users'

export async function getBusinessAction() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return getBusinessByUserId(user.id)
}

export async function updateBusinessAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')

  const data = {
    businessName: (formData.get('businessName') as string) || '',
    document: (formData.get('document') as string) || null,
    phone: (formData.get('phone') as string) || null,
    whatsapp: (formData.get('whatsapp') as string) || null,
    email: (formData.get('email') as string) || null,
    logoUrl: (formData.get('logoUrl') as string) || null,
    address: (formData.get('address') as string) || null,
    city: (formData.get('city') as string) || null,
    state: (formData.get('state') as string) || null,
    zipCode: (formData.get('zipCode') as string) || null,
    defaultNotes: (formData.get('defaultNotes') as string) || null,
    defaultValidityDays: parseInt((formData.get('defaultValidityDays') as string) || '30', 10),
  }

  await upsertBusiness(user.id, data)
  revalidatePath('/configuracoes')
}
