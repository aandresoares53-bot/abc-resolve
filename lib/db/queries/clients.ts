import { db } from '../index'
import { clients } from '@/drizzle/schema'
import { eq, and, ilike, desc } from 'drizzle-orm'

export async function getClientsByUserId(userId: string, search?: string) {
  if (search) {
    return db
      .select()
      .from(clients)
      .where(and(eq(clients.userId, userId), ilike(clients.name, `%${search}%`)))
      .orderBy(desc(clients.createdAt))
  }
  return db.select().from(clients).where(eq(clients.userId, userId)).orderBy(desc(clients.createdAt))
}

export async function getClientByIdAndUserId(id: string, userId: string) {
  const result = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, id), eq(clients.userId, userId)))
    .limit(1)
  return result[0] ?? null
}

export async function createClient(userId: string, data: Omit<typeof clients.$inferInsert, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  const result = await db.insert(clients).values({ ...data, userId }).returning()
  return result[0]
}

export async function updateClient(id: string, userId: string, data: Partial<typeof clients.$inferInsert>) {
  const result = await db
    .update(clients)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(clients.id, id), eq(clients.userId, userId)))
    .returning()
  return result[0] ?? null
}

export async function deleteClient(id: string, userId: string) {
  await db.delete(clients).where(and(eq(clients.id, id), eq(clients.userId, userId)))
}
