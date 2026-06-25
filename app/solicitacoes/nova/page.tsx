'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { CATEGORIAS_DEFAULT } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';

function NovaSolicitacaoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, user } = useAuth();

  const [formData, setFormData] = useState({
    categoria: searchParams.get('categoria') || '',
    titulo: '',
    descricao: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
            Faça login como cliente para postar uma solicitação de orçamento.
          </p>
          <Link href="/auth/login" className="btn-primary w-full justify-center mb-3">
            Fazer Login
          </Link>
          <Link href="/auth/registrar" className="btn-secondary w-full justify-center">
            Criar Conta
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
            Apenas clientes podem postar solicitações
          </h1>
          <p className="text-gray-600 mb-6">
            Você está logado como prestador. Para postar uma solicitação, faça login como cliente.
          </p>
          <Link href="/" className="btn-primary w-full justify-center">
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.categoria || !formData.titulo || !formData.descricao) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (formData.titulo.length < 10) {
      setError('O título deve ter pelo menos 10 caracteres');
      return;
    }

    if (formData.descricao.length < 20) {
      setError('A descrição deve ter pelo menos 20 caracteres');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/solicitacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Erro ao criar solicitação');
        return;
      }

      // Redirecionar para página de confirmação ou minhas solicitações
      router.push('/solicitacoes');
    } catch (err) {
      setError('Erro ao conectar ao servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px-200px)] bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/categorias" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-4">
            <ArrowLeft size={18} />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Postar Nova Solicitação
          </h1>
          <p className="text-gray-600">
            Descreva o serviço que você precisa e receba orçamentos de prestadores qualificados.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-6">
          {error && (
            <div className="flex gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Categoria */}
          <div>
            <label htmlFor="categoria" className="label label-required">
              Qual tipo de serviço você precisa?
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="input-base w-full mt-1"
              required
            >
              <option value="">Selecione uma categoria</option>
              {CATEGORIAS_DEFAULT.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Escolha a categoria mais relacionada ao seu serviço para receber orçamentos mais relevantes.
            </p>
          </div>

          {/* Título */}
          <div>
            <label htmlFor="titulo" className="label label-required">
              Título da Solicitação
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ex: Preciso consertar vazamento no banheiro"
              className="input-base w-full mt-1"
              required
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.titulo.length}/100 caracteres
            </p>
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="descricao" className="label label-required">
              Descrição Detalhada
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva em detalhes o que você precisa. Quanto mais informações, melhores orçamentos você receberá."
              className="input-base w-full mt-1 min-h-40"
              required
              maxLength={2000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.descricao.length}/2000 caracteres
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Dica:</strong> Forneça o máximo de detalhes possível sobre o trabalho. Isso ajudará os prestadores a enviar orçamentos mais precisos e realistas.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Postando...' : 'Postar Solicitação'}
            </button>
            <Link href="/categorias" className="btn-secondary flex-1 text-center">
              Cancelar
            </Link>
          </div>

          <p className="text-xs text-gray-600 text-center">
            Ao postar uma solicitação, você concorda com nossos Termos de Uso e Política de Privacidade.
          </p>
        </form>

        {/* Steps */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-lg font-bold text-brand-600 mx-auto mb-3">
              1
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Descreva o Serviço</h3>
            <p className="text-sm text-gray-600">
              Preencha os detalhes do serviço que você precisa
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-lg font-bold text-brand-600 mx-auto mb-3">
              2
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Receba Orçamentos</h3>
            <p className="text-sm text-gray-600">
              Prestadores qualificados responderão com propostas
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-lg font-bold text-brand-600 mx-auto mb-3">
              3
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Escolha o Melhor</h3>
            <p className="text-sm text-gray-600">
              Compare e contrate o prestador ideal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NovaSolicitacaoPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center">Carregando...</div>}>
      <NovaSolicitacaoContent />
    </Suspense>
  );
}
