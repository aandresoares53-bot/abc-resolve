import { z } from 'zod'

export const quoteItemSchema = z.object({
  type: z.enum(['service', 'product', 'labor', 'other']),
  description: z.string().min(1, 'Descrição obrigatória'),
  quantity: z.coerce.number().positive('Quantidade deve ser positiva'),
  unit: z.string().min(1, 'Unidade obrigatória'),
  unitPrice: z.coerce.number().min(0, 'Preço deve ser positivo'),
})

export const quoteSchema = z.object({
  clientId: z.string().uuid().optional().nullable(),
  items: z.array(quoteItemSchema).min(1, 'Adicione pelo menos um item'),
  discount: z.coerce.number().min(0).default(0),
  discountType: z.enum(['fixed', 'percent']).default('fixed'),
  additionalCost: z.coerce.number().min(0).default(0),
  validUntil: z.string().optional(),
  notes: z.string().optional(),
})

export type QuoteItemInput = z.infer<typeof quoteItemSchema>
export type QuoteInput = z.infer<typeof quoteSchema>
