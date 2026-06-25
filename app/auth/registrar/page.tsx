'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, MapPin, Phone, AlertCircle } from 'lucide-react';
import { ESTADOS_BR, CIDADES_SP } from '@/lib/constants';
import type { TipoUsuario } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const [tipo, setTipo] = useState<TipoUsuario>('cliente');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    estado: 'SP',
    cidade: '',
    telefone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.senha !== formData.confirmarSenha) {
      setError('Senhas não coincidem');
      return;
    }

    if (formData.senha.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tipo,
          senha: formData.senha,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Erro ao registrar');
        return;
      }

      // Save token
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        router.push('/');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</h1>
          <p className="text-gray-600">Junte-se a milhares de usuários no ABC Resolve</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Tipo Selection */}
          <div>
            <label className="label mb-3">Você é:</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTipo('cliente')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  tipo === 'cliente'
                    ? 'border-brand-600 bg-brand-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">👤</div>
                <div className="font-medium text-gray-900">Cliente</div>
                <div className="text-xs text-gray-600">Procura serviços</div>
              </button>
              <button
                type="button"
                onClick={() => setTipo('prestador')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  tipo === 'prestador'
                    ? 'border-brand-600 bg-brand-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">🛠️</div>
                <div className="font-medium text-gray-900">Prestador</div>
                <div className="text-xs text-gray-600">Oferece serviços</div>
              </button>
            </div>
          </div>

          {/* Grid 2 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="label">
                Nome Completo
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="João Silva"
                  className="input-base pl-10"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="input-base pl-10"
                  required
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="label">
                Senha
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-base pl-10"
                  required
                />
              </div>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmarSenha" className="label">
                Confirmar Senha
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  id="confirmarSenha"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-base pl-10"
                  required
                />
              </div>
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="estado" className="label">
                Estado
              </label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="input-base pl-10"
                  required
                >
                  {ESTADOS_BR.map(estado => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cidade */}
            <div>
              <label htmlFor="cidade" className="label">
                Cidade
              </label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="São Paulo"
                className="input-base"
                list="cidades"
                required
              />
              <datalist id="cidades">
                {CIDADES_SP.map(cidade => (
                  <option key={cidade} value={cidade} />
                ))}
              </datalist>
            </div>

            {/* Telefone */}
            <div>
              <label htmlFor="telefone" className="label">
                Telefone (Opcional)
              </label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="input-base pl-10"
                />
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Concordo com os{' '}
              <a href="#" className="text-brand-600 hover:text-brand-700 font-medium">
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href="#" className="text-brand-600 hover:text-brand-700 font-medium">
                Política de Privacidade
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Já tem conta?{' '}
            <Link href="/auth/login" className="text-brand-600 font-medium hover:text-brand-700">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
