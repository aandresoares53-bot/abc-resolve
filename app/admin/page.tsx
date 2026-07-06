'use client';

import { useEffect, useState } from 'react';

interface Provider {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string | null;
  city: string | null;
  created_at: string;
}

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState('');
  const [inputSecret, setInputSecret] = useState('');
  const [authError, setAuthError] = useState('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('adminSecret');
    if (stored) {
      setAdminSecret(stored);
      fetchProviders(stored);
    }
  }, []);

  async function fetchProviders(secret: string) {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/providers', {
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (res.status === 401) {
        setAdminSecret('');
        localStorage.removeItem('adminSecret');
        setAuthError('Senha incorreta');
        return;
      }
      const data = await res.json() as { providers: Provider[] };
      setProviders(data.providers);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/providers', {
        headers: { Authorization: `Bearer ${inputSecret}` },
      });
      if (res.status === 401) {
        setAuthError('Senha incorreta');
        return;
      }
      if (!res.ok) {
        setAuthError(`Erro no servidor (${res.status}). Tente novamente.`);
        return;
      }
      const data = await res.json() as { providers: Provider[] };
      localStorage.setItem('adminSecret', inputSecret);
      setAdminSecret(inputSecret);
      setProviders(data.providers);
    } catch {
      setAuthError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/providers/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminSecret}` },
    });
    if (res.ok) {
      setProviders((prev) => prev.filter((p) => p.id !== id));
      setFeedback({ type: 'success', msg: 'Prestador excluído com sucesso.' });
    } else {
      setFeedback({ type: 'error', msg: 'Erro ao excluir prestador.' });
    }
    setDeleteConfirm(null);
    setTimeout(() => setFeedback(null), 3000);
  }

  function handleLogout() {
    localStorage.removeItem('adminSecret');
    setAdminSecret('');
    setProviders([]);
  }

  // Tela de login
  if (!adminSecret) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin — ABCResolve</h1>
          <p className="text-gray-600 mb-6 text-sm">Acesso restrito</p>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha de Admin</label>
              <input
                type="password"
                value={inputSecret}
                onChange={(e) => setInputSecret(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gray-900 text-white font-semibold py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
            >
              {loginLoading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin — ABCResolve</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-lg"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        {feedback && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {feedback.msg}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Prestadores cadastrados</h2>
            <span className="text-sm text-gray-500">{providers.length} registro(s)</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">Carregando...</div>
          ) : providers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">Nenhum prestador cadastrado.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Nome</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Telefone</th>
                  <th className="px-6 py-3 text-left">Serviço</th>
                  <th className="px-6 py-3 text-left">Cidade</th>
                  <th className="px-6 py-3 text-left">Cadastro</th>
                  <th className="px-6 py-3 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {providers.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 text-gray-600">{p.email}</td>
                    <td className="px-6 py-4 text-gray-600">{p.phone}</td>
                    <td className="px-6 py-4 text-gray-600">{p.service ?? '—'}</td>
                    <td className="px-6 py-4 text-gray-600">{p.city ?? '—'}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(p.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {deleteConfirm === p.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-700 font-semibold"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-300"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(p.id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-xs border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
