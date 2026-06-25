'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function AvaliacaoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();

  const [formData, setFormData] = useState({
    estrelas: 5,
    comentario: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Proteção de rota
  if (!isLoggedIn || user?.tipo !== 'cliente') {
    return (
      <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Apenas Clientes</h1>
          <p className="text-gray-600 mb-6">Faça login como cliente para avaliar um serviço.</p>
          <Link href="/auth/login" className="btn-primary w-full justify-center">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.comentario.length < 10) {
      setError('O comentário deve ter pelo menos 10 caracteres');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/avaliacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          servico_id: params.id,
          estrelas: formData.estrelas,
          comentario: formData.comentario,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Erro ao enviar avaliação');
        return;
      }

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
          <Link href="/solicitacoes" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-4">
            <ArrowLeft size={18} />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Avaliar Serviço
          </h1>
          <p className="text-gray-600">
            Compartilhe sua experiência para ajudar outros clientes
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

          {/* Serviço Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Avaliando</p>
            <h3 className="font-semibold text-gray-900">
              Encanamento Residencial e Comercial
            </h3>
            <p className="text-sm text-gray-600 mt-1">Por João Silva</p>
          </div>

          {/* Stars */}
          <div>
            <label className="label label-required mb-4">Qual sua avaliação?</label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, estrelas: star }))}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={40}
                    className={star <= formData.estrelas ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {formData.estrelas === 5 && 'Excelente! 🌟'}
              {formData.estrelas === 4 && 'Muito bom!'}
              {formData.estrelas === 3 && 'Bom'}
              {formData.estrelas === 2 && 'Pode melhorar'}
              {formData.estrelas === 1 && 'Ruim'}
            </p>
          </div>

          {/* Comentário */}
          <div>
            <label htmlFor="comentario" className="label label-required">
              Conte sua experiência
            </label>
            <textarea
              id="comentario"
              value={formData.comentario}
              onChange={(e) => setFormData(prev => ({ ...prev, comentario: e.target.value }))}
              placeholder="Como foi sua experiência com este prestador? Seja honesto e construtivo..."
              className="input-base w-full mt-1 min-h-40"
              required
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.comentario.length}/500 caracteres
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Dica:</strong> Avaliações honestas e construtivas ajudam a melhorar a qualidade dos serviços da plataforma.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Enviando...' : 'Enviar Avaliação'}
            </button>
            <Link href="/solicitacoes" className="btn-secondary flex-1 text-center">
              Cancelar
            </Link>
          </div>

          <p className="text-xs text-gray-600 text-center">
            Sua avaliação será publicada após moderação
          </p>
        </form>
      </div>
    </div>
  );
}
