'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Provider {
  id: string;
  name: string;
  service: string;
  city: string;
  phone: string;
  created_at: string;
}

interface RatingModalProps {
  provider: Provider;
  onClose: () => void;
  onSubmit: (providerId: string, rating: number, comment: string) => void;
}

function RatingModal({ provider, onClose, onSubmit }: RatingModalProps) {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected === 0) return;
    onSubmit(provider.id, selected, comment);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        {submitted ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Avaliação enviada!</h3>
            <p className="text-gray-600 mb-6">Obrigado por avaliar {provider.name}.</p>
            <button onClick={onClose} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Avaliar prestador</h3>
                <p className="text-blue-600 font-semibold">{provider.name} · {provider.service}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="flex justify-center gap-2 my-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}
                  onClick={() => setSelected(star)} className="text-4xl transition-transform hover:scale-110">
                  <span className={(hovered || selected) >= star ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                </button>
              ))}
            </div>
            {selected > 0 && (
              <p className="text-center text-sm font-semibold text-gray-700 mb-4">
                {['', 'Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente!'][selected]}
              </p>
            )}
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder="Conte como foi a experiência (opcional)..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3} />
            <div className="flex gap-3 mt-4">
              <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-semibold">
                Cancelar
              </button>
              <button onClick={handleSubmit} disabled={selected === 0}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
                Enviar avaliação
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [filters, setFilters] = useState({ service: '', city: '' });
  const [providers, setProviders] = useState<Provider[]>([]);
  const [fetching, setFetching] = useState(false);
  const [ratingTarget, setRatingTarget] = useState<Provider | null>(null);
  const [localRatings, setLocalRatings] = useState<Record<string, { rating: number; reviews: number }>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login?type=consumer'); return; }
    setAuthLoading(false);
  }, [router]);

  const fetchProviders = useCallback(async () => {
    setFetching(true);
    try {
      const params = new URLSearchParams();
      if (filters.service) params.set('service', filters.service);
      if (filters.city) params.set('city', filters.city);
      const res = await fetch(`/api/providers?${params.toString()}`);
      const data = await res.json() as { providers?: Provider[] };
      setProviders(data.providers ?? []);
    } catch {
      setProviders([]);
    } finally {
      setFetching(false);
    }
  }, [filters]);

  useEffect(() => {
    if (!authLoading) fetchProviders();
  }, [authLoading, fetchProviders]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    router.push('/');
  };

  const handleRatingSubmit = (providerId: string, rating: number, _comment: string) => {
    setLocalRatings((prev) => {
      const current = prev[providerId] ?? { rating: 0, reviews: 0 };
      const newReviews = current.reviews + 1;
      const baseRating = current.reviews === 0 ? rating : current.rating;
      const newRating = Math.round(((baseRating * current.reviews + rating) / newReviews) * 10) / 10;
      return { ...prev, [providerId]: { rating: newRating, reviews: newReviews } };
    });
  };

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {ratingTarget && (
        <RatingModal provider={ratingTarget} onClose={() => setRatingTarget(null)} onSubmit={handleRatingSubmit} />
      )}

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">ABCResolve</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Bem-vindo!</span>
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filtrar Prestadores</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Serviço</label>
              <select
                value={filters.service}
                onChange={(e) => setFilters((f) => ({ ...f, service: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os serviços</option>
                <option>Eletricista</option>
                <option>Encanador</option>
                <option>Pintor</option>
                <option>Carpinteiro</option>
                <option>Jardineiro</option>
                <option>Limpeza</option>
                <option>Ar Condicionado</option>
                <option>Reparos Gerais</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas as cidades</option>
                <option>Santo André</option>
                <option>São Bernardo do Campo</option>
                <option>São Caetano do Sul</option>
                <option>Diadema</option>
                <option>Mauá</option>
                <option>Ribeirão Pires</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ service: '', city: '' })}
                className="w-full bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {fetching ? 'Buscando...' : `${providers.length} prestador(es) encontrado(s)`}
          </h2>

          {fetching ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : providers.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-600 text-lg font-semibold mb-2">Nenhum prestador encontrado</p>
              <p className="text-gray-400 text-sm">Tente outros filtros ou aguarde novos cadastros.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => {
                const lr = localRatings[provider.id];
                return (
                  <div key={provider.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                          {provider.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">{provider.name}</h3>
                          <p className="text-blue-600 font-semibold text-sm">{provider.service}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">📍 {provider.city}</p>

                      {lr && (
                        <div className="mt-2 flex items-center gap-1">
                          <span className="text-yellow-400 text-sm">⭐ {lr.rating}</span>
                          <span className="text-gray-500 text-xs">({lr.reviews} avaliação{lr.reviews > 1 ? 'ões' : ''})</span>
                        </div>
                      )}

                      <div className="mt-4 space-y-2">
                        <a href={`tel:${provider.phone}`}
                          className="block w-full bg-blue-600 text-white text-center font-semibold py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                          ☎️ {provider.phone}
                        </a>
                        <a href={`https://wa.me/55${provider.phone.replace(/\D/g, '')}`}
                          target="_blank" rel="noopener noreferrer"
                          className="block w-full bg-green-500 text-white text-center font-semibold py-2 rounded-lg hover:bg-green-600 transition text-sm">
                          💬 Enviar Mensagem
                        </a>
                        <button onClick={() => setRatingTarget(provider)}
                          className="w-full bg-yellow-400 text-gray-900 font-semibold py-2 rounded-lg hover:bg-yellow-500 transition text-sm">
                          ⭐ Avaliar Prestador
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
