import { requireAuth } from '@/lib/auth/helpers'
import { getClientsByUserId } from '@/lib/db/queries/clients'
import Link from 'next/link'
import { Plus, Users } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function ClientesPage() {
  const user = await requireAuth()
  const clients = await getClientsByUserId(user.id)

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">{clients.length} cliente{clients.length !== 1 ? 's' : ''} cadastrado{clients.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/clientes/novo"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-1">Nenhum cliente ainda</h3>
          <p className="text-gray-500 text-sm mb-4">Adicione seus clientes para incluí-los nos orçamentos.</p>
          <Link href="/clientes/novo" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Adicionar Cliente
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Telefone</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">E-mail</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Cadastrado em</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{client.name}</p>
                        {client.city && <p className="text-xs text-gray-500">{client.city}{client.state ? `, ${client.state}` : ''}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 hidden md:table-cell">{client.phone || '-'}</td>
                  <td className="p-4 text-sm text-gray-600 hidden md:table-cell">{client.email || '-'}</td>
                  <td className="p-4 text-sm text-gray-500 hidden lg:table-cell">{formatDate(client.createdAt)}</td>
                  <td className="p-4">
                    <Link href={`/clientes/${client.id}`} className="text-blue-600 hover:underline text-sm font-medium">
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
