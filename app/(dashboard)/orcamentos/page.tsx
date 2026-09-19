import { requireAuth } from '@/lib/auth/helpers'
import { getQuotesByUserId } from '@/lib/db/queries/quotes'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import { formatCurrency, formatDate, QUOTE_STATUS_LABELS, QUOTE_STATUS_COLORS } from '@/lib/utils'

export default async function OrcamentosPage() {
  const user = await requireAuth()
  const quotes = await getQuotesByUserId(user.id)

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orçamentos</h1>
          <p className="text-gray-600">{quotes.length} orçamento{quotes.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/orcamentos/novo"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Orçamento
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-1">Nenhum orçamento criado</h3>
          <p className="text-gray-500 text-sm mb-4">Crie seu primeiro orçamento agora mesmo.</p>
          <Link href="/orcamentos/novo" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Criar Orçamento
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Número</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Cliente</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Data</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {quotes.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-blue-600 text-sm">{q.quoteNumber}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-700 hidden md:table-cell">{q.clientName || '-'}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${QUOTE_STATUS_COLORS[q.status] || 'bg-gray-100 text-gray-600'}`}>
                      {QUOTE_STATUS_LABELS[q.status] || q.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-semibold text-gray-900 text-sm">{formatCurrency(q.total || '0')}</td>
                  <td className="p-4 text-sm text-gray-500 hidden lg:table-cell">{formatDate(q.createdAt)}</td>
                  <td className="p-4">
                    <Link href={`/orcamentos/${q.id}`} className="text-blue-600 hover:underline text-sm font-medium">
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
