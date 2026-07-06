'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function RegisterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type') || 'provider';
  const isProvider = type === 'provider';

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', service: '', city: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) { setError('As senhas não correspondem'); return; }
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type }),
      });
      const data = await response.json() as { error?: string; token?: string; user?: unknown };
      if (!response.ok) { setError(data.error || 'Erro ao criar conta'); return; }
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

  const gradientFrom = isProvider ? 'from-green-600' : 'from-blue-700';
  const gradientTo = isProvider ? 'to-emerald-700' : 'to-indigo-700';
  const btnBg = isProvider ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700';
  const linkColor = isProvider ? 'text-green-600 hover:text-green-700' : 'text-blue-600 hover:text-blue-700';
  const ringColor = isProvider ? 'focus:ring-green-500' : 'focus:ring-blue-500';

  const inputCls = `w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 ${ringColor} focus:border-transparent outline-none text-sm transition`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ABCResolve</span>
          </Link>
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm font-medium transition">← Voltar</Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left panel */}
        <div className={`hidden lg:flex flex-col justify-center items-center bg-gradient-to-br ${gradientFrom} ${gradientTo} text-white w-2/5 p-12`}>
          <div className="text-7xl mb-6">{isProvider ? '🚀' : '✨'}</div>
          <h2 className="text-3xl font-bold mb-4 text-center">
            {isProvider ? 'Comece a receber clientes!' : 'Encontre profissionais incríveis!'}
          </h2>
          <ul className="space-y-3 text-left opacity-90">
            {(isProvider ? [
              '✅ Cadastro 100% gratuito',
              '✅ Receba contatos de clientes',
              '✅ Gerencie seu perfil profissional',
              '✅ Atenda em toda a região do ABC',
            ] : [
              '✅ Busque por serviço e cidade',
              '✅ Compare prestadores verificados',
              '✅ Contate diretamente o profissional',
              '✅ Avalie após o serviço',
            ]).map(item => <li key={item} className="text-sm">{item}</li>)}
          </ul>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-start justify-center p-6 py-10 overflow-y-auto">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full mb-6 ${isProvider ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                <span>{isProvider ? '💼' : '👤'}</span>
                {isProvider ? 'Prestador de Serviços' : 'Consumidor'}
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-1">Criar Conta</h1>
              <p className="text-gray-500 text-sm mb-6">
                {isProvider ? 'Cadastre-se e comece a atender clientes' : 'Registre-se para contratar serviços'}
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome Completo</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputCls} placeholder="Seu nome completo" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputCls} placeholder="seu@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={inputCls} placeholder="(11) 99999-9999" />
                </div>

                {isProvider && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Serviço</label>
                      <select name="service" value={formData.service} onChange={handleChange} required className={inputCls}>
                        <option value="">Selecione...</option>
                        <option>Encanador</option>
                        <option>Eletricista</option>
                        <option>Pintor</option>
                        <option>Carpinteiro</option>
                        <option>Jardineiro</option>
                        <option>Limpeza</option>
                        <option>Ar Condicionado</option>
                        <option>Reparos Gerais</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Cidade</label>
                      <select name="city" value={formData.city} onChange={handleChange} required className={inputCls}>
                        <option value="">Selecione...</option>
                        <option>Santo André</option>
                        <option>São Bernardo do Campo</option>
                        <option>São Caetano do Sul</option>
                        <option>Diadema</option>
                        <option>Mauá</option>
                        <option>Ribeirão Pires</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required className={inputCls} placeholder="Mínimo 6 caracteres" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar Senha</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className={inputCls} placeholder="••••••••" />
                </div>

                <button type="submit" disabled={loading} className={`w-full ${btnBg} text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 shadow-md text-sm mt-2`}>
                  {loading ? 'Criando conta...' : 'Criar Conta Grátis'}
                </button>
              </form>

              <p className="text-center text-gray-500 text-sm mt-6">
                Já tem conta?{' '}
                <Link href={`/login?type=${type}`} className={`${linkColor} font-semibold`}>Fazer login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>}>
      <RegisterContent />
    </Suspense>
  );
}
