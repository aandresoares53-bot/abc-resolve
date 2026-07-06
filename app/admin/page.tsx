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
    if (stored) { setAdminSecret(stored); fetchProviders(stored); }
  }, []);

  async function fetchProviders(secret: string) {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/providers', { headers: { Authorization: `Bearer ${secret}` } });
      if (res.status === 401) { setAdminSecret(''); localStorage.removeItem('adminSecret'); setAuthError('Senha incorreta'); return; }
      const data = await res.json() as { providers: Provider[] };
      setProviders(data.providers);
    } finally { setLoading(false); }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/providers', { headers: { Authorization: `Bearer ${inputSecret}` } });
      if (res.status === 401) { setAuthError('Senha incorreta'); return; }
      if (!res.ok) { setAuthError(`Erro no servidor (${res.status}). Tente novamente.`); return; }
      const data = await res.json() as { providers: Provider[] };
      localStorage.setItem('adminSecret', inputSecret);
      setAdminSecret(inputSecret);
      setProviders(data.providers);
    } catch {
      setAuthError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally { setLoginLoading(false); }
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

  if (!adminSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🔒</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
            <p className="text-gray-500 text-sm mt-1">ABCResolve — Acesso restrito</p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
              <span>⚠️</span> {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha de Admin</label>
              <input
                type="password" value={inputSecret}
                onChange={(e) => setInputSecret(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none text-sm"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={loginLoading}
              className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-700 transition disabled:opacity-50 shadow-md"
            >
              {loginLoading ? 'Verificando...' : 'Acessar Painel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🔒</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Painel Administrativo</h1>
              <p className="text-gray-400 text-xs">ABCResolve</p>
            </div>
          </div>
          <button
            onClick={() => { localStorage.removeItem('adminSecret'); setAdminSecret(''); setProviders([]); }}
            className="text-sm text-gray-300 hover:text-white border border-white/20 px-4 py-2 rounded-lg transition hover:bg-white/10"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total de Prestadores</p>
            <p className="text-3xl font-bold text-gray-900">{providers.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Serviços únicos</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Set(providers.map(p => p.service).filter(Boolean)).size}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Cidades atendidas</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Set(providers.map(p => p.city).filter(Boolean)).size}
            </p>
          </div>
        </div>

        {feedback && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${feedback.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            <span>{feedback.type === 'success' ? '✅' : '❌'}</span> {feedback.msg}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Prestadores Cadastrados</h2>
            <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
              {providers.length} registro{providers.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-gray-800 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm">Carregando...</p>
            </div>
          ) : providers.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-5xl mb-3">📋</div>
              <p className="text-gray-500 font-medium">Nenhum prestador cadastrado ainda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
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
                <tbody className="divide-y divide-gray-50">
                  {providers.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-xs">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{p.email}</td>
                      <td className="px-6 py-4 text-gray-500">{p.phone}</td>
                      <td className="px-6 py-4">
                        {p.service ? (
                          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">{p.service}</span>
                        ) : '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{p.city ?? '—'}</td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(p.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {deleteConfirm === p.id ? (
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-700 font-semibold transition">
                              Confirmar
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-200 transition">
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(p.id)} className="text-red-500 hover:text-red-700 text-xs border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition font-medium">
                            Excluir
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
