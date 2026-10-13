'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Provider {
  id: number;
  name: string;
  service: string;
  city: string;
  rating: number;
  reviews: number;
  phone: string;
}

const MOCK_PROVIDERS: Provider[] = [
  { id: 1, name: 'João Silva', service: 'Eletricista', city: 'Santo André', rating: 4.8, reviews: 24, phone: '(11) 98765-4321' },
  { id: 2, name: 'Maria Santos', service: 'Encanador', city: 'São Bernardo', rating: 4.9, reviews: 31, phone: '(11) 99876-5432' },
  { id: 3, name: 'Pedro Costa', service: 'Pintor', city: 'Diadema', rating: 4.5, reviews: 15, phone: '(11) 97654-3210' },
];

interface RatingModalProps {
  provider: Provider;
  onClose: () => void;
  onSubmit: (providerId: number, rating: number, comment: string) => void;
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
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
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
                <button
                  key={star}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setSelected(star)}
                  className="text-4xl transition-transform hover:scale-110"
                >
                  <span className={(hovered || selected) >= star ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                </button>
              ))}
            </div>

            {selected > 0 && (
              <p className="text-center text-sm font-semibold text-gray-700 mb-4">
                {['', 'Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente!'][selected]}
              </p>
            )}

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte como foi a experiência (opcional)..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={selected === 0}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
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
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ service: '', city: '' });
  const [providers, setProviders] = useState<Provider[]>(MOCK_PROVIDERS);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>(MOCK_PROVIDERS);
  const [ratingTarget, setRatingTarget] = useState<Provider | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?type=consumer');
      return;
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    let filtered = providers;
    if (filters.service) {
      filtered = filtered.filter(
        (p) => p.service.toLowerCase() === filters.service.toLowerCase()
      );
    }
    if (filters.city) {
      filtered = filtered.filter(
        (p) => p.city.toLowerCase() === filters.city.toLowerCase()
      );
    }
    setFilteredProviders(filtered);
  }, [filters, providers]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userData');
    router.push('/');
  };

  const handleRatingSubmit = (providerId: number, rating: number, _comment: string) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id !== providerId) return p;
        const newReviews = p.reviews + 1;
        const newRating = Math.round(((p.rating * p.reviews + rating) / newReviews) * 10) / 10;
        return { ...p, rating: newRating, reviews: newReviews };
      })
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {ratingTarget && (
        <RatingModal
          provider={ratingTarget}
          onClose={() => setRatingTarget(null)}
          onSubmit={handleRatingSubmit}
        />
      )}

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">ABCResolve</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Bem-vindo!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Serviço
              </label>
              <select
                name="service"
                value={filters.service}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os serviços</option>
                <option value="Eletricista">Eletricista</option>
                <option value="Encanador">Encanador</option>
                <option value="Pintor">Pintor</option>
                <option value="Carpinteiro">Carpinteiro</option>
                <option value="Jardineiro">Jardineiro</option>
                <option value="Limpeza">Limpeza</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas as cidades</option>
                <option value="Santo André">Santo André</option>
                <option value="São Bernardo">São Bernardo do Campo</option>
                <option value="São Caetano">São Caetano do Sul</option>
                <option value="Diadema">Diadema</option>
                <option value="Mauá">Mauá</option>
                <option value="Ribeirão Pires">Ribeirão Pires</option>
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
            {filteredProviders.length} prestador(es) encontrado(s)
          </h2>

          {filteredProviders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 text-lg">
                Nenhum prestador encontrado com os filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
                    <p className="text-blue-600 font-semibold mt-1">{provider.service}</p>
                    <p className="text-gray-600 text-sm mt-1">📍 {provider.city}</p>

                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-yellow-400">⭐ {provider.rating}</span>
                      <span className="text-gray-600 text-sm">({provider.reviews} avaliações)</span>
                    </div>

                    <div className="mt-6 space-y-3">
                      <a
                        href={`tel:${provider.phone}`}
                        className="block w-full bg-blue-600 text-white text-center font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        ☎️ {provider.phone}
                      </a>
                      <a
                        href={`https://wa.me/55${provider.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-green-500 text-white text-center font-semibold py-2 rounded-lg hover:bg-green-600 transition"
                      >
                        💬 Enviar Mensagem
                      </a>
                      <button
                        onClick={() => setRatingTarget(provider)}
                        className="w-full bg-yellow-400 text-gray-900 font-semibold py-2 rounded-lg hover:bg-yellow-500 transition"
                      >
                        ⭐ Avaliar Prestador
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
