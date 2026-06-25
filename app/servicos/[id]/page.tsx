'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock, Award, MessageCircle, Share2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const mockServico = {
  id: 1,
  titulo: 'Encanamento Residencial e Comercial',
  prestador: {
    id: 1,
    nome: 'João Silva',
    avatar: 'J',
    cidade: 'São Paulo',
    verificado: true,
    bio: 'Encanador profissional com 5 anos de experiência em trabalhos residenciais e comerciais.',
    experiencia_anos: 5,
    avaliacao: 4.8,
    total_avaliacoes: 24,
  },
  categoria: 'Encanador',
  descricao: `Ofereço serviços completos de encanamento para residências e pequenos comercios. Incluindo:

- Conserto de vazamentos
- Desentupimento
- Instalação de canos
- Manutenção preventiva
- Substituição de peças

Trabalho com agilidade e qualidade garantida. Atendo em São Paulo e região.`,
  preco_minimo: 150,
  preco_maximo: 500,
  tempo_medio_dias: 1,
  imagens: [
    { id: 1, url: '/placeholder-1.jpg' },
    { id: 2, url: '/placeholder-2.jpg' },
    { id: 3, url: '/placeholder-3.jpg' },
  ],
  avaliacoes: [
    {
      id: 1,
      cliente: { nome: 'Maria Santos', avatar: 'M' },
      estrelas: 5,
      comentario: 'Excelente profissional! Resolveu meu problema rapidinho e cobrou um preço justo.',
      criada_em: '2024-06-10',
    },
    {
      id: 2,
      cliente: { nome: 'Carlos Costa', avatar: 'C' },
      estrelas: 5,
      comentario: 'Muito bom, recomendo demais. Voltarei com certeza em futuros trabalhos.',
      criada_em: '2024-05-28',
    },
    {
      id: 3,
      cliente: { nome: 'Ana Oliveira', avatar: 'A' },
      estrelas: 4,
      comentario: 'Bom atendimento, chegou no horário e trabalho bem feito.',
      criada_em: '2024-05-15',
    },
  ],
};

export default function DetalhesServicoPage({ params }: { params: { id: string } }) {
  const { isLoggedIn, user } = useAuth();
  const [imagemSelecionada, setImagemSelecionada] = useState(0);

  return (
    <div className="min-h-[calc(100vh-64px-200px)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images and Info */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="mb-6">
              <div className="w-full aspect-video bg-gradient-to-br from-brand-100 to-brand-50 rounded-lg flex items-center justify-center text-6xl mb-4">
                📸
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2">
                {mockServico.imagens.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setImagemSelecionada(idx)}
                    className={`w-20 h-20 rounded-lg flex items-center justify-center text-3xl border-2 transition-colors ${
                      imagemSelecionada === idx
                        ? 'border-brand-600 bg-brand-50'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    📷
                  </button>
                ))}
              </div>
            </div>

            {/* Service Info */}
            <div className="card mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {mockServico.titulo}
              </h1>

              {/* Category Badge */}
              <div className="mb-4">
                <span className="badge badge-primary">{mockServico.categoria}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < Math.floor(mockServico.prestador.avaliacao) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900 ml-2">
                    {mockServico.prestador.avaliacao}
                  </span>
                  <span className="text-sm text-gray-600">
                    ({mockServico.prestador.total_avaliacoes} avaliações)
                  </span>
                </div>
              </div>

              {/* Description */}
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Sobre o serviço</h2>
              <div className="text-gray-700 whitespace-pre-wrap mb-6">
                {mockServico.descricao}
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-6 rounded-lg">
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <Clock size={24} className="text-brand-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Tempo médio</p>
                    <p className="font-semibold text-gray-900">{mockServico.tempo_medio_dias} dia</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <Award size={24} className="text-brand-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Experiência</p>
                    <p className="font-semibold text-gray-900">{mockServico.prestador.experiencia_anos} anos</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <MapPin size={24} className="text-brand-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Localização</p>
                    <p className="font-semibold text-gray-900">{mockServico.prestador.cidade}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Avaliações */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Avaliações ({mockServico.avaliacoes.length})</h2>
              <div className="space-y-4">
                {mockServico.avaliacoes.map(avaliacao => (
                  <div key={avaliacao.id} className="pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-brand-700">
                        {avaliacao.cliente.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">{avaliacao.cliente.nome}</p>
                          <span className="text-xs text-gray-500">{avaliacao.criada_em}</span>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < avaliacao.estrelas ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-700">{avaliacao.comentario}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Prestador Card & CTA */}
          <div>
            {/* Prestador Card */}
            <div className="card mb-6 sticky top-20">
              {/* Avatar */}
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-3xl font-semibold text-brand-700 mx-auto mb-3">
                  {mockServico.prestador.avatar}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{mockServico.prestador.nome}</h3>
                {mockServico.prestador.verificado && (
                  <div className="inline-block mt-1">
                    <span className="badge badge-success">✓ Verificado</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-3 border-t border-b border-gray-200 py-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avaliação</span>
                  <span className="font-semibold text-gray-900">{mockServico.prestador.avaliacao} ⭐</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Experiência</span>
                  <span className="font-semibold text-gray-900">{mockServico.prestador.experiencia_anos} anos</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Localidade</span>
                  <span className="font-semibold text-gray-900">{mockServico.prestador.cidade}</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-700 mb-6">{mockServico.prestador.bio}</p>

              {/* Preço */}
              <div className="bg-brand-50 rounded-lg p-4 mb-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Valor estimado</p>
                <p className="text-2xl font-bold text-brand-600">
                  R$ {mockServico.preco_minimo.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  a R$ {mockServico.preco_maximo.toLocaleString('pt-BR')}
                </p>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                {isLoggedIn && user?.tipo === 'cliente' ? (
                  <>
                    <Link
                      href={`/solicitacoes/nova?servico=${mockServico.id}`}
                      className="btn-primary w-full justify-center"
                    >
                      Solicitar Orçamento
                    </Link>
                    <button className="btn-secondary w-full justify-center gap-2">
                      <MessageCircle size={18} />
                      Chamar no WhatsApp
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/registrar" className="btn-primary w-full justify-center">
                      Solicitar Orçamento
                    </Link>
                    <p className="text-xs text-gray-600 text-center">
                      Faça login para solicitar orçamentos
                    </p>
                  </>
                )}
                <button className="btn-secondary w-full justify-center gap-2">
                  <Share2 size={18} />
                  Compartilhar
                </button>
              </div>

              {/* Ver Perfil */}
              <Link
                href={`/prestadores/${mockServico.prestador.id}`}
                className="block text-center text-sm text-brand-600 font-medium hover:text-brand-700 mt-4 py-2"
              >
                Ver perfil completo →
              </Link>
            </div>
          </div>
        </div>

        {/* Related Services */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Outros serviços deste prestador</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Link key={i} href="#" className="card hover:shadow-lg transition-shadow group">
                <div className="h-32 bg-gradient-to-br from-brand-100 to-brand-50 rounded-lg mb-4 flex items-center justify-center group-hover:from-brand-200 transition-colors">
                  📦
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-600">
                  Serviço {i}
                </h3>
                <p className="text-sm text-gray-600 mb-3">R$ 200 - R$ 800</p>
                <span className="text-xs font-medium text-brand-600">Ver detalhes →</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
