import { db } from '../index'
import { users, businesses } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1)
  return result[0] ?? null
}

export async function getUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1)
  return result[0] ?? null
}

export async function createUser(data: {
  name: string
  email: string
  passwordHash: string
}) {
  const result = await db.insert(users).values(data).returning()
  const user = result[0]
  // Create empty business profile
  await db.insert(businesses).values({ userId: user.id, businessName: data.name })
  return user
}

export async function getBusinessByUserId(userId: string) {
  const result = await db.select().from(businesses).where(eq(businesses.userId, userId)).limit(1)
  return result[0] ?? null
}

export async function upsertBusiness(userId: string, data: Partial<typeof businesses.$inferInsert>) {
  const existing = await getBusinessByUserId(userId)
  if (existing) {
    const result = await db
      .update(businesses)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(businesses.userId, userId))
      .returning()
    return result[0]
  } else {
    const result = await db
      .insert(businesses)
      .values({ userId, businessName: '', ...data })
      .returning()
    return result[0]
  }
}
