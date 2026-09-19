import { db } from '../lib/db'
import { users, businesses, clients, services, products, quotes, quoteItems } from '../drizzle/schema'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('Seeding database...')

  // Create user A
  const passwordHash = await bcrypt.hash('password123', 12)

  const [userA] = await db.insert(users).values({
    name: 'João Eletricista',
    email: 'joao@test.com',
    passwordHash,
    plan: 'pro',
  }).returning()

  const [userB] = await db.insert(users).values({
    name: 'Maria Pintora',
    email: 'maria@test.com',
    passwordHash,
    plan: 'free',
  }).returning()

  // Business profiles
  await db.insert(businesses).values({
    userId: userA.id,
    businessName: 'Elétrica do João',
    document: '12.345.678/0001-99',
    phone: '(11) 99999-0001',
    whatsapp: '11999990001',
    email: 'joao@eletrica.com',
    city: 'São Paulo',
    state: 'SP',
    defaultValidityDays: 30,
    defaultNotes: 'Pagamento em até 30 dias. Garantia de 90 dias nos serviços.',
  })

  await db.insert(businesses).values({
    userId: userB.id,
    businessName: 'Pinturas da Maria',
    document: '987.654.321-00',
    phone: '(11) 98888-0002',
    whatsapp: '11988880002',
    email: 'maria@pinturas.com',
    city: 'São Paulo',
    state: 'SP',
    defaultValidityDays: 15,
  })

  // Clients for User A
  const [clientA1] = await db.insert(clients).values({
    userId: userA.id,
    name: 'Carlos Silva',
    phone: '(11) 97777-0001',
    whatsapp: '11977770001',
    email: 'carlos@email.com',
    city: 'São Paulo',
    state: 'SP',
  }).returning()

  const [clientA2] = await db.insert(clients).values({
    userId: userA.id,
    name: 'Ana Oliveira',
    phone: '(11) 96666-0002',
    city: 'São Paulo',
    state: 'SP',
  }).returning()

  // Clients for User B (ISOLATED)
  const [clientB1] = await db.insert(clients).values({
    userId: userB.id,
    name: 'Pedro Costa',
    phone: '(11) 95555-0003',
    city: 'Campinas',
    state: 'SP',
  }).returning()

  // Services for User A
  const [svcA1] = await db.insert(services).values({
    userId: userA.id,
    name: 'Instalação de tomada',
    defaultPrice: '150.00',
    unit: 'un',
    active: true,
  }).returning()

  const [svcA2] = await db.insert(services).values({
    userId: userA.id,
    name: 'Troca de disjuntor',
    defaultPrice: '200.00',
    unit: 'un',
    active: true,
  }).returning()

  // Services for User B (ISOLATED)
  await db.insert(services).values({
    userId: userB.id,
    name: 'Pintura de quarto',
    defaultPrice: '800.00',
    unit: 'm²',
    active: true,
  })

  // Products for User A
  await db.insert(products).values({
    userId: userA.id,
    name: 'Tomada 10A',
    costPrice: '15.00',
    salePrice: '35.00',
    unit: 'un',
    active: true,
  })

  // Quotes for User A
  const [quoteA1] = await db.insert(quotes).values({
    userId: userA.id,
    clientId: clientA1.id,
    quoteNumber: 'ORC-00001',
    status: 'approved',
    subtotal: '500.00',
    discount: '50.00',
    discountType: 'fixed',
    additionalCost: '0.00',
    total: '450.00',
    publicToken: 'tok_' + Math.random().toString(36).slice(2),
  }).returning()

  await db.insert(quoteItems).values([
    {
      userId: userA.id,
      quoteId: quoteA1.id,
      type: 'service',
      description: 'Instalação de tomada',
      quantity: '2',
      unit: 'un',
      unitPrice: '150.00',
      total: '300.00',
    },
    {
      userId: userA.id,
      quoteId: quoteA1.id,
      type: 'product',
      description: 'Tomada 10A',
      quantity: '2',
      unit: 'un',
      unitPrice: '35.00',
      total: '70.00',
    },
  ])

  // Quote for User B (ISOLATED)
  const [quoteB1] = await db.insert(quotes).values({
    userId: userB.id,
    clientId: clientB1.id,
    quoteNumber: 'ORC-00001',
    status: 'sent',
    subtotal: '1600.00',
    discount: '0.00',
    discountType: 'fixed',
    additionalCost: '100.00',
    total: '1700.00',
    publicToken: 'tok_' + Math.random().toString(36).slice(2),
  }).returning()

  await db.insert(quoteItems).values({
    userId: userB.id,
    quoteId: quoteB1.id,
    type: 'service',
    description: 'Pintura de 2 quartos',
    quantity: '2',
    unit: 'un',
    unitPrice: '800.00',
    total: '1600.00',
  })

  console.log('Seed complete!')
  console.log('User A: joao@test.com / password123')
  console.log('User B: maria@test.com / password123')
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
