import { db } from '../index'
import { products } from '@/drizzle/schema'
import { eq, and, desc } from 'drizzle-orm'

export async function getProductsByUserId(userId: string) {
  return db.select().from(products).where(eq(products.userId, userId)).orderBy(desc(products.createdAt))
}

export async function getProductByIdAndUserId(id: string, userId: string) {
  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.userId, userId)))
    .limit(1)
  return result[0] ?? null
}

export async function createProduct(userId: string, data: Omit<typeof products.$inferInsert, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  const result = await db.insert(products).values({ ...data, userId }).returning()
  return result[0]
}

export async function updateProduct(id: string, userId: string, data: Partial<typeof products.$inferInsert>) {
  const result = await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(products.id, id), eq(products.userId, userId)))
    .returning()
  return result[0] ?? null
}

export async function deleteProduct(id: string, userId: string) {
  await db.delete(products).where(and(eq(products.id, id), eq(products.userId, userId)))
}
