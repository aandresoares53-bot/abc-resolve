import { z } from 'zod'

export const clientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  document: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
})

export type ClientInput = z.infer<typeof clientSchema>
