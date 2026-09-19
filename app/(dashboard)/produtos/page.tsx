'use client'

import { useState, useEffect } from 'react'
import { createProductAction, deleteProductAction, updateProductAction, getProductsAction } from '@/lib/actions/products'
import { formatCurrency } from '@/lib/utils'
import { Plus, Pencil, Trash2, Package } from 'lucide-react'
import type { Product } from '@/drizzle/schema'

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const data = await getProductsAction()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(formData: FormData) {
    const result = editing
      ? await updateProductAction(editing.id, formData)
      : await createProductAction(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setShowForm(false)
      setEditing(null)
      setError(null)
      await load()
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este produto?')) return
    await deleteProductAction(id)
    await load()
  }

  if (loading) return <div className="p-8 text-gray-500">Carregando...</div>

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600">Catálogo de produtos para usar nos orçamentos</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null) }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Produto
        </button>
      </div>

      {(showForm || editing) && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">{editing ? 'Editar Produto' : 'Novo Produto'}</h2>
          {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded mb-4">{error}</div>}
          <form action={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input name="name" required defaultValue={editing?.name} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <input name="description" defaultValue={editing?.description ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço de custo (R$)</label>
              <input name="costPrice" type="number" step="0.01" min="0" defaultValue={editing?.costPrice ?? '0'} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço de venda (R$)</label>
              <input name="salePrice" type="number" step="0.01" min="0" defaultValue={editing?.salePrice ?? '0'} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
              <input name="unit" defaultValue={editing?.unit ?? 'un'} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Salvar</button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setError(null) }} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-1">Nenhum produto cadastrado</h3>
          <p className="text-gray-500 text-sm">Adicione seus produtos para usar nos orçamentos.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Nome</th>
                <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase">Custo</th>
                <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase">Venda</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Un</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-medium text-sm text-gray-900">{p.name}</p>
                    {p.description && <p className="text-xs text-gray-500">{p.description}</p>}
                  </td>
                  <td className="p-4 text-right text-sm text-gray-600">{formatCurrency(p.costPrice || '0')}</td>
                  <td className="p-4 text-right text-sm font-medium">{formatCurrency(p.salePrice || '0')}</td>
                  <td className="p-4 text-center text-sm text-gray-600">{p.unit}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => { setEditing(p); setShowForm(false) }} className="text-blue-600 hover:text-blue-700">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
