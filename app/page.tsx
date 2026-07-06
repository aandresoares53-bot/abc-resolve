'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [userType, setUserType] = useState<'consumer' | 'provider' | null>(null);
  const [service, setService] = useState('');
  const [city, setCity] = useState('');

  const handleSearch = () => {
    router.push('/login?type=consumer');
  };

  if (userType === 'consumer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">ABCResolve</h1>
            <button onClick={() => setUserType(null)} className="text-gray-600 hover:text-gray-900">
              Voltar
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Encontre Prestadores de Serviços
            </h2>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Serviço
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione um serviço...</option>
                    <option value="Encanador">Encanador</option>
                    <option value="Eletricista">Eletricista</option>
                    <option value="Pintor">Pintor</option>
                    <option value="Carpinteiro">Carpinteiro</option>
                    <option value="Jardineiro">Jardineiro</option>
                    <option value="Limpeza">Limpeza</option>
                    <option value="Reparos Gerais">Reparos Gerais</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione uma cidade...</option>
                    <option value="Santo André">Santo André</option>
                    <option value="São Bernardo">São Bernardo do Campo</option>
                    <option value="São Caetano">São Caetano do Sul</option>
                    <option value="Diadema">Diadema</option>
                    <option value="Mauá">Mauá</option>
                    <option value="Ribeirão Pires">Ribeirão Pires</option>
                  </select>
                </div>

                <button
                  onClick={handleSearch}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Buscar Prestadores
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (userType === 'provider') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-600">ABCResolve</h1>
            <button onClick={() => setUserType(null)} className="text-gray-600 hover:text-gray-900">
              Voltar
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Prestador de Serviços</h2>

            <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
              <Link
                href="/login?type=provider"
                className="block w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition text-center"
              >
                Fazer Login
              </Link>
              <Link
                href="/register?type=provider"
                className="block w-full bg-green-100 text-green-600 font-semibold py-3 rounded-lg hover:bg-green-200 transition text-center border-2 border-green-600"
              >
                Criar Conta
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-4">ABCResolve</h1>
          <p className="text-xl text-blue-100 mb-12">
            Conecte-se com prestadores de serviços confiáveis na região do ABC
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <button
              onClick={() => setUserType('consumer')}
              className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition transform hover:scale-105"
            >
              <div className="text-4xl mb-4">👤</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sou Consumidor</h2>
              <p className="text-gray-600 mb-6">
                Encontre e contrate prestadores de serviços confiáveis
              </p>
              <span className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
                Buscar Serviços
              </span>
            </button>

            <button
              onClick={() => setUserType('provider')}
              className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition transform hover:scale-105"
            >
              <div className="text-4xl mb-4">🔧</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sou Prestador</h2>
              <p className="text-gray-600 mb-6">Oferça seus serviços e aumente sua clientela</p>
              <span className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-semibold">
                Entrar/Registrar
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
