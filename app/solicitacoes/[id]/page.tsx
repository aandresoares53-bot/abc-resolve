'use client';

import Link from 'next/link';
import { ArrowLeft, Star, MessageCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const mockSolicitacao = {
  id: 1,
  titulo: 'Conserto de vazamento no banheiro',
  categoria: 'Encanador',
  status: 'aberta' as const,
  descricao: `Tenho um vazamento na torneira do banheiro que está pingando constantemente.

Localização: São Paulo - SP
Urgência: Média (gostaria que fosse reparado nesta semana)
Orçamento aproximado: Não tenho ideia

Detalhes adicionais:
- A torneira já tem 5 anos
- Há vazamento no cano também
- Preciso de um profissional confiável`,
  criada_em: '2024-06-20',
};

const mockOrcamentos = [
  {
    id: 1,
    prestador: {
      id: 1,
      nome: 'João Silva',
      avatar: 'J',
      avaliacao: 4.8,
      total_avaliacoes: 24,
      experiencia_anos: 5,
    },
    valor: 250,
    descricao: 'Vou consertar o vazamento e fazer substituição da torneira se necessário. Trabalho garantido por 1 ano.',
    tempo_dias: 1,
    status: 'pendente' as const,
    criado_em: '2024-06-20',
  },
  {
    id: 2,
    prestador: {
      id: 2,
      nome: 'Carlos Santos',
      avatar: 'C',
      avaliacao: 4.9,
      total_avaliacoes: 48,
      experiencia_anos: 8,
    },
    valor: 180,
    descricao: 'Serviço de reparo com garantia. Posso atender amanhã pela manhã ou à tarde.',
    tempo_dias: 1,
    status: 'pendente' as const,
    criado_em: '2024-06-20',
  },
  {
    id: 3,
    prestador: {
      id: 3,
      nome: 'Pedro Oliveira',
      avatar: 'P',
      avaliacao: 4.7,
      total_avaliacoes: 15,
      experiencia_anos: 3,
    },
    valor: 320,
    descricao: 'Substituição completa com peças de qualidade. Garatia de 2 anos.',
    tempo_dias: 2,
    status: 'pendente' as const,
    criado_em: '2024-06-19',
  },
];

export default function DetalheSolicitacaoPage({ params }: { params: { id: string } }) {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn || user?.tipo !== 'cliente') {
    return (
      <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso restrito
          </h1>
          <p className="text-gray-600 mb-6">
            Faça login como cliente para ver os detalhes da solicitação.
          </p>
          <Link href="/auth/login" className="btn-primary w-full justify-center">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px-200px)] bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link href="/solicitacoes" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-6">
          <ArrowLeft size={18} />
          Voltar para solicitações
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Solicitação Details */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              {/* Header */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {mockSolicitacao.titulo}
                    </h1>
                    <span className="badge badge-primary">{mockSolicitacao.categoria}</span>
                  </div>
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                    Aberta
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Postada em {mockSolicitacao.criada_em}
                </p>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Descrição
                </h2>
                <div className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {mockSolicitacao.descricao}
                </div>
              </div>
            </div>

            {/* Orçamentos */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Orçamentos Recebidos ({mockOrcamentos.length})
              </h2>

              <div className="space-y-4">
                {mockOrcamentos.map(orcamento => (
                  <div key={orcamento.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    {/* Cabeçalho */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-brand-700">
                          {orcamento.prestador.avatar}
                        </div>
                        <div>
                          <Link
                            href={`/prestadores/${orcamento.prestador.id}`}
                            className="font-semibold text-gray-900 hover:text-brand-600"
                          >
                            {orcamento.prestador.nome}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < Math.floor(orcamento.prestador.avaliacao) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">
                              {orcamento.prestador.avaliacao} ({orcamento.prestador.total_avaliacoes})
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-brand-600 mb-1">
                          R$ {orcamento.valor.toLocaleString('pt-BR')}
                        </div>
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          Pendente
                        </span>
                      </div>
                    </div>

                    {/* Descrição */}
                    <p className="text-gray-700 mb-4">{orcamento.descricao}</p>

                    {/* Detalhes */}
                    <div className="flex gap-6 mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {orcamento.tempo_dias} dia{orcamento.tempo_dias > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Respondido em</span>
                        <p className="text-sm font-medium text-gray-900">{orcamento.criado_em}</p>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-3">
                      <button className="flex-1 btn-primary gap-2 justify-center">
                        <MessageCircle size={18} />
                        Aceitar Orçamento
                      </button>
                      <button className="flex-1 btn-secondary justify-center">
                        Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {mockOrcamentos.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-3xl mb-3">⏳</div>
                  <p className="text-gray-600">
                    Nenhum orçamento recebido ainda. Os prestadores devem responder em breve!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Resumo */}
          <div>
            <div className="card sticky top-20 space-y-6">
              {/* Status */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-semibold text-gray-900">Aberta</span>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Orçamentos</span>
                  <span className="font-bold text-gray-900">{mockOrcamentos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tempo aberta</span>
                  <span className="font-bold text-gray-900">2 dias</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor médio</span>
                  <span className="font-bold text-gray-900">
                    R$ {Math.round(mockOrcamentos.reduce((a, b) => a + b.valor, 0) / mockOrcamentos.length).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900">
                  <strong>💡 Dica:</strong> Compare os orçamentos considerando valor, experiência e avaliações do prestador.
                </p>
              </div>

              {/* Editar */}
              <button className="btn-secondary w-full">
                Editar Solicitação
              </button>

              {/* Fechar */}
              <button className="btn-danger w-full">
                Fechar Solicitação
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
