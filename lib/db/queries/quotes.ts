import { db } from '../index'
import { quotes, quoteItems, quoteHistory, clients } from '@/drizzle/schema'
import { eq, and, desc, sql } from 'drizzle-orm'
import { generateToken } from '@/lib/utils'

export async function getQuotesByUserId(userId: string) {
  return db
    .select({
      id: quotes.id,
      quoteNumber: quotes.quoteNumber,
      status: quotes.status,
      total: quotes.total,
      validUntil: quotes.validUntil,
      createdAt: quotes.createdAt,
      clientName: clients.name,
    })
    .from(quotes)
    .leftJoin(clients, eq(quotes.clientId, clients.id))
    .where(eq(quotes.userId, userId))
    .orderBy(desc(quotes.createdAt))
}

export async function getQuoteByIdAndUserId(id: string, userId: string) {
  const result = await db
    .select()
    .from(quotes)
    .where(and(eq(quotes.id, id), eq(quotes.userId, userId)))
    .limit(1)
  if (!result[0]) return null

  const items = await db
    .select()
    .from(quoteItems)
    .where(and(eq(quoteItems.quoteId, id), eq(quoteItems.userId, userId)))
    .orderBy(quoteItems.createdAt)

  const history = await db
    .select()
    .from(quoteHistory)
    .where(and(eq(quoteHistory.quoteId, id), eq(quoteHistory.userId, userId)))
    .orderBy(desc(quoteHistory.createdAt))

  let clientData = null
  if (result[0].clientId) {
    const cl = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, result[0].clientId), eq(clients.userId, userId)))
      .limit(1)
    clientData = cl[0] ?? null
  }

  return { ...result[0], items, history, client: clientData }
}

export async function getQuoteByPublicToken(token: string) {
  const result = await db
    .select()
    .from(quotes)
    .where(eq(quotes.publicToken, token))
    .limit(1)
  if (!result[0]) return null

  const items = await db
    .select()
    .from(quoteItems)
    .where(eq(quoteItems.quoteId, result[0].id))
    .orderBy(quoteItems.createdAt)

  let clientData = null
  if (result[0].clientId) {
    const cl = await db.select().from(clients).where(eq(clients.id, result[0].clientId)).limit(1)
    clientData = cl[0] ?? null
  }

  return { ...result[0], items, client: clientData }
}

export async function getNextQuoteNumber(userId: string): Promise<string> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(quotes)
    .where(eq(quotes.userId, userId))
  const count = Number(result[0]?.count ?? 0) + 1
  return `ORC-${String(count).padStart(5, '0')}`
}

export async function createQuote(
  userId: string,
  data: {
    clientId?: string | null
    subtotal: number
    discount: number
    discountType: string
    additionalCost: number
    total: number
    validUntil?: Date | null
    notes?: string
    items: Array<{
      type: string
      description: string
      quantity: number
      unit: string
      unitPrice: number
      total: number
    }>
  }
) {
  const quoteNumber = await getNextQuoteNumber(userId)
  const publicToken = generateToken()

  const quoteResult = await db
    .insert(quotes)
    .values({
      userId,
      clientId: data.clientId,
      quoteNumber,
      status: 'draft',
      subtotal: String(data.subtotal),
      discount: String(data.discount),
      discountType: data.discountType,
      additionalCost: String(data.additionalCost),
      total: String(data.total),
      validUntil: data.validUntil,
      notes: data.notes,
      publicToken,
    })
    .returning()

  const quote = quoteResult[0]

  if (data.items.length > 0) {
    await db.insert(quoteItems).values(
      data.items.map((item) => ({
        userId,
        quoteId: quote.id,
        type: item.type,
        description: item.description,
        quantity: String(item.quantity),
        unit: item.unit,
        unitPrice: String(item.unitPrice),
        total: String(item.total),
      }))
    )
  }

  await db.insert(quoteHistory).values({
    userId,
    quoteId: quote.id,
    action: 'created',
    description: 'Orçamento criado',
  })

  return quote
}

export async function updateQuoteStatus(id: string, userId: string, status: string, description?: string) {
  const result = await db
    .update(quotes)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(quotes.id, id), eq(quotes.userId, userId)))
    .returning()

  if (result[0]) {
    await db.insert(quoteHistory).values({
      userId,
      quoteId: id,
      action: `status_changed_to_${status}`,
      description: description ?? `Status alterado para ${status}`,
    })
  }

  return result[0] ?? null
}

export async function updateQuoteStatusByToken(token: string, status: string) {
  const existing = await db
    .select({ id: quotes.id, userId: quotes.userId })
    .from(quotes)
    .where(eq(quotes.publicToken, token))
    .limit(1)

  if (!existing[0]) return null

  const result = await db
    .update(quotes)
    .set({ status, updatedAt: new Date() })
    .where(eq(quotes.publicToken, token))
    .returning()

  if (result[0]) {
    await db.insert(quoteHistory).values({
      userId: existing[0].userId,
      quoteId: existing[0].id,
      action: `status_changed_to_${status}`,
      description: `Cliente alterou status para ${status}`,
    })
  }

  return result[0] ?? null
}

export async function getDashboardStats(userId: string) {
  const allQuotes = await db
    .select({ status: quotes.status, total: quotes.total, createdAt: quotes.createdAt })
    .from(quotes)
    .where(eq(quotes.userId, userId))

  const total = allQuotes.length
  const approved = allQuotes.filter((q) => q.status === 'approved').length
  const pending = allQuotes.filter((q) => q.status === 'sent').length
  const totalValue = allQuotes
    .filter((q) => q.status === 'approved')
    .reduce((sum, q) => sum + parseFloat(q.total || '0'), 0)
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0

  // Monthly data for last 6 months
  const now = new Date()
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const month = d.toLocaleString('pt-BR', { month: 'short' })
    const monthQuotes = allQuotes.filter((q) => {
      const qd = new Date(q.createdAt)
      return qd.getMonth() === d.getMonth() && qd.getFullYear() === d.getFullYear()
    })
    return {
      month,
      total: monthQuotes.length,
      approved: monthQuotes.filter((q) => q.status === 'approved').length,
      value: monthQuotes.reduce((sum, q) => sum + parseFloat(q.total || '0'), 0),
    }
  })

  return { total, approved, pending, totalValue, approvalRate, monthly }
}
