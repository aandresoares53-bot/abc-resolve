'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Wrench,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { logoutAction } from '@/lib/actions/auth'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/orcamentos', label: 'Orçamentos', icon: FileText },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/servicos', label: 'Serviços', icon: Wrench },
  { href: '/produtos', label: 'Produtos', icon: Package },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
]

interface SidebarProps {
  userName: string
}

export function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const NavLinks = () => (
    <>
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive(href)
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          {label}
        </Link>
      ))}
    </>
  )

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-gray-200 bg-white">
        <span className="font-bold text-blue-600">Orçamento Fácil</span>
        <button onClick={() => setOpen(!open)} className="text-gray-600">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative bg-white w-64 h-full shadow-xl p-4 flex flex-col">
            <div className="font-bold text-blue-600 text-lg mb-6 mt-2">Orçamento Fácil</div>
            <nav className="space-y-1 flex-1">
              <NavLinks />
            </nav>
            <div className="border-t pt-4">
              <div className="text-sm text-gray-600 mb-3 truncate">{userName}</div>
              <form action={logoutAction}>
                <button type="submit" className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium">
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-white border-r border-gray-200 p-4">
        <div className="font-bold text-blue-600 text-lg mb-8 px-3">Orçamento Fácil</div>
        <nav className="space-y-1 flex-1">
          <NavLinks />
        </nav>
        <div className="border-t pt-4">
          <div className="text-sm text-gray-600 mb-3 px-3 truncate">{userName}</div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
