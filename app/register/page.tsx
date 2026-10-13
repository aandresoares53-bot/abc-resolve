'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function RegisterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [type, setType] = useState(searchParams.get('type') || 'consumer');
  const isProvider = type === 'provider';

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', service: '', city: '',
  });
  const [showPass, setShowPass] = useState(false);
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
    if (formData.password.length < 6) { setError('A senha deve ter ao menos 6 caracteres'); return; }
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

  const accent = isProvider
    ? { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', ring: 'focus:ring-emerald-500', text: 'text-emerald-600', grad: 'from-emerald-500 to-teal-600', tab: 'text-emerald-600 border-emerald-600 bg-emerald-50/50' }
    : { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', ring: 'focus:ring-blue-500', text: 'text-blue-600', grad: 'from-blue-600 to-indigo-700', tab: 'text-blue-600 border-blue-600 bg-blue-50/50' };

  const inputCls = `w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 ${accent.ring} focus:border-transparent outline-none text-sm transition`;

  const benefits = isProvider
    ? ['Cadastro 100% gratuito', 'Receba contatos de clientes', 'Perfil profissional completo', 'Atenda toda a região do ABC']
    : ['Busque por serviço e cidade', 'Prestadores verificados', 'Contato direto via WhatsApp', 'Avalie após o serviço'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top banner */}
      <div className={`bg-gradient-to-r ${accent.grad} text-white`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold">ABCResolve</span>
          </Link>
          <Link href="/" className="text-white/80 hover:text-white text-sm font-medium transition">← Voltar</Link>
        </div>

        <div className="container mx-auto px-6 pb-10 pt-4 text-center">
          <div className="text-4xl mb-2">{isProvider ? '🚀' : '✨'}</div>
          <h1 className="text-2xl font-bold mb-1">
            {isProvider ? 'Comece a receber clientes!' : 'Crie sua conta grátis'}
          </h1>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            {benefits.map(b => (
              <span key={b} className="text-xs bg-white/20 px-3 py-1 rounded-full">✅ {b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="container mx-auto px-4 -mt-6 mb-10 max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Type tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setType('consumer')}
              className={`flex-1 py-3.5 text-sm font-semibold transition ${type === 'consumer' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}`}
            >
              👤 Consumidor
            </button>
            <button
              onClick={() => setType('provider')}
              className={`flex-1 py-3.5 text-sm font-semibold transition ${type === 'provider' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-gray-500 hover:text-gray-700'}`}
            >
              💼 Prestador
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Criar Conta</h2>
            <p className="text-gray-500 text-sm mb-5">
              {isProvider ? 'Cadastre-se e comece a atender clientes' : 'Registre-se para contratar serviços'}
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone / WhatsApp</label>
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
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'} name="password"
                    value={formData.password} onChange={handleChange} required
                    className={`${inputCls} pr-12`} placeholder="Mínimo 6 caracteres"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg">
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar Senha</label>
                <input
                  type="password" name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange} required
                  className={inputCls} placeholder="••••••••"
                />
              </div>

              <button type="submit" disabled={loading}
                className={`w-full ${accent.bg} ${accent.hover} text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 shadow-md text-sm`}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Criando conta...
                  </span>
                ) : 'Criar Conta Grátis'}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm">
                Já tem conta?{' '}
                <Link href={`/login?type=${type}`} className={`${accent.text} font-semibold`}>Fazer login</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-5 text-xs text-gray-400">
          <span>🔒 Dados seguros</span>
          <span>✅ Cadastro grátis</span>
          <span>⭐ +500 profissionais</span>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>}>
      <RegisterContent />
    </Suspense>
  );
}
