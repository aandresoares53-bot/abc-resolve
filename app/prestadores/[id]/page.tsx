'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, Award, Phone, Mail, MessageCircle, Share2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const mockPrestador = {
  id: 1,
  nome: 'João Silva',
  avatar: 'J',
  cidade: 'São Paulo',
  estado: 'SP',
  verificado: true,
  avaliacao: 4.8,
  total_avaliacoes: 24,
  experiencia_anos: 5,
  bio: 'Profissional especializado em encanamento residencial e comercial. Trabalho com qualidade e pontualidade garantida.',
  telefone: '(11) 98765-4321',
  email: 'joao@example.com',
  categorias: ['Encanador', 'Hidráulica'],

  servicos: [
    {
      id: 1,
      titulo: 'Encanamento Residencial e Comercial',
      preco_minimo: 150,
      preco_maximo: 500,
      avaliacao: 4.8,
      total_avaliacoes: 24,
    },
    {
      id: 2,
      titulo: 'Conserto de Vazamentos',
      preco_minimo: 100,
      preco_maximo: 300,
      avaliacao: 4.9,
      total_avaliacoes: 18,
    },
    {
      id: 3,
      titulo: 'Desentupimento Profissional',
      preco_minimo: 80,
      preco_maximo: 250,
      avaliacao: 4.7,
      total_avaliacoes: 15,
    },
  ],

  avaliacoes: [
    {
      id: 1,
      cliente: { nome: 'Maria Santos', avatar: 'M' },
      servico: 'Encanamento Residencial',
      estrelas: 5,
      comentario: 'Excelente profissional! Resolveu meu problema rapidinho.',
      criada_em: '2024-06-10',
    },
    {
      id: 2,
      cliente: { nome: 'Carlos Costa', avatar: 'C' },
      servico: 'Conserto de Vazamentos',
      estrelas: 5,
      comentario: 'Muito bom, recomendo demais.',
      criada_em: '2024-05-28',
    },
    {
      id: 3,
      cliente: { nome: 'Ana Oliveira', avatar: 'A' },
      servico: 'Desentupimento',
      estrelas: 4,
      comentario: 'Bom atendimento e trabalho bem feito.',
      criada_em: '2024-05-15',
    },
  ],
};

export default function PerfiltadorPage({ params }: { params: { id: string } }) {
  const { isLoggedIn, user } = useAuth();
  const [abaSelecionada, setAbaSelecionada] = useState<'servicos' | 'avaliacoes'>('servicos');

  return (
    <div className="min-h-[calc(100vh-64px-200px)] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center text-5xl font-semibold text-brand-700">
                {mockPrestador.avatar}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{mockPrestador.nome}</h1>
                  {mockPrestador.verificado && (
                    <span className="inline-block mt-2 badge badge-success">✓ Perfil Verificado</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Rating */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avaliação</p>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-900">{mockPrestador.avaliacao}</span>
                    <span className="text-yellow-400">⭐</span>
                  </div>
                  <p className="text-xs text-gray-500">({mockPrestador.total_avaliacoes} avaliações)</p>
                </div>

                {/* Experiência */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Experiência</p>
                  <p className="font-bold text-gray-900">{mockPrestador.experiencia_anos} anos</p>
                </div>

                {/* Localização */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Localização</p>
                  <p className="font-bold text-gray-900">{mockPrestador.cidade}, {mockPrestador.estado}</p>
                </div>

                {/* Serviços */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Serviços</p>
                  <p className="font-bold text-gray-900">{mockPrestador.servicos.length}</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-700 mb-6">{mockPrestador.bio}</p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                {isLoggedIn && user?.tipo === 'cliente' ? (
                  <>
                    <Link href={`/solicitacoes/nova?prestador=${mockPrestador.id}`} className="btn-primary">
                      Solicitar Orçamento
                    </Link>
                    <button className="btn-secondary gap-2">
                      <MessageCircle size={18} />
                      Chamar no WhatsApp
                    </button>
                  </>
                ) : (
                  <Link href="/auth/registrar" className="btn-primary">
                    Solicitar Orçamento
                  </Link>
                )}
                <button className="btn-secondary gap-2">
                  <Share2 size={18} />
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-8">
          <button
            onClick={() => setAbaSelecionada('servicos')}
            className={`pb-4 px-4 font-medium transition-colors ${
              abaSelecionada === 'servicos'
                ? 'border-b-2 border-brand-600 text-brand-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Serviços ({mockPrestador.servicos.length})
          </button>
          <button
            onClick={() => setAbaSelecionada('avaliacoes')}
            className={`pb-4 px-4 font-medium transition-colors ${
              abaSelecionada === 'avaliacoes'
                ? 'border-b-2 border-brand-600 text-brand-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Avaliações ({mockPrestador.avaliacoes.length})
          </button>
        </div>

        {/* Serviços */}
        {abaSelecionada === 'servicos' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Serviços Oferecidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPrestador.servicos.map(servico => (
                <Link
                  key={servico.id}
                  href={`/servicos/${servico.id}`}
                  className="card hover:shadow-lg transition-shadow group"
                >
                  <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-50 rounded-lg mb-4 flex items-center justify-center group-hover:from-brand-200 transition-colors">
                    📦
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-600">
                    {servico.titulo}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-900">{servico.avaliacao}</span>
                    <span className="text-xs text-gray-500">({servico.total_avaliacoes})</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-lg font-bold text-brand-600">
                      R$ {servico.preco_minimo.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-sm text-gray-600 ml-2">
                      a R$ {servico.preco_maximo.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-brand-600">Ver detalhes →</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Avaliações */}
        {abaSelecionada === 'avaliacoes' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Avaliações dos Clientes</h2>
            <div className="space-y-4">
              {mockPrestador.avaliacoes.map(avaliacao => (
                <div key={avaliacao.id} className="card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-brand-700">
                      {avaliacao.cliente.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{avaliacao.cliente.nome}</p>
                          <p className="text-sm text-gray-600">{avaliacao.servico}</p>
                        </div>
                        <span className="text-xs text-gray-500">{avaliacao.criada_em}</span>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < avaliacao.estrelas ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>

                      <p className="text-gray-700">{avaliacao.comentario}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Info Card */}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <Phone className="text-brand-600 flex-shrink-0" size={24} />
              <div>
                <p className="text-sm text-gray-600 mb-1">Telefone</p>
                <p className="font-semibold text-gray-900">{mockPrestador.telefone}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="text-brand-600 flex-shrink-0" size={24} />
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-semibold text-gray-900">{mockPrestador.email}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="text-brand-600 flex-shrink-0" size={24} />
              <div>
                <p className="text-sm text-gray-600 mb-1">Localização</p>
                <p className="font-semibold text-gray-900">{mockPrestador.cidade}, {mockPrestador.estado}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
