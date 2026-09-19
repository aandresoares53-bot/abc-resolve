import { db } from '../index'
import { services } from '@/drizzle/schema'
import { eq, and, desc } from 'drizzle-orm'

export async function getServicesByUserId(userId: string) {
  return db.select().from(services).where(eq(services.userId, userId)).orderBy(desc(services.createdAt))
}

export async function getServiceByIdAndUserId(id: string, userId: string) {
  const result = await db
    .select()
    .from(services)
    .where(and(eq(services.id, id), eq(services.userId, userId)))
    .limit(1)
  return result[0] ?? null
}

export async function createService(userId: string, data: Omit<typeof services.$inferInsert, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  const result = await db.insert(services).values({ ...data, userId }).returning()
  return result[0]
}

export async function updateService(id: string, userId: string, data: Partial<typeof services.$inferInsert>) {
  const result = await db
    .update(services)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(services.id, id), eq(services.userId, userId)))
    .returning()
  return result[0] ?? null
}

export async function deleteService(id: string, userId: string) {
  await db.delete(services).where(and(eq(services.id, id), eq(services.userId, userId)))
}
