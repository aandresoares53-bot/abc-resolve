'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type') || 'provider';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isProvider = type === 'provider';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type }),
      });
      const data = await response.json() as { error?: string; token?: string; user?: unknown };
      if (!response.ok) { setError(data.error || 'Erro ao fazer login'); return; }
      localStorage.setItem('token', data.token ?? '');
      localStorage.setItem('userType', type);
      localStorage.setItem('userData', JSON.stringify(data.user));
      router.push(isProvider ? '/dashboard' : '/search');
    } catch {
      setError('Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  const accent = isProvider ? 'green' : 'blue';
  const gradientFrom = isProvider ? 'from-green-600' : 'from-blue-700';
  const gradientTo = isProvider ? 'to-emerald-700' : 'to-indigo-700';
  const btnBg = isProvider ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700';
  const linkColor = isProvider ? 'text-green-600 hover:text-green-700' : 'text-blue-600 hover:text-blue-700';
  const ringColor = isProvider ? 'focus:ring-green-500' : 'focus:ring-blue-500';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ABCResolve</span>
          </Link>
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm font-medium transition">
            ← Voltar
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left panel */}
        <div className={`hidden lg:flex flex-col justify-center items-center bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white w-1/2 p-12`}>
          <div className="text-7xl mb-6">{isProvider ? '💼' : '🔍'}</div>
          <h2 className="text-3xl font-bold mb-4 text-center">
            {isProvider ? 'Bem-vindo, Profissional!' : 'Encontre o melhor profissional'}
          </h2>
          <p className="text-lg opacity-80 text-center max-w-sm">
            {isProvider
              ? 'Gerencie seus serviços, acompanhe clientes e aumente sua renda na região do ABC.'
              : 'Acesse sua conta e encontre os melhores prestadores de serviços da sua região.'}
          </p>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full mb-6 ${isProvider ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                <span>{isProvider ? '💼' : '👤'}</span>
                {isProvider ? 'Prestador de Serviços' : 'Consumidor'}
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-1">Fazer Login</h1>
              <p className="text-gray-500 text-sm mb-6">
                {isProvider ? 'Acesse sua conta profissional' : 'Acesse para contratar serviços'}
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    id="email" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} required
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 ${ringColor} focus:border-transparent outline-none text-sm transition`}
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Senha
                  </label>
                  <input
                    id="password" type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)} required
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 ${ringColor} focus:border-transparent outline-none text-sm transition`}
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit" disabled={loading}
                  className={`w-full ${btnBg} text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 mt-2 text-sm shadow-md`}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>

              <p className="text-center text-gray-500 text-sm mt-6">
                Não tem conta?{' '}
                <Link href={`/register?type=${type}`} className={`${linkColor} font-semibold`}>
                  Criar conta grátis
                </Link>
              </p>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              Quer acessar como {isProvider ? 'consumidor' : 'prestador'}?{' '}
              <Link href={`/login?type=${isProvider ? 'consumer' : 'provider'}`} className="text-gray-500 underline">
                Clique aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>}>
      <LoginContent />
    </Suspense>
  );
}
