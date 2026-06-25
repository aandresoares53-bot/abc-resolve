'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Send, MessageCircle, Star, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const mockStats = {
  perfilVisto: 142,
  solicitacoesRecebidas: 8,
  orcamentosEnviados: 12,
  taxaConversao: 25,
};

const mockServicos = [
  {
    id: 1,
    titulo: 'Encanamento Residencial e Comercial',
    categoria: 'Encanador',
    preco_minimo: 150,
    preco_maximo: 500,
    avaliacao: 4.8,
    total_avaliacoes: 24,
    ativo: true,
  },
  {
    id: 2,
    titulo: 'Conserto de Vazamentos',
    categoria: 'Encanador',
    preco_minimo: 100,
    preco_maximo: 300,
    avaliacao: 4.9,
    total_avaliacoes: 18,
    ativo: true,
  },
  {
    id: 3,
    titulo: 'Desentupimento Profissional',
    categoria: 'Encanador',
    preco_minimo: 80,
    preco_maximo: 250,
    avaliacao: 4.7,
    total_avaliacoes: 15,
    ativo: false,
  },
];

const mockSolicitacoes = [
  {
    id: 1,
    titulo: 'Conserto de vazamento no banheiro',
    cliente: { nome: 'Maria Santos', avatar: 'M' },
    categoria: 'Encanador',
    criada_em: '2024-06-20',
    status: 'nova' as const,
  },
  {
    id: 2,
    titulo: 'Desentupimento de pia',
    cliente: { nome: 'Carlos Costa', avatar: 'C' },
    categoria: 'Encanador',
    criada_em: '2024-06-19',
    status: 'respondida' as const,
  },
];

const mockOrcamentos = [
  {
    id: 1,
    solicitacao: { titulo: 'Encanamento', id: 1 },
    cliente: { nome: 'João Silva', avatar: 'J' },
    valor: 250,
    status: 'pendente' as const,
    criado_em: '2024-06-20',
  },
  {
    id: 2,
    solicitacao: { titulo: 'Vazamento', id: 2 },
    cliente: { nome: 'Ana Oliveira', avatar: 'A' },
    valor: 180,
    status: 'aceito' as const,
    criado_em: '2024-06-18',
  },
];

export default function DashboardPrestadorPage() {
  const { isLoggedIn, user } = useAuth();
  const [abaSelecionada, setAbaSelecionada] = useState<'servicos' | 'solicitacoes' | 'orcamentos' | 'avaliacoes'>('servicos');

  // Proteção de rota
  if (!isLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h1>
          <p className="text-gray-600 mb-6">Você precisa estar logado como prestador.</p>
          <Link href="/auth/login" className="btn-primary w-full justify-center">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  if (user?.tipo !== 'prestador') {
    return (
      <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Apenas para Prestadores</h1>
          <p className="text-gray-600 mb-6">Você está logado como cliente.</p>
          <Link href="/" className="btn-primary w-full justify-center">
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px-200px)] bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Gerencie seus serviços e solicitações</p>
          </div>
          <Link href="/conta/editar" className="btn-secondary">
            Editar Perfil
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Perfil Visto</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.perfilVisto}</p>
              </div>
              <Eye className="text-brand-600" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Este mês</p>
          </div>

          <div className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Solicitações</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.solicitacoesRecebidas}</p>
              </div>
              <MessageCircle className="text-brand-600" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Novas para responder</p>
          </div>

          <div className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Orçamentos</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.orcamentosEnviados}</p>
              </div>
              <Send className="text-brand-600" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Enviados este mês</p>
          </div>

          <div className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Taxa Conversão</p>
                <p className="text-3xl font-bold text-gray-900">{mockStats.taxaConversao}%</p>
              </div>
              <Star className="text-brand-600" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Orçamentos aceitos</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4 overflow-x-auto">
            {(['servicos', 'solicitacoes', 'orcamentos', 'avaliacoes'] as const).map(aba => (
              <button
                key={aba}
                onClick={() => setAbaSelecionada(aba)}
                className={`pb-4 px-4 font-medium transition-colors whitespace-nowrap ${
                  abaSelecionada === aba
                    ? 'border-b-2 border-brand-600 text-brand-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {aba === 'servicos' && 'Meus Serviços'}
                {aba === 'solicitacoes' && 'Solicitações'}
                {aba === 'orcamentos' && 'Orçamentos'}
                {aba === 'avaliacoes' && 'Avaliações'}
              </button>
            ))}
          </div>
        </div>

        {/* Serviços */}
        {abaSelecionada === 'servicos' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Meus Serviços ({mockServicos.length})
              </h2>
              <Link href="/servicos/novo" className="btn-primary">
                + Novo Serviço
              </Link>
            </div>

            <div className="space-y-3">
              {mockServicos.map(servico => (
                <div key={servico.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{servico.titulo}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          servico.ativo
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {servico.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <div className="flex gap-6 text-sm">
                        <span className="text-gray-600">R$ {servico.preco_minimo.toLocaleString('pt-BR')} - R$ {servico.preco_maximo.toLocaleString('pt-BR')}</span>
                        <span className="text-gray-600">⭐ {servico.avaliacao} ({servico.total_avaliacoes})</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link href={`/servicos/editar/${servico.id}`} className="btn-secondary btn-sm">
                        Editar
                      </Link>
                      <button className="btn-danger btn-sm">
                        Deletar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Solicitações */}
        {abaSelecionada === 'solicitacoes' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Solicitações Recebidas ({mockSolicitacoes.length})
            </h2>

            <div className="space-y-4">
              {mockSolicitacoes.map(sol => (
                <div key={sol.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{sol.titulo}</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
                          {sol.cliente.avatar}
                        </div>
                        <span className="text-sm text-gray-600">{sol.cliente.nome}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      sol.status === 'nova'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {sol.status === 'nova' ? 'Nova' : 'Respondida'}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-sm text-gray-600">{sol.categoria}</span>
                    <span className="text-sm text-gray-600">{sol.criada_em}</span>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Link href={`/solicitacoes/${sol.id}`} className="btn-primary flex-1 justify-center">
                      + Enviar Orçamento
                    </Link>
                    <button className="btn-secondary flex-1">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orçamentos */}
        {abaSelecionada === 'orcamentos' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Orçamentos Enviados ({mockOrcamentos.length})
            </h2>

            <div className="space-y-4">
              {mockOrcamentos.map(orc => (
                <div key={orc.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{orc.solicitacao.titulo}</h3>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700">
                          {orc.cliente.avatar}
                        </div>
                        <span className="text-sm text-gray-600">{orc.cliente.nome}</span>
                      </div>
                      <p className="text-sm text-gray-600">{orc.criado_em}</p>
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-brand-600 mb-2">
                        R$ {orc.valor.toLocaleString('pt-BR')}
                      </p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                        orc.status === 'pendente'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {orc.status === 'pendente' ? 'Pendente' : 'Aceito'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Avaliações */}
        {abaSelecionada === 'avaliacoes' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Minhas Avaliações</h2>
            <div className="card text-center py-12">
              <Star size={48} className="mx-auto text-brand-100 mb-4" />
              <p className="text-gray-600">
                As avaliações dos seus clientes aparecerão aqui
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
