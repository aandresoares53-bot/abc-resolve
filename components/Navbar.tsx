'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
              A
            </div>
            <span className="hidden text-xl font-bold text-gray-900 sm:inline">
              ABC Resolve
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/categorias"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-600"
            >
              Categorias
            </Link>
            {isLoggedIn && user?.tipo === 'cliente' && (
              <Link
                href="/solicitacoes/nova"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-600"
              >
                Postar Solicitação
              </Link>
            )}
            <Link
              href="/prestadores"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-600"
            >
              Prestadores
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {!isLoading && isLoggedIn && user ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
                    {user.nome.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.nome}</span>
                </div>
                <Link href="/conta" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-brand-600">
                  <User size={18} />
                  <span className="hidden sm:inline">Conta</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-600"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/registrar"
                  className="btn-primary text-sm"
                >
                  Cadastre-se
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <Link
              href="/categorias"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Categorias
            </Link>
            {isLoggedIn && user?.tipo === 'cliente' && (
              <Link
                href="/solicitacoes/nova"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Postar Solicitação
              </Link>
            )}
            <Link
              href="/prestadores"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Prestadores
            </Link>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Sair
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
