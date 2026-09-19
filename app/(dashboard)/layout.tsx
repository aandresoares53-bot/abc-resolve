import { requireAuth } from '@/lib/auth/helpers'
import { Sidebar } from '@/components/dashboard/sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={user.name} />
      <main className="flex-1 lg:overflow-auto">
        {children}
      </main>
    </div>
  )
}
