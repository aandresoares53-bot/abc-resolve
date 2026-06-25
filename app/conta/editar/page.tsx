'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { ESTADOS_BR, CIDADES_SP } from '@/lib/constants';
import { useAuth } from '@/lib/auth-context';

export default function EditarContaPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    estado: 'SP',
    cidade: '',
    bio: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Carregar dados do usuário
  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome,
        email: user.email,
        telefone: user.telefone || '',
        estado: user.estado,
        cidade: user.cidade,
        bio: user.bio || '',
      });
    }
  }, [user]);

  // Proteção de rota
  if (!isLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-64px-200px)] flex items-center justify-center px-4">
        <div className="card max-w-md text-center">
          <AlertCircle size={48} className="mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Você precisa estar logado</h1>
          <p className="text-gray-600 mb-6">Faça login para editar sua conta.</p>
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
    setSuccess('');

    if (!formData.nome || !formData.email || !formData.cidade) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/usuario/editar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Erro ao atualizar perfil');
        return;
      }

      setSuccess('Perfil atualizado com sucesso!');
      setTimeout(() => {
        if (user?.tipo === 'prestador') {
          router.push('/prestadores/dashboard');
        } else {
          router.push('/conta');
        }
      }, 1500);
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
          <Link href={user?.tipo === 'prestador' ? '/prestadores/dashboard' : '/conta'} className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-4">
            <ArrowLeft size={18} />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Editar Perfil
          </h1>
          <p className="text-gray-600">
            Atualize suas informações pessoais
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

          {success && (
            <div className="flex gap-3 rounded-lg bg-green-50 p-4 border border-green-200">
              <p className="text-sm text-green-700">✓ {success}</p>
            </div>
          )}

          {/* Nome */}
          <div>
            <label htmlFor="nome" className="label label-required">
              Nome Completo
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="input-base w-full mt-1"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="label label-required">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-base w-full mt-1"
              required
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Email não pode ser alterado
            </p>
          </div>

          {/* Telefone */}
          <div>
            <label htmlFor="telefone" className="label">
              Telefone
            </label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              className="input-base w-full mt-1"
            />
          </div>

          {/* Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="estado" className="label label-required">
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="input-base w-full mt-1"
                required
              >
                {ESTADOS_BR.map(estado => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            {/* Cidade */}
            <div>
              <label htmlFor="cidade" className="label label-required">
                Cidade
              </label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="São Paulo"
                className="input-base w-full mt-1"
                list="cidades"
                required
              />
              <datalist id="cidades">
                {CIDADES_SP.map(cidade => (
                  <option key={cidade} value={cidade} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Bio (para prestadores) */}
          {user?.tipo === 'prestador' && (
            <div>
              <label htmlFor="bio" className="label">
                Sobre Você
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Conte um pouco sobre sua experiência e especialidades..."
                className="input-base w-full mt-1 min-h-32"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/500 caracteres
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <Link href={user?.tipo === 'prestador' ? '/prestadores/dashboard' : '/conta'} className="btn-secondary flex-1 text-center">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
