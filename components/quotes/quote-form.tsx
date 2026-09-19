'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createQuoteAction } from '@/lib/actions/quotes'
import { formatCurrency, calculateQuoteTotals } from '@/lib/utils'
import { Plus, Trash2, Package, Wrench } from 'lucide-react'
import { addDays, format } from 'date-fns'
import type { Client, Service, Product } from '@/drizzle/schema'

interface QuoteItem {
  id: string
  type: 'service' | 'product' | 'labor' | 'other'
  description: string
  quantity: number
  unit: string
  unitPrice: number
}

interface Props {
  clients: Client[]
  services: Service[]
  products: Product[]
  defaultValidityDays: number
  defaultNotes: string
}

const ITEM_TYPES = [
  { value: 'service', label: 'Serviço' },
  { value: 'product', label: 'Produto' },
  { value: 'labor', label: 'Mão de obra' },
  { value: 'other', label: 'Outro' },
]

function newItem(): QuoteItem {
  return {
    id: Math.random().toString(36).slice(2),
    type: 'service',
    description: '',
    quantity: 1,
    unit: 'un',
    unitPrice: 0,
  }
}

export function QuoteForm({ clients, services, products, defaultValidityDays, defaultNotes }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientId, setClientId] = useState<string>('')
  const [items, setItems] = useState<QuoteItem[]>([newItem()])
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed')
  const [additionalCost, setAdditionalCost] = useState(0)
  const [notes, setNotes] = useState(defaultNotes)
  const [validUntil, setValidUntil] = useState(
    format(addDays(new Date(), defaultValidityDays), 'yyyy-MM-dd')
  )

  const { subtotal, discountAmount, total } = calculateQuoteTotals(items, discount, discountType, additionalCost)

  const updateItem = useCallback((id: string, field: keyof QuoteItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const addFromService = (service: Service) => {
    setItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        type: 'service' as const,
        description: service.name,
        quantity: 1,
        unit: service.unit,
        unitPrice: parseFloat(service.defaultPrice || '0'),
      },
    ])
  }

  const addFromProduct = (product: Product) => {
    setItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        type: 'product' as const,
        description: product.name,
        quantity: 1,
        unit: product.unit,
        unitPrice: parseFloat(product.salePrice || '0'),
      },
    ])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) {
      setError('Adicione pelo menos um item ao orçamento.')
      return
    }
    if (items.some((i) => !i.description)) {
      setError('Preencha a descrição de todos os itens.')
      return
    }
    setLoading(true)
    setError(null)

    const result = await createQuoteAction({
      clientId: clientId || null,
      items,
      discount,
      discountType,
      additionalCost,
      validUntil,
      notes,
    })

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {/* Client */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Cliente</h2>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sem cliente específico</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          <a href="/clientes/novo" target="_blank" className="text-blue-600 hover:underline">Cadastrar novo cliente</a>
        </p>
      </div>

      {/* Quick add from catalog */}
      {(services.length > 0 || products.length > 0) && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Adicionar do catálogo</h2>
          <div className="flex flex-wrap gap-2">
            {services.filter((s) => s.active).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => addFromService(s)}
                className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
              >
                <Wrench className="w-3 h-3" />
                {s.name}
              </button>
            ))}
            {products.filter((p) => p.active).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => addFromProduct(p)}
                className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors"
              >
                <Package className="w-3 h-3" />
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Itens do Orçamento</h2>
          <button
            type="button"
            onClick={() => setItems((p) => [...p, newItem()])}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Adicionar item
          </button>
        </div>

        <div className="space-y-3">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase px-1">
            <div className="col-span-1">Tipo</div>
            <div className="col-span-4">Descrição</div>
            <div className="col-span-1">Qtd</div>
            <div className="col-span-1">Un</div>
            <div className="col-span-2">Preço Unit.</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-1"></div>
          </div>

          {items.map((item) => {
            const lineTotal = item.quantity * item.unitPrice
            return (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg">
                <div className="md:col-span-1">
                  <select
                    value={item.type}
                    onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {ITEM_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-4">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Descrição do item"
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-1">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-1">
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2 text-right text-sm font-semibold text-gray-900">
                  {formatCurrency(lineTotal)}
                </div>
                <div className="md:col-span-1 flex justify-end">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Totals */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col items-end gap-3">
          <div className="flex justify-between items-center w-full max-w-xs text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex items-center gap-2 w-full max-w-xs">
            <span className="text-gray-600 text-sm flex-shrink-0">Desconto</span>
            <div className="flex gap-1 ml-auto">
              <input
                type="number"
                step="0.01"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-24 border border-gray-300 rounded px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'fixed' | 'percent')}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="fixed">R$</option>
                <option value="percent">%</option>
              </select>
            </div>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between items-center w-full max-w-xs text-sm text-green-700">
              <span>- Desconto</span>
              <span>- {formatCurrency(discountAmount)}</span>
            </div>
          )}

          <div className="flex items-center gap-2 w-full max-w-xs">
            <span className="text-gray-600 text-sm flex-shrink-0">Custo adicional</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={additionalCost}
              onChange={(e) => setAdditionalCost(parseFloat(e.target.value) || 0)}
              className="w-24 ml-auto border border-gray-300 rounded px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between items-center w-full max-w-xs border-t pt-2 mt-1">
            <span className="font-bold text-lg text-gray-900">Total</span>
            <span className="font-bold text-xl text-blue-600">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Validade do orçamento</label>
          <input
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2 md:row-start-1 md:col-start-1">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Termos, condições, prazo de execução..."
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Criar Orçamento'}
        </button>
        <button type="button" onClick={() => router.back()} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  )
}
