'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Pencil } from 'lucide-react'
import { updateClientAction, deleteClientAction } from '@/lib/actions/clients'
import { use } from 'react'
import { getClientAction } from '@/lib/actions/clients'
import { useEffect, useState } from 'react'
import type { Client } from '@/drizzle/schema'
import { useRouter } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default function ClienteDetailPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loadingClient, setLoadingClient] = useState(true)

  useEffect(() => {
    getClientAction(id).then((c) => {
      if (!c) router.push('/clientes')
      setClient(c)
      setLoadingClient(false)
    })
  }, [id, router])

  type ActionState = { error?: string | null }
  const [state, formAction] = useActionState(
    async (_prev: ActionState, formData: FormData): Promise<ActionState> => {
      const result = await updateClientAction(id, formData)
      return result ? { error: result.error } : { error: null }
    },
    { error: null }
  )

  if (loadingClient) return <div className="p-8 text-gray-500">Carregando...</div>
  if (!client) return null

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/clientes" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mb-4">
          <ArrowLeft className="w-4 h-4" />
          Voltar para clientes
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {state?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{state.error}</div>
        )}
        <form action={formAction} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input name="name" required type="text" defaultValue={client.name} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF / CNPJ</label>
              <input name="document" type="text" defaultValue={client.document ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input name="phone" type="tel" defaultValue={client.phone ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input name="whatsapp" type="tel" defaultValue={client.whatsapp ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input name="email" type="email" defaultValue={client.email ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <input name="address" type="text" defaultValue={client.address ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input name="city" type="text" defaultValue={client.city ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <input name="state" type="text" maxLength={2} defaultValue={client.state ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <input name="zipCode" type="text" defaultValue={client.zipCode ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea name="notes" rows={3} defaultValue={client.notes ?? ''} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-3">
              <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                <Pencil className="w-4 h-4" />
                Salvar
              </button>
              <Link href="/clientes" className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Cancelar
              </Link>
            </div>
            <form action={async () => { await deleteClientAction(id) }}>
              <button type="submit" className="text-red-600 hover:text-red-700 text-sm font-medium" onClick={(e) => { if (!confirm('Excluir este cliente?')) e.preventDefault() }}>
                Excluir
              </button>
            </form>
          </div>
        </form>
      </div>
    </div>
  )
}
