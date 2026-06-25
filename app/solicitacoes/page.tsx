'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const mockSolicitacoes = [
  {
    id: 1,
    titulo: 'Conserto de vazamento no banheiro',
    categoria: 'Encanador',
    status: 'aberta' as const,
    orcamentos_count: 3,
    criada_em: '2024-06-20',
    descricao: 'Preciso consertar um vazamento na torneira do banheiro.',
  },
  {
    id: 2,
    titulo: 'Pintura de sala de estar',
    categoria: 'Pintor',
    status: 'aberta' as const,
    orcamentos_count: 2,
    criada_em: '2024-06-18',
    descricao: 'Quero pintar minha sala com cores modernas.',
  },
  {
    id: 3,
    titulo: 'Instalação de luminárias',
    categoria: 'Eletricista',
    status: 'contratada' as const,
    orcamentos_count: 4,
    criada_em: '2024-06-10',
    descricao: 'Preciso instalar 5 luminárias novas.',
  },
];

export default function MinhasSolicitacoesPage() {
  const { isLoggedIn, user } = useAuth();
  const [abaSelecionada, setAbaSelecionada] = useState<'abertas' | 'encerradas'>('abertas');

  // Redirecionar se não estiver logado como cliente
  if (!isLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Você precisa estar logado
          </h1>
          <p className="text-gray-600 mb-6">
            Faça login para ver suas solicitações.
          </p>
          <Link href="/auth/login" className="btn-primary w-full justify-center">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  if (user?.tipo !== 'cliente') {
    return (
      <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Esta página é apenas para clientes
          </h1>
          <p className="text-gray-600 mb-6">
            Você está logado como prestador. Visite seu dashboard.
          </p>
          <Link href="/prestadores/dashboard" className="btn-primary w-full justify-center">
            Ir para Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const abertas = mockSolicitacoes.filter(s => s.status === 'aberta');
  const encerradas = mockSolicitacoes.filter(s => s.status !== 'aberta');
  const exibicao = abaSelecionada === 'abertas' ? abertas : encerradas;

  return (
    <div className="min-h-[calc(100vh-64px-200px)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Minhas Solicitações
            </h1>
            <p className="text-gray-600">
              Acompanhe suas solicitações de orçamento e os prestadores respondendo
            </p>
          </div>
          <Link href="/solicitacoes/nova" className="btn-primary">
            + Nova Solicitação
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setAbaSelecionada('abertas')}
              className={`pb-4 px-4 font-medium transition-colors ${
                abaSelecionada === 'abertas'
                  ? 'border-b-2 border-brand-600 text-brand-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Abertas ({abertas.length})
            </button>
            <button
              onClick={() => setAbaSelecionada('encerradas')}
              className={`pb-4 px-4 font-medium transition-colors ${
                abaSelecionada === 'encerradas'
                  ? 'border-b-2 border-brand-600 text-brand-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Encerradas ({encerradas.length})
            </button>
          </div>
        </div>

        {/* Solicitações */}
        {exibicao.length > 0 ? (
          <div className="space-y-4">
            {exibicao.map(solicitacao => (
              <Link
                key={solicitacao.id}
                href={`/solicitacoes/${solicitacao.id}`}
                className="card hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 mb-1">
                      {solicitacao.titulo}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {solicitacao.descricao}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      solicitacao.status === 'aberta'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {solicitacao.status === 'aberta' ? 'Aberta' : 'Contratada'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Categoria</p>
                      <span className="badge badge-primary">{solicitacao.categoria}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Data</p>
                      <p className="font-medium text-gray-900">{solicitacao.criada_em}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Orçamentos</p>
                      <p className="font-bold text-brand-600">{solicitacao.orcamentos_count}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageCircle size={18} className="text-gray-400" />
                    <span className="text-sm text-brand-600 font-medium">
                      Ver detalhes →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {abaSelecionada === 'abertas'
                ? 'Você não tem solicitações abertas'
                : 'Você não tem solicitações encerradas'}
            </h3>
            <p className="text-gray-600 mb-6">
              {abaSelecionada === 'abertas'
                ? 'Crie uma nova solicitação para receber orçamentos de prestadores qualificados'
                : 'Suas solicitações encerradas aparecerão aqui'}
            </p>
            {abaSelecionada === 'abertas' && (
              <Link href="/solicitacoes/nova" className="btn-primary inline-block">
                + Criar Solicitação
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
