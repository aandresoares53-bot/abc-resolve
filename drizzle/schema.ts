import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  numeric,
  integer,
  index,
} from 'drizzle-orm/pg-core'

const now = () => timestamp('created_at').defaultNow().notNull()
const updatedAt = () => timestamp('updated_at').defaultNow().notNull()

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  plan: varchar('plan', { length: 50 }).notNull().default('free'),
  createdAt: now(),
  updatedAt: updatedAt(),
})

export const businesses = pgTable('businesses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  businessName: varchar('business_name', { length: 255 }).notNull().default(''),
  document: varchar('document', { length: 50 }),
  phone: varchar('phone', { length: 30 }),
  whatsapp: varchar('whatsapp', { length: 30 }),
  email: varchar('email', { length: 255 }),
  logoUrl: text('logo_url'),
  address: varchar('address', { length: 500 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 2 }),
  zipCode: varchar('zip_code', { length: 20 }),
  defaultNotes: text('default_notes'),
  defaultValidityDays: integer('default_validity_days').default(30),
  createdAt: now(),
  updatedAt: updatedAt(),
}, (table) => ({
  userIdx: index('businesses_user_id_idx').on(table.userId),
}))

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  document: varchar('document', { length: 50 }),
  phone: varchar('phone', { length: 30 }),
  whatsapp: varchar('whatsapp', { length: 30 }),
  email: varchar('email', { length: 255 }),
  address: varchar('address', { length: 500 }),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 2 }),
  zipCode: varchar('zip_code', { length: 20 }),
  notes: text('notes'),
  createdAt: now(),
  updatedAt: updatedAt(),
}, (table) => ({
  userIdx: index('clients_user_id_idx').on(table.userId),
}))

export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  defaultPrice: numeric('default_price', { precision: 10, scale: 2 }).notNull().default('0'),
  unit: varchar('unit', { length: 50 }).notNull().default('un'),
  active: boolean('active').notNull().default(true),
  createdAt: now(),
  updatedAt: updatedAt(),
}, (table) => ({
  userIdx: index('services_user_id_idx').on(table.userId),
}))

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  costPrice: numeric('cost_price', { precision: 10, scale: 2 }).notNull().default('0'),
  salePrice: numeric('sale_price', { precision: 10, scale: 2 }).notNull().default('0'),
  unit: varchar('unit', { length: 50 }).notNull().default('un'),
  active: boolean('active').notNull().default(true),
  createdAt: now(),
  updatedAt: updatedAt(),
}, (table) => ({
  userIdx: index('products_user_id_idx').on(table.userId),
}))

export const quotes = pgTable('quotes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id').references(() => clients.id, { onDelete: 'set null' }),
  quoteNumber: varchar('quote_number', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull().default('0'),
  discount: numeric('discount', { precision: 10, scale: 2 }).notNull().default('0'),
  discountType: varchar('discount_type', { length: 10 }).notNull().default('fixed'),
  additionalCost: numeric('additional_cost', { precision: 10, scale: 2 }).notNull().default('0'),
  total: numeric('total', { precision: 10, scale: 2 }).notNull().default('0'),
  validUntil: timestamp('valid_until'),
  notes: text('notes'),
  publicToken: varchar('public_token', { length: 100 }).unique(),
  createdAt: now(),
  updatedAt: updatedAt(),
}, (table) => ({
  userIdx: index('quotes_user_id_idx').on(table.userId),
  tokenIdx: index('quotes_public_token_idx').on(table.publicToken),
}))

export const quoteItems = pgTable('quote_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  quoteId: uuid('quote_id').notNull().references(() => quotes.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull().default('service'),
  description: text('description').notNull(),
  quantity: numeric('quantity', { precision: 10, scale: 3 }).notNull().default('1'),
  unit: varchar('unit', { length: 50 }).notNull().default('un'),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull().default('0'),
  total: numeric('total', { precision: 10, scale: 2 }).notNull().default('0'),
  createdAt: now(),
}, (table) => ({
  quoteIdx: index('quote_items_quote_id_idx').on(table.quoteId),
  userIdx: index('quote_items_user_id_idx').on(table.userId),
}))

export const quoteHistory = pgTable('quote_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  quoteId: uuid('quote_id').notNull().references(() => quotes.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 100 }).notNull(),
  description: text('description'),
  createdAt: now(),
}, (table) => ({
  quoteIdx: index('quote_history_quote_id_idx').on(table.quoteId),
}))

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 100 }).notNull(),
  entity: varchar('entity', { length: 100 }),
  entityId: uuid('entity_id'),
  metadata: text('metadata'),
  createdAt: now(),
}, (table) => ({
  userIdx: index('audit_logs_user_id_idx').on(table.userId),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Business = typeof businesses.$inferSelect
export type NewBusiness = typeof businesses.$inferInsert
export type Client = typeof clients.$inferSelect
export type NewClient = typeof clients.$inferInsert
export type Service = typeof services.$inferSelect
export type NewService = typeof services.$inferInsert
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
export type Quote = typeof quotes.$inferSelect
export type NewQuote = typeof quotes.$inferInsert
export type QuoteItem = typeof quoteItems.$inferSelect
export type NewQuoteItem = typeof quoteItems.$inferInsert
