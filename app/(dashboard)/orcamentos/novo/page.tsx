import { requireAuth } from '@/lib/auth/helpers'
import { getClientsByUserId } from '@/lib/db/queries/clients'
import { getServicesByUserId } from '@/lib/db/queries/services'
import { getProductsByUserId } from '@/lib/db/queries/products'
import { getBusinessByUserId } from '@/lib/db/queries/users'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { QuoteForm } from '@/components/quotes/quote-form'

export default async function NovoOrcamentoPage() {
  const user = await requireAuth()
  const [clients, services, products, business] = await Promise.all([
    getClientsByUserId(user.id),
    getServicesByUserId(user.id),
    getProductsByUserId(user.id),
    getBusinessByUserId(user.id),
  ])

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/orcamentos" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mb-4">
          <ArrowLeft className="w-4 h-4" />
          Voltar para orçamentos
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Novo Orçamento</h1>
      </div>

      <QuoteForm
        clients={clients}
        services={services}
        products={products}
        defaultValidityDays={business?.defaultValidityDays ?? 30}
        defaultNotes={business?.defaultNotes ?? ''}
      />
    </div>
  )
}
