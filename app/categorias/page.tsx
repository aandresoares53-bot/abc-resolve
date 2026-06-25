'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin } from 'lucide-react';
import { CATEGORIAS_DEFAULT, CIDADES_SP } from '@/lib/constants';

const mockServicos = [
  {
    id: 1,
    titulo: 'Encanamento Residencial',
    prestador: { nome: 'João Silva', avatar: 'J' },
    preco_minimo: 150,
    preco_maximo: 500,
    avaliacao: 4.8,
    total_avaliacoes: 24,
    experiencia_anos: 5,
    categoria: 'Encanador',
  },
  {
    id: 2,
    titulo: 'Instalação Elétrica Completa',
    prestador: { nome: 'Carlos Santos', avatar: 'C' },
    preco_minimo: 300,
    preco_maximo: 1200,
    avaliacao: 4.9,
    total_avaliacoes: 48,
    experiencia_anos: 8,
    categoria: 'Eletricista',
  },
  {
    id: 3,
    titulo: 'Móvel Planejado',
    prestador: { nome: 'Pedro Oliveira', avatar: 'P' },
    preco_minimo: 500,
    preco_maximo: 3000,
    avaliacao: 4.7,
    total_avaliacoes: 15,
    experiencia_anos: 12,
    categoria: 'Marceneiro',
  },
  {
    id: 4,
    titulo: 'Reforma Completa',
    prestador: { nome: 'Lucas Costa', avatar: 'L' },
    preco_minimo: 2000,
    preco_maximo: 10000,
    avaliacao: 4.6,
    total_avaliacoes: 32,
    experiencia_anos: 10,
    categoria: 'Pedreiro',
  },
];

export default function CategoriasPage() {
  const [busca, setBusca] = useState('');
  const [cidade, setCidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState({ min: 0, max: 5000 });
  const [avaliacao, setAvaliacao] = useState(0);

  const filtrados = mockServicos.filter(s => {
    const matchBusca = s.titulo.toLowerCase().includes(busca.toLowerCase());
    const matchCidade = !cidade || Math.random() > 0.3; // Mock
    const matchCategoria = !categoria || s.categoria === categoria;
    const matchPreco = s.preco_minimo >= preco.min && s.preco_minimo <= preco.max;
    const matchAvaliacao = s.avaliacao >= avaliacao;

    return matchBusca && matchCidade && matchCategoria && matchPreco && matchAvaliacao;
  });

  return (
    <div className="min-h-[calc(100vh-64px-200px)] bg-gray-50">
      {/* Top Search Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="O que você procura?"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="input-base pl-10 w-full"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="input-base pl-10 w-full"
              >
                <option value="">Todas as cidades</option>
                {CIDADES_SP.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button className="btn-primary w-full">Buscar</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-6">
            {/* Categoria Filter */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Categoria</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setCategoria('')}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !categoria
                      ? 'bg-brand-50 text-brand-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Todas
                </button>
                {CATEGORIAS_DEFAULT.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoria(cat)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      categoria === cat
                        ? 'bg-brand-50 text-brand-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Preço Filter */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Preço</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Mínimo: R$ {preco.min}</label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={preco.min}
                    onChange={(e) => setPreco({ ...preco, min: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Máximo: R$ {preco.max}</label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={preco.max}
                    onChange={(e) => setPreco({ ...preco, max: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Avaliação Filter */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Avaliação Mínima</h3>
              <div className="space-y-2">
                {[0, 3, 3.5, 4, 4.5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setAvaliacao(rating)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      avaliacao === rating
                        ? 'bg-brand-50 text-brand-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {rating === 0 ? 'Qualquer avaliação' : `${rating}+ ⭐`}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setBusca('');
                setCidade('');
                setCategoria('');
                setPreco({ min: 0, max: 5000 });
                setAvaliacao(0);
              }}
              className="btn-secondary w-full"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Serviços disponíveis
            </h1>
            <p className="text-gray-600 mt-1">
              {filtrados.length} serviço{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Services Grid */}
          {filtrados.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filtrados.map(servico => (
                <Link
                  key={servico.id}
                  href={`/servicos/${servico.id}`}
                  className="card hover:shadow-lg transition-shadow group"
                >
                  {/* Thumbnail placeholder */}
                  <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-50 rounded-lg mb-4 flex items-center justify-center group-hover:from-brand-200 transition-colors">
                    <div className="text-4xl">📸</div>
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
                    {servico.titulo}
                  </h3>

                  {/* Prestador */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
                      {servico.prestador.avatar}
                    </div>
                    <span className="text-sm text-gray-700">{servico.prestador.nome}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-900">
                      {servico.avaliacao}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({servico.total_avaliacoes})
                    </span>
                  </div>

                  {/* Preço */}
                  <div className="mb-3">
                    <span className="text-lg font-bold text-brand-600">
                      R$ {servico.preco_minimo.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      a R$ {servico.preco_maximo.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      {servico.experiencia_anos} anos de experiência
                    </span>
                    <span className="text-xs font-medium text-brand-600">
                      Ver detalhes →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum serviço encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Tente ajustar seus filtros ou buscar por outra categoria
              </p>
              <button
                onClick={() => {
                  setBusca('');
                  setCategoria('');
                }}
                className="btn-primary"
              >
                Limpar busca
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
