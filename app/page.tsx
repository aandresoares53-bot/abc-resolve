'use client';

import Link from 'next/link';
import { Search, MapPin, Zap } from 'lucide-react';
import { CATEGORIAS_DEFAULT } from '@/lib/constants';

const categorias = CATEGORIAS_DEFAULT.slice(0, 6);

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-50 to-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Encontre os melhores serviços em São Paulo
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Conectamos clientes com prestadores de serviços confiáveis
            </p>
          </div>

          {/* Search Bar */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="O que você procura?"
                className="input-base pl-10 w-full"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Qual cidade?"
                className="input-base pl-10 w-full"
              />
            </div>
            <button className="btn-primary w-full">Buscar</button>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-gray-600 mb-3">Você oferece serviços?</p>
            <Link
              href="/auth/registrar"
              className="inline-flex items-center gap-2 btn-secondary"
            >
              <Zap size={18} />
              Cadastre-se como Prestador
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Categorias Populares</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categorias.map((categoria) => (
              <Link
                key={categoria}
                href={`/categorias/${categoria.toLowerCase().replace(/\s+/g, '-')}`}
                className="card text-center transition-transform hover:scale-105 hover:shadow-md"
              >
                <div className="text-3xl mb-3">
                  {/* Icon placeholder */}
                  📦
                </div>
                <h3 className="font-medium text-gray-900">{categoria}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Como Funciona</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* For Customers */}
            <div className="card">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Encontre Serviços</h3>
              <p className="text-gray-600">
                Navegue por categorias e encontre prestadores qualificados em sua região
              </p>
            </div>

            {/* Request Quote */}
            <div className="card">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Solicite Orçamentos</h3>
              <p className="text-gray-600">
                Descreva seu serviço e receba orçamentos de múltiplos prestadores
              </p>
            </div>

            {/* Hire */}
            <div className="card">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Escolha e Contrate</h3>
              <p className="text-gray-600">
                Compare orçamentos e contrate o melhor profissional para seu trabalho
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-600 py-16 md:py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-brand-50 mb-8 max-w-2xl mx-auto">
            Escolha entre milhares de prestadores de serviços qualificados em São Paulo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-brand-600 font-medium px-8 py-3 rounded-lg hover:bg-brand-50 transition-colors">
              Buscar Serviços
            </button>
            <button className="border-2 border-white text-white font-medium px-8 py-3 rounded-lg hover:bg-brand-700 transition-colors">
              Sou Prestador
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
