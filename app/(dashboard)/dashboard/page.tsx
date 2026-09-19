import { requireAuth } from '@/lib/auth/helpers'
import { getDashboardStats } from '@/lib/db/queries/quotes'
import { getQuotesByUserId } from '@/lib/db/queries/quotes'
import { getClientsByUserId } from '@/lib/db/queries/clients'
import { StatsCard } from '@/components/dashboard/stats-card'
import { DashboardCharts } from '@/components/dashboard/charts'
import { formatCurrency, formatDate, QUOTE_STATUS_LABELS, QUOTE_STATUS_COLORS } from '@/lib/utils'
import { FileText, CheckCircle, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await requireAuth()
  const [stats, recentQuotes, recentClients] = await Promise.all([
    getDashboardStats(user.id),
    getQuotesByUserId(user.id),
    getClientsByUserId(user.id),
  ])

  const topQuotes = recentQuotes.slice(0, 5)
  const topClients = recentClients.slice(0, 5)

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Olá, {user.name.split(' ')[0]}!</h1>
        <p className="text-gray-600">Aqui está um resumo do seu negócio.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total de Orçamentos"
          value={String(stats.total)}
          icon={<FileText className="w-5 h-5" />}
          color="blue"
        />
        <StatsCard
          title="Aprovados"
          value={String(stats.approved)}
          subtitle={`${stats.approvalRate}% de taxa`}
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
        />
        <StatsCard
          title="Aguardando"
          value={String(stats.pending)}
          icon={<Clock className="w-5 h-5" />}
          color="yellow"
        />
        <StatsCard
          title="Valor Total"
          value={formatCurrency(stats.totalValue)}
          subtitle="orçamentos aprovados"
          icon={<TrendingUp className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Charts */}
      <DashboardCharts data={stats.monthly} />

      {/* Recent data */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Quotes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Orçamentos Recentes</h2>
            <Link href="/orcamentos" className="text-blue-600 text-sm hover:underline">Ver todos</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {topQuotes.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                Nenhum orçamento criado ainda.{' '}
                <Link href="/orcamentos/novo" className="text-blue-600 hover:underline">Criar primeiro</Link>
              </div>
            ) : topQuotes.map((q) => (
              <Link key={q.id} href={`/orcamentos/${q.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{q.quoteNumber}</p>
                  <p className="text-xs text-gray-500">{q.clientName || 'Sem cliente'} • {formatDate(q.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">{formatCurrency(q.total || '0')}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${QUOTE_STATUS_COLORS[q.status] || 'bg-gray-100 text-gray-600'}`}>
                    {QUOTE_STATUS_LABELS[q.status] || q.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Clients */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Clientes Recentes</h2>
            <Link href="/clientes" className="text-blue-600 text-sm hover:underline">Ver todos</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {topClients.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                Nenhum cliente cadastrado ainda.{' '}
                <Link href="/clientes/novo" className="text-blue-600 hover:underline">Adicionar</Link>
              </div>
            ) : topClients.map((c) => (
              <Link key={c.id} href={`/clientes/${c.id}`} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.phone || c.email || 'Sem contato'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
