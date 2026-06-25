'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Wrench } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-primary-700">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg">
              <Wrench size={18} />
            </div>
            ABC<span className="text-accent-500">Resolve</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/#como-funciona" className="hover:text-primary-600 transition-colors">Como funciona</Link>
            <Link href="/#categorias" className="hover:text-primary-600 transition-colors">Serviços</Link>
            <Link href="/solicitar-servico" className="hover:text-primary-600 transition-colors">Pedir orçamento</Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/solicitar-servico" className="btn-accent text-sm py-2">
              Solicitar serviço
            </Link>
            <Link href="/cadastro-prestador" className="btn-secondary text-sm py-2">
              Sou prestador
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link href="/#como-funciona" className="block py-2 text-gray-700 hover:text-primary-600 font-medium" onClick={() => setMenuOpen(false)}>
            Como funciona
          </Link>
          <Link href="/#categorias" className="block py-2 text-gray-700 hover:text-primary-600 font-medium" onClick={() => setMenuOpen(false)}>
            Serviços
          </Link>
          <Link href="/solicitar-servico" className="block btn-accent text-center mt-2" onClick={() => setMenuOpen(false)}>
            Solicitar serviço
          </Link>
          <Link href="/cadastro-prestador" className="block btn-secondary text-center" onClick={() => setMenuOpen(false)}>
            Sou prestador
          </Link>
        </div>
      )}
    </header>
  );
}
