'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { CATEGORIAS_DEFAULT } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';

export default function NovoServicoPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();

  const [formData, setFormData] = useState({
    categoria: '',
    titulo: '',
    descricao: '',
    preco_minimo: '',
    preco_maximo: '',
    tempo_medio_dias: '',
    experiencia_anos: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Proteção de rota
  if (!isLoggedIn || user?.tipo !== 'prestador') {
    return (
      <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Apenas para Prestadores</h1>
          <p className="text-gray-600 mb-6">Faça login como prestador para criar serviços.</p>
          <Link href="/auth/login" className="btn-primary w-full justify-center">
            Fazer Login
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
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    if (Number(formData.preco_minimo) >= Number(formData.preco_maximo)) {
      setError('Preço mínimo deve ser menor que máximo');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/servicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Erro ao criar serviço');
        return;
      }

      router.push('/prestadores/dashboard');
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
          <Link href="/prestadores/dashboard" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-4">
            <ArrowLeft size={18} />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Criar Novo Serviço
          </h1>
          <p className="text-gray-600">
            Descreva o serviço que você oferece para atrair mais clientes
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
              Categoria de Serviço
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
          </div>

          {/* Título */}
          <div>
            <label htmlFor="titulo" className="label label-required">
              Título do Serviço
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ex: Encanamento Residencial e Comercial"
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
              Descrição do Serviço
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva detalhadamente o serviço que você oferece, incluindo o que está incluído e garantias."
              className="input-base w-full mt-1 min-h-32"
              required
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.descricao.length}/1000 caracteres
            </p>
          </div>

          {/* Preços */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="preco_minimo" className="label label-required">
                Preço Mínimo (R$)
              </label>
              <input
                type="number"
                id="preco_minimo"
                name="preco_minimo"
                value={formData.preco_minimo}
                onChange={handleChange}
                placeholder="150"
                className="input-base w-full mt-1"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="preco_maximo" className="label label-required">
                Preço Máximo (R$)
              </label>
              <input
                type="number"
                id="preco_maximo"
                name="preco_maximo"
                value={formData.preco_maximo}
                onChange={handleChange}
                placeholder="500"
                className="input-base w-full mt-1"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Tempo e Experiência */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tempo_medio_dias" className="label">
                Tempo Médio (dias)
              </label>
              <input
                type="number"
                id="tempo_medio_dias"
                name="tempo_medio_dias"
                value={formData.tempo_medio_dias}
                onChange={handleChange}
                placeholder="1"
                className="input-base w-full mt-1"
                min="0"
                step="1"
              />
            </div>
            <div>
              <label htmlFor="experiencia_anos" className="label">
                Anos de Experiência
              </label>
              <input
                type="number"
                id="experiencia_anos"
                name="experiencia_anos"
                value={formData.experiencia_anos}
                onChange={handleChange}
                placeholder="5"
                className="input-base w-full mt-1"
                min="0"
                step="1"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Dica:</strong> Quanto mais detalhado for seu serviço, mais clientes interessados receberá. Inclua informações sobre garantia, materiais e tempo de atendimento.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Criando...' : 'Criar Serviço'}
            </button>
            <Link href="/prestadores/dashboard" className="btn-secondary flex-1 text-center">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
