"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      setDark(localStorage.getItem("theme") === "dark");
    } catch {}
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">🏨</div>
            <div>
              <span className="font-bold text-sm leading-tight block" style={{ color: "var(--foreground)" }}>Encontrar</span>
              <span className="text-blue-600 font-bold text-sm leading-tight block">Hotéis & Pousadas</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#buscar" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">Buscar</a>
            <a href="#promocoes" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">Promoções</a>
            <a href="#datas-sazonais" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">Datas Sazonais</a>
            <a href="#regioes" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors">Regiões</a>
            <Link href="/favoritos" className="text-gray-600 hover:text-red-500 font-medium text-sm transition-colors flex items-center gap-1">❤️ Favoritos</Link>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleDark}
              className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              title={dark ? "Modo claro" : "Modo escuro"}
            >
              {dark ? "☀️" : "🌙"}
            </button>
            <a href="#buscar" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all">✨ Busca com IA</a>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleDark} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              {dark ? "☀️" : "🌙"}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4" style={{ backgroundColor: "var(--background)" }}>
          <nav className="flex flex-col gap-3">
            <a href="#buscar" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">Buscar</a>
            <a href="#promocoes" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">Promoções</a>
            <a href="#datas-sazonais" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">Datas Sazonais</a>
            <a href="#regioes" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">Regiões</a>
            <Link href="/favoritos" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-red-500 font-medium py-2 flex items-center gap-1">❤️ Favoritos</Link>
            <a href="#buscar" onClick={() => setMenuOpen(false)} className="mt-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl text-center">✨ Busca com IA</a>
          </nav>
        </div>
      )}
    </header>
  );
}
