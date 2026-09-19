import { requireAuth } from '@/lib/auth/helpers'
import { getQuoteByIdAndUserId } from '@/lib/db/queries/quotes'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, MessageCircle, Share2 } from 'lucide-react'
import { formatCurrency, formatDate, QUOTE_STATUS_LABELS, QUOTE_STATUS_COLORS } from '@/lib/utils'
import { updateQuoteStatusAction } from '@/lib/actions/quotes'

interface Props {
  params: Promise<{ id: string }>
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  draft: ['sent'],
  sent: ['approved', 'rejected'],
  approved: [],
  rejected: ['draft'],
  expired: ['draft'],
}

const STATUS_BUTTON_LABELS: Record<string, string> = {
  sent: 'Marcar como Enviado',
  approved: 'Marcar como Aprovado',
  rejected: 'Marcar como Rejeitado',
  draft: 'Voltar para Rascunho',
}

export default async function OrcamentoDetailPage({ params }: Props) {
  const user = await requireAuth()
  const { id } = await params
  const [quote] = await Promise.all([
    getQuoteByIdAndUserId(id, user.id),
  ])

  if (!quote) notFound()

  const waNumber = quote.client?.whatsapp?.replace(/\D/g, '') || quote.client?.phone?.replace(/\D/g, '')
  const waMessage = encodeURIComponent(
    `Olá ${quote.client?.name || ''}, segue o link do seu orçamento ${quote.quoteNumber}: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orcamento/${quote.publicToken}`
  )

  const nextStatuses = STATUS_TRANSITIONS[quote.status] || []

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/orcamentos" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mb-4">
          <ArrowLeft className="w-4 h-4" />
          Voltar para orçamentos
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quote.quoteNumber}</h1>
            {quote.client && <p className="text-gray-600 mt-1">Cliente: {quote.client.name}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${QUOTE_STATUS_COLORS[quote.status]}`}>
              {QUOTE_STATUS_LABELS[quote.status]}
            </span>
            {nextStatuses.map((s) => (
              <form key={s} action={updateQuoteStatusAction.bind(null, id, s)}>
                <button type="submit" className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  {STATUS_BUTTON_LABELS[s]}
                </button>
              </form>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href={`/orcamentos/${id}/pdf`}
          target="_blank"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Baixar PDF
        </Link>
        {waNumber && (
          <a
            href={`https://wa.me/${waNumber}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Enviar WhatsApp
          </a>
        )}
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/orcamento/${quote.publicToken}`)
          }}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Copiar link público
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="grid md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">Data de emissão</p>
            <p className="font-medium mt-1">{formatDate(quote.createdAt)}</p>
          </div>
          {quote.validUntil && (
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Válido até</p>
              <p className="font-medium mt-1">{formatDate(quote.validUntil)}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium">Total</p>
            <p className="text-xl font-bold text-blue-600 mt-1">{formatCurrency(quote.total || '0')}</p>
          </div>
        </div>

        {/* Items table */}
        <h2 className="font-semibold text-gray-900 mb-4">Itens</h2>
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
                  <td className="py-3">{item.description}</td>
                  <td className="py-3 text-right">{parseFloat(item.quantity || '1').toFixed(2)}</td>
                  <td className="py-3 text-center">{item.unit}</td>
                  <td className="py-3 text-right">{formatCurrency(item.unitPrice || '0')}</td>
                  <td className="py-3 text-right font-medium">{formatCurrency(item.total || '0')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col items-end gap-2">
          <div className="flex justify-between w-52 text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatCurrency(quote.subtotal || '0')}</span>
          </div>
          {parseFloat(quote.discount || '0') > 0 && (
            <div className="flex justify-between w-52 text-sm text-green-700">
              <span>Desconto</span>
              <span>- {formatCurrency(quote.discount || '0')}</span>
            </div>
          )}
          {parseFloat(quote.additionalCost || '0') > 0 && (
            <div className="flex justify-between w-52 text-sm">
              <span className="text-gray-600">Custos adicionais</span>
              <span>{formatCurrency(quote.additionalCost || '0')}</span>
            </div>
          )}
          <div className="flex justify-between w-52 border-t pt-2 mt-1">
            <span className="font-bold">Total</span>
            <span className="font-bold text-blue-600">{formatCurrency(quote.total || '0')}</span>
          </div>
        </div>
      </div>

      {quote.notes && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">Observações</h2>
          <p className="text-gray-700 text-sm whitespace-pre-wrap">{quote.notes}</p>
        </div>
      )}

      {/* History */}
      {quote.history.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Histórico</h2>
          <div className="space-y-3">
            {quote.history.map((h) => (
              <div key={h.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-900">{h.description || h.action}</p>
                  <p className="text-xs text-gray-500">{formatDate(h.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
