"use client";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">🏨</div>
            <div>
              <span className="font-bold text-gray-900 text-sm leading-tight block">Encontrar</span>
              <span className="text-blue-600 font-bold text-sm leading-tight block">Hotéis & Pousadas</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#buscar" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">Buscar</a>
            <a href="#promocoes" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">Promoções</a>
            <a href="#datas-sazonais" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">Datas Sazonais</a>
            <a href="#regioes" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">Regiões</a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <a href="#buscar" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all">✨ Busca com IA</a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
          <nav className="flex flex-col gap-3">
            <a href="#buscar" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">Buscar</a>
            <a href="#promocoes" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">Promoções</a>
            <a href="#datas-sazonais" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">Datas Sazonais</a>
            <a href="#regioes" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">Regiões</a>
            <a href="#buscar" onClick={() => setMenuOpen(false)} className="mt-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl text-center">✨ Busca com IA</a>
          </nav>
        </div>
      )}
    </header>
  );
}
