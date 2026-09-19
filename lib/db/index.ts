import { neon } from '@neondatabase/serverless'
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from '@/drizzle/schema'

type SchemaDB = NeonHttpDatabase<typeof schema>

let _db: SchemaDB | null = null

export function getDb(): SchemaDB {
  if (!_db) {
    const sql = neon(process.env.DATABASE_URL!)
    _db = drizzle(sql, { schema })
  }
  return _db
}

// Export db as a getter-based proxy so it lazily connects
export const db: SchemaDB = new Proxy({} as SchemaDB, {
  get(_target, prop: string | symbol) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export type DB = SchemaDB
