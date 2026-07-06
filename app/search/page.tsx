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

export default function SearchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ service: '', city: '' });
  const [providers] = useState<Provider[]>(MOCK_PROVIDERS);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>(MOCK_PROVIDERS);

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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
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
                      <button
                        onClick={() => alert('Funcionalidade de mensagens em breve!')}
                        className="w-full bg-gray-200 text-gray-900 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
                      >
                        Enviar Mensagem
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
