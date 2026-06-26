"use client";

import { useState, useEffect } from "react";
import { Wand2, Menu, X } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-white/5 shadow-lg shadow-black/20" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Wand2 size={16} className="text-white" />
          </div>
          <div>
            <span className="text-white font-black text-lg tracking-tight leading-none block">
              PromptVision
            </span>
            <span className="text-violet-400 text-xs font-medium leading-none">
              AI Image Prompts
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Gerador", href: "#generator" },
            { label: "Como Usar", href: "#" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#generator"
            className="ml-2 btn-primary text-sm"
          >
            <Wand2 size={14} />
            Criar Prompt
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-slate-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/5 px-4 py-4 space-y-1">
          <a
            href="#generator"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            Gerador
          </a>
          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            Como Usar
          </a>
        </div>
      )}
    </header>
  );
}
