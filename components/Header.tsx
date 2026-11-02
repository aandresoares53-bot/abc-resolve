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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200" style={{ backgroundColor: "var(--card-bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 shrink-0">
            <span className="text-xl font-black text-blue-900">encontrar</span>
            <span className="text-xl font-black text-orange-500">hotéis</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5">
            <a href="#buscar" className="text-gray-600 hover:underline text-sm transition-colors">Buscar</a>
            <a href="#promocoes" className="text-gray-600 hover:underline text-sm transition-colors">Promoções</a>
            <a href="#datas-sazonais" className="text-gray-600 hover:underline text-sm transition-colors">Datas Especiais</a>
            <a href="#regioes" className="text-gray-600 hover:underline text-sm transition-colors">Regiões</a>
            <Link href="/mapa" className="text-gray-600 hover:underline text-sm transition-colors">🗺️ Mapa</Link>
            <Link href="/blog" className="text-gray-600 hover:underline text-sm transition-colors">Blog</Link>
            <Link href="/favoritos" className="text-gray-600 hover:underline text-sm transition-colors">❤️ Favoritos</Link>
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-all text-sm"
              title={dark ? "Modo claro" : "Modo escuro"}
            >
              {dark ? "☀️" : "🌙"}
            </button>
            <a
              href="#buscar"
              className="px-4 py-1.5 border border-orange-500 text-orange-500 text-sm font-semibold rounded-full hover:bg-orange-500 hover:text-white transition-all"
            >
              Buscar hotéis
            </a>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-1">
            <button onClick={toggleDark} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 text-sm">
              {dark ? "☀️" : "🌙"}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-3 px-4" style={{ backgroundColor: "var(--card-bg)" }}>
          <nav className="flex flex-col gap-1">
            {[
              { href: "#buscar", label: "Buscar" },
              { href: "#promocoes", label: "Promoções" },
              { href: "#datas-sazonais", label: "Datas Especiais" },
              { href: "#regioes", label: "Regiões" },
            ].map(item => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-orange-500 text-sm font-medium py-2 border-b border-gray-50">
                {item.label}
              </a>
            ))}
            <Link href="/mapa" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-orange-500 text-sm font-medium py-2 border-b border-gray-50">🗺️ Mapa</Link>
            <Link href="/blog" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-orange-500 text-sm font-medium py-2 border-b border-gray-50">Blog</Link>
            <Link href="/favoritos" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-orange-500 text-sm font-medium py-2">❤️ Favoritos</Link>
            <a href="#buscar" onClick={() => setMenuOpen(false)}
              className="mt-3 px-4 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-full text-center hover:bg-orange-600 transition-all">
              Buscar hotéis
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
