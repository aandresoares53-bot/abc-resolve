'use client'

import { useState, useEffect } from 'react'
import { createServiceAction, deleteServiceAction, updateServiceAction, getServicesAction } from '@/lib/actions/services'
import { formatCurrency } from '@/lib/utils'
import { Plus, Pencil, Trash2, Wrench } from 'lucide-react'
import type { Service } from '@/drizzle/schema'

export default function ServicosPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const data = await getServicesAction()
    setServices(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(formData: FormData) {
    const result = editing
      ? await updateServiceAction(editing.id, formData)
      : await createServiceAction(formData)
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
    if (!confirm('Excluir este serviço?')) return
    await deleteServiceAction(id)
    await load()
  }

  if (loading) return <div className="p-8 text-gray-500">Carregando...</div>

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600">Catálogo de serviços para usar nos orçamentos</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null) }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Serviço
        </button>
      </div>

      {/* Form */}
      {(showForm || editing) && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">{editing ? 'Editar Serviço' : 'Novo Serviço'}</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço padrão (R$)</label>
              <input name="defaultPrice" type="number" step="0.01" min="0" defaultValue={editing?.defaultPrice ?? '0'} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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

      {services.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-1">Nenhum serviço cadastrado</h3>
          <p className="text-gray-500 text-sm">Adicione seus serviços para usar nos orçamentos.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase">Nome</th>
                <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase">Preço</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Un</th>
                <th className="text-center p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-medium text-sm text-gray-900">{s.name}</p>
                    {s.description && <p className="text-xs text-gray-500">{s.description}</p>}
                  </td>
                  <td className="p-4 text-right text-sm font-medium">{formatCurrency(s.defaultPrice || '0')}</td>
                  <td className="p-4 text-center text-sm text-gray-600">{s.unit}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => { setEditing(s); setShowForm(false) }} className="text-blue-600 hover:text-blue-700">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-600">
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
