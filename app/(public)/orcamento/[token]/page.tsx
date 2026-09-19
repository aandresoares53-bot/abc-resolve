import { notFound } from 'next/navigation'
import { getQuoteByPublicToken, updateQuoteStatusByToken } from '@/lib/db/queries/quotes'
import { formatCurrency, formatDate, QUOTE_STATUS_LABELS, QUOTE_STATUS_COLORS } from '@/lib/utils'
import { CheckCircle, XCircle, FileText } from 'lucide-react'
import { revalidatePath } from 'next/cache'

interface Props {
  params: Promise<{ token: string }>
}

async function approveQuote(token: string) {
  'use server'
  await updateQuoteStatusByToken(token, 'approved')
  revalidatePath(`/orcamento/${token}`)
}

async function rejectQuote(token: string) {
  'use server'
  await updateQuoteStatusByToken(token, 'rejected')
  revalidatePath(`/orcamento/${token}`)
}

export default async function PublicQuotePage({ params }: Props) {
  const { token } = await params
  const quote = await getQuoteByPublicToken(token)

  if (!quote) notFound()

  const isActionable = quote.status === 'sent' || quote.status === 'draft'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Orçamento</h1>
              </div>
              <p className="text-3xl font-bold text-blue-600">{quote.quoteNumber}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${QUOTE_STATUS_COLORS[quote.status] || 'bg-gray-100 text-gray-800'}`}>
              {QUOTE_STATUS_LABELS[quote.status] || quote.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Data:</span>{' '}
              <span className="font-medium">{formatDate(quote.createdAt)}</span>
            </div>
            {quote.validUntil && (
              <div>
                <span className="text-gray-500">Válido até:</span>{' '}
                <span className="font-medium">{formatDate(quote.validUntil)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Client Info */}
        {quote.client && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">Cliente</h2>
            <p className="font-medium text-gray-900">{quote.client.name}</p>
            {quote.client.phone && <p className="text-gray-600 text-sm mt-1">Tel: {quote.client.phone}</p>}
            {quote.client.email && <p className="text-gray-600 text-sm">{quote.client.email}</p>}
            {quote.client.address && <p className="text-gray-600 text-sm">{quote.client.address}{quote.client.city ? `, ${quote.client.city}` : ''}</p>}
          </div>
        )}

        {/* Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Itens do Orçamento</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 font-medium text-gray-600">Descrição</th>
                  <th className="text-right py-2 font-medium text-gray-600">Qtd</th>
                  <th className="text-center py-2 font-medium text-gray-600">Un</th>
                  <th className="text-right py-2 font-medium text-gray-600">Preço Unit.</th>
                  <th className="text-right py-2 font-medium text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50">
                    <td className="py-3 text-gray-900">{item.description}</td>
                    <td className="py-3 text-right text-gray-600">{parseFloat(item.quantity || '1').toFixed(2)}</td>
                    <td className="py-3 text-center text-gray-600">{item.unit}</td>
                    <td className="py-3 text-right text-gray-600">{formatCurrency(item.unitPrice || '0')}</td>
                    <td className="py-3 text-right font-medium text-gray-900">{formatCurrency(item.total || '0')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col items-end gap-2">
            <div className="flex justify-between w-48 text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(quote.subtotal || '0')}</span>
            </div>
            {parseFloat(quote.discount || '0') > 0 && (
              <div className="flex justify-between w-48 text-sm">
                <span className="text-gray-600">Desconto</span>
                <span className="font-medium text-green-600">- {formatCurrency(quote.discount || '0')}</span>
              </div>
            )}
            {parseFloat(quote.additionalCost || '0') > 0 && (
              <div className="flex justify-between w-48 text-sm">
                <span className="text-gray-600">Custos adicionais</span>
                <span className="font-medium">{formatCurrency(quote.additionalCost || '0')}</span>
              </div>
            )}
            <div className="flex justify-between w-48 text-lg font-bold border-t pt-2 mt-1 border-gray-200">
              <span>Total</span>
              <span className="text-blue-600">{formatCurrency(quote.total || '0')}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {quote.notes && (
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-2">Observações</h2>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{quote.notes}</p>
          </div>
        )}

        {/* Actions */}
        {isActionable && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-2">O que você deseja fazer?</h2>
            <p className="text-gray-600 text-sm mb-4">Clique em um dos botões abaixo para responder a este orçamento.</p>
            <div className="flex gap-4">
              <form action={approveQuote.bind(null, token)}>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Aprovar Orçamento
                </button>
              </form>
              <form action={rejectQuote.bind(null, token)}>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 px-6 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  Recusar
                </button>
              </form>
            </div>
          </div>
        )}

        {quote.status === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-green-800">Orçamento Aprovado!</h2>
            <p className="text-green-700 mt-1">Obrigado! O profissional entrará em contato em breve.</p>
          </div>
        )}

        {quote.status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-red-800">Orçamento Recusado</h2>
            <p className="text-red-700 mt-1">Entendemos. Qualquer dúvida, entre em contato.</p>
          </div>
        )}
      </div>
    </div>
  )
}
