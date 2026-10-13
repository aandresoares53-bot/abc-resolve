'use client';

import { useEffect, useState, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'provider' | 'consumer';
  service: string | null;
  city: string | null;
  plan: string;
  status: string;
  notes: string | null;
  created_at: string;
}

interface Payment {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_type: string;
  amount: number;
  description: string;
  status: 'pending' | 'paid' | 'cancelled';
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
}

type Tab = 'dashboard' | 'providers' | 'consumers' | 'payments' | 'settings';

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-100 text-gray-600',
    purple: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[color] ?? colors.gray}`}>
      {children}
    </span>
  );
}

function Feedback({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-medium border ${type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      {msg}
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">✕</button>
    </div>
  );
}

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState('');
  const [inputSecret, setInputSecret] = useState('');
  const [authError, setAuthError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Edit modals
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Payment modal
  const [newPayment, setNewPayment] = useState(false);
  const [payForm, setPayForm] = useState({ user_id: '', amount: '', description: '', due_date: '' });

  // Search/filter
  const [search, setSearch] = useState('');
  const [filterService, setFilterService] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const notify = useCallback((type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  }, []);

  const headers = useCallback((secret?: string) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${secret ?? adminSecret}`,
  }), [adminSecret]);

  const loadAll = useCallback(async (secret: string) => {
    setLoading(true);
    try {
      const [uRes, pRes] = await Promise.all([
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${secret}` } }),
        fetch('/api/admin/payments', { headers: { Authorization: `Bearer ${secret}` } }),
      ]);
      if (uRes.status === 401) {
        setAdminSecret('');
        localStorage.removeItem('adminSecret');
        setAuthError('Sessão expirada. Faça login novamente.');
        return;
      }
      const uData = await uRes.json() as { users: User[] };
      const pData = await pRes.json() as { payments: Payment[] };
      setUsers(uData.users ?? []);
      setPayments(pData.payments ?? []);
    } catch {
      notify('error', 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('adminSecret');
    if (stored) { setAdminSecret(stored); loadAll(stored); }
  }, [loadAll]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${inputSecret}` } });
      if (res.status === 401) { setAuthError('Senha incorreta'); return; }
      if (!res.ok) { setAuthError(`Erro no servidor (${res.status})`); return; }
      localStorage.setItem('adminSecret', inputSecret);
      setAdminSecret(inputSecret);
      await loadAll(inputSecret);
    } catch {
      setAuthError('Erro de conexão.');
    } finally { setLoginLoading(false); }
  }

  async function handleSaveUser() {
    if (!editUser) return;
    const res = await fetch(`/api/admin/users/${editUser.id}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => u.id === editUser.id ? { ...u, ...editForm } as User : u));
      notify('success', 'Usuário atualizado.');
      setEditUser(null);
    } else {
      notify('error', 'Erro ao salvar.');
    }
  }

  async function handleDeleteUser(id: string) {
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE', headers: headers() });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setPayments((prev) => prev.filter((p) => p.user_id !== id));
      notify('success', 'Usuário excluído.');
    } else {
      notify('error', 'Erro ao excluir.');
    }
    setDeleteConfirm(null);
  }

  async function handlePaymentStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/payments/${id}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: status as Payment['status'], paid_at: status === 'paid' ? new Date().toISOString() : p.paid_at } : p));
      notify('success', 'Pagamento atualizado.');
    } else {
      notify('error', 'Erro ao atualizar pagamento.');
    }
  }

  async function handleDeletePayment(id: string) {
    const res = await fetch(`/api/admin/payments/${id}`, { method: 'DELETE', headers: headers() });
    if (res.ok) {
      setPayments((prev) => prev.filter((p) => p.id !== id));
      notify('success', 'Cobrança excluída.');
    } else {
      notify('error', 'Erro ao excluir.');
    }
  }

  async function handleCreatePayment(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/payments', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ ...payForm, amount: Number(payForm.amount) * 100 }),
    });
    if (res.ok) {
      notify('success', 'Cobrança criada com sucesso.');
      setNewPayment(false);
      setPayForm({ user_id: '', amount: '', description: '', due_date: '' });
      await loadAll(adminSecret);
    } else {
      notify('error', 'Erro ao criar cobrança.');
    }
  }

  async function handleResetDB() {
    if (!confirm('Tem certeza? Isso apagará TODOS os usuários e pagamentos!')) return;
    const res = await fetch('/api/admin/reset', { method: 'DELETE', headers: headers() });
    if (res.ok) {
      setUsers([]);
      setPayments([]);
      notify('success', 'Banco de dados zerado com sucesso.');
    } else {
      notify('error', 'Erro ao zerar o banco.');
    }
  }

  // --- Login screen ---
  if (!adminSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
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
              <input type="password" value={inputSecret} onChange={(e) => setInputSecret(e.target.value)}
                required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none text-sm"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loginLoading}
              className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-700 transition disabled:opacity-50 shadow-md">
              {loginLoading ? 'Verificando...' : 'Acessar Painel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const providers = users.filter((u) => u.type === 'provider');
  const consumers = users.filter((u) => u.type === 'consumer');
  const totalRevenue = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pendingRevenue = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  const filteredProviders = providers.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !search || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.phone.includes(q);
    const matchService = !filterService || p.service === filterService;
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchService && matchStatus;
  });

  const filteredConsumers = consumers.filter((u) => {
    const q = search.toLowerCase();
    return !search || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
  });

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'providers', label: 'Prestadores', icon: '💼' },
    { id: 'consumers', label: 'Consumidores', icon: '👤' },
    { id: 'payments', label: 'Pagamentos', icon: '💰' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {feedback && <Feedback {...feedback} onClose={() => setFeedback(null)} />}

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-900">Editar {editUser.type === 'provider' ? 'Prestador' : 'Consumidor'}</h3>
              <button onClick={() => setEditUser(null)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Nome</label>
                  <input value={editForm.name ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-700 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Telefone</label>
                  <input value={editForm.phone ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-700 outline-none" />
                </div>
              </div>
              {editUser.type === 'provider' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Serviço</label>
                    <select value={editForm.service ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, service: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-700 outline-none">
                      <option value="">Selecione...</option>
                      {['Eletricista','Encanador','Pintor','Carpinteiro','Jardineiro','Limpeza','Ar Condicionado','Reparos Gerais'].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">Cidade</label>
                    <select value={editForm.city ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, city: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-700 outline-none">
                      <option value="">Selecione...</option>
                      {['Santo André','São Bernardo do Campo','São Caetano do Sul','Diadema','Mauá','Ribeirão Pires'].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Plano</label>
                  <select value={editForm.plan ?? 'free'} onChange={(e) => setEditForm((f) => ({ ...f, plan: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-700 outline-none">
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Status</label>
                  <select value={editForm.status ?? 'active'} onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-700 outline-none">
                    <option value="active">Ativo</option>
                    <option value="suspended">Suspenso</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Observações internas</label>
                <textarea value={editForm.notes ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2} placeholder="Notas visíveis apenas para admins..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-gray-700 outline-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditUser(null)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition font-semibold text-sm">Cancelar</button>
              <button onClick={handleSaveUser} className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl hover:bg-gray-700 transition font-semibold text-sm">Salvar alterações</button>
            </div>
          </div>
        </div>
      )}

      {/* New Payment Modal */}
      {newPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-900">Nova Cobrança</h3>
              <button onClick={() => setNewPayment(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
            </div>
            <form onSubmit={handleCreatePayment} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Usuário</label>
                <select required value={payForm.user_id} onChange={(e) => setPayForm((f) => ({ ...f, user_id: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-700 outline-none">
                  <option value="">Selecione o usuário...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.type === 'provider' ? 'Prestador' : 'Consumidor'}) — {u.email}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Valor (R$)</label>
                  <input type="number" step="0.01" required value={payForm.amount} onChange={(e) => setPayForm((f) => ({ ...f, amount: e.target.value }))}
                    placeholder="0,00" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-700 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Vencimento</label>
                  <input type="date" value={payForm.due_date} onChange={(e) => setPayForm((f) => ({ ...f, due_date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-700 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Descrição</label>
                <input required value={payForm.description} onChange={(e) => setPayForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Ex: Mensalidade Premium — Novembro/2025"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-700 outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setNewPayment(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition font-semibold text-sm">Cancelar</button>
                <button type="submit" className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl hover:bg-gray-700 transition font-semibold text-sm">Criar cobrança</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm">🔒</div>
            <div>
              <h1 className="text-base font-bold leading-tight">Painel Administrativo</h1>
              <p className="text-gray-400 text-xs">ABCResolve</p>
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem('adminSecret'); setAdminSecret(''); setUsers([]); setPayments([]); }}
            className="text-xs text-gray-300 hover:text-white border border-white/20 px-3 py-1.5 rounded-lg transition hover:bg-white/10">
            Sair
          </button>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto pb-0">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => { setTab(t.id); setSearch(''); setFilterService(''); setFilterStatus(''); }}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${tab === t.id ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-800 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && tab === 'dashboard' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Visão Geral</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Prestadores', value: providers.length, icon: '💼', color: 'text-blue-600' },
                { label: 'Consumidores', value: consumers.length, icon: '👤', color: 'text-indigo-600' },
                { label: 'Receita paga', value: `R$ ${(totalRevenue / 100).toFixed(2).replace('.', ',')}`, icon: '💵', color: 'text-green-600' },
                { label: 'A receber', value: `R$ ${(pendingRevenue / 100).toFixed(2).replace('.', ',')}`, icon: '⏳', color: 'text-yellow-600' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent providers */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Últimos Prestadores</h3>
                  <button onClick={() => setTab('providers')} className="text-xs text-blue-600 hover:underline">Ver todos</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {providers.slice(0, 5).map((p) => (
                    <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.service ?? '—'} · {p.city ?? '—'}</p>
                        </div>
                      </div>
                      <Badge color={p.plan === 'premium' ? 'purple' : p.plan === 'enterprise' ? 'blue' : 'gray'}>{p.plan}</Badge>
                    </div>
                  ))}
                  {providers.length === 0 && <p className="px-5 py-8 text-center text-sm text-gray-400">Nenhum prestador cadastrado ainda.</p>}
                </div>
              </div>

              {/* Recent payments */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Últimos Pagamentos</h3>
                  <button onClick={() => setTab('payments')} className="text-xs text-blue-600 hover:underline">Ver todos</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {payments.slice(0, 5).map((p) => (
                    <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.user_name}</p>
                        <p className="text-xs text-gray-500">{p.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">R$ {(p.amount / 100).toFixed(2).replace('.', ',')}</span>
                        <Badge color={p.status === 'paid' ? 'green' : p.status === 'cancelled' ? 'red' : 'yellow'}>
                          {p.status === 'paid' ? 'Pago' : p.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {payments.length === 0 && <p className="px-5 py-8 text-center text-sm text-gray-400">Nenhum pagamento registrado ainda.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && (tab === 'providers' || tab === 'consumers') && (
          <div>
            <div className="flex flex-wrap gap-3 mb-5 items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {tab === 'providers' ? `Prestadores (${filteredProviders.length})` : `Consumidores (${filteredConsumers.length})`}
              </h2>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5 flex flex-wrap gap-3">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome, email ou telefone..."
                className="flex-1 min-w-48 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-700 outline-none" />
              {tab === 'providers' && (
                <>
                  <select value={filterService} onChange={(e) => setFilterService(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-700 outline-none">
                    <option value="">Todos os serviços</option>
                    {['Eletricista','Encanador','Pintor','Carpinteiro','Jardineiro','Limpeza','Ar Condicionado','Reparos Gerais'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-700 outline-none">
                    <option value="">Todos os status</option>
                    <option value="active">Ativo</option>
                    <option value="suspended">Suspenso</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-5 py-3 text-left">Nome</th>
                      <th className="px-5 py-3 text-left">Email</th>
                      <th className="px-5 py-3 text-left">Telefone</th>
                      {tab === 'providers' && <><th className="px-5 py-3 text-left">Serviço</th><th className="px-5 py-3 text-left">Cidade</th><th className="px-5 py-3 text-left">Plano</th></>}
                      <th className="px-5 py-3 text-left">Status</th>
                      <th className="px-5 py-3 text-left">Cadastro</th>
                      <th className="px-5 py-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(tab === 'providers' ? filteredProviders : filteredConsumers).map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                              style={{ backgroundColor: u.type === 'provider' ? '#dbeafe' : '#e0e7ff', color: u.type === 'provider' ? '#1d4ed8' : '#4338ca' }}>
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900 truncate max-w-32">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-500 truncate max-w-40">{u.email}</td>
                        <td className="px-5 py-3 text-gray-500">{u.phone}</td>
                        {tab === 'providers' && (
                          <>
                            <td className="px-5 py-3">{u.service ? <Badge color="blue">{u.service}</Badge> : '—'}</td>
                            <td className="px-5 py-3 text-gray-500 text-xs">{u.city ?? '—'}</td>
                            <td className="px-5 py-3">
                              <Badge color={u.plan === 'premium' ? 'purple' : u.plan === 'enterprise' ? 'blue' : 'gray'}>{u.plan}</Badge>
                            </td>
                          </>
                        )}
                        <td className="px-5 py-3">
                          <Badge color={u.status === 'active' ? 'green' : u.status === 'suspended' ? 'yellow' : 'red'}>
                            {u.status === 'active' ? 'Ativo' : u.status === 'suspended' ? 'Suspenso' : 'Inativo'}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString('pt-BR')}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => { setEditUser(u); setEditForm({ name: u.name, phone: u.phone, service: u.service ?? '', city: u.city ?? '', plan: u.plan, status: u.status, notes: u.notes ?? '' }); }}
                              className="text-xs border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-100 transition text-gray-600 font-medium">Editar</button>
                            {deleteConfirm === u.id ? (
                              <div className="flex gap-1">
                                <button onClick={() => handleDeleteUser(u.id)} className="text-xs bg-red-600 text-white px-2.5 py-1 rounded-lg hover:bg-red-700 font-semibold transition">OK</button>
                                <button onClick={() => setDeleteConfirm(null)} className="text-xs bg-gray-100 px-2.5 py-1 rounded-lg hover:bg-gray-200 transition">✕</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirm(u.id)} className="text-xs border border-red-200 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-50 transition font-medium">Excluir</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(tab === 'providers' ? filteredProviders : filteredConsumers).length === 0 && (
                  <div className="py-16 text-center text-gray-400">
                    <div className="text-4xl mb-3">📋</div>
                    <p>Nenhum registro encontrado.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!loading && tab === 'payments' && (
          <div>
            <div className="flex flex-wrap gap-3 mb-5 items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Pagamentos ({payments.length})</h2>
              <button onClick={() => setNewPayment(true)}
                className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-700 transition flex items-center gap-2">
                + Nova Cobrança
              </button>
            </div>

            {/* Payment stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Total pago', value: `R$ ${(totalRevenue / 100).toFixed(2).replace('.', ',')}`, color: 'text-green-600', icon: '✅' },
                { label: 'Pendente', value: `R$ ${(pendingRevenue / 100).toFixed(2).replace('.', ',')}`, color: 'text-yellow-600', icon: '⏳' },
                { label: 'Cobranças', value: payments.length, color: 'text-gray-900', icon: '📄' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <span>{s.icon}</span>
                  </div>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-5 py-3 text-left">Usuário</th>
                      <th className="px-5 py-3 text-left">Descrição</th>
                      <th className="px-5 py-3 text-left">Valor</th>
                      <th className="px-5 py-3 text-left">Status</th>
                      <th className="px-5 py-3 text-left">Vencimento</th>
                      <th className="px-5 py-3 text-left">Pago em</th>
                      <th className="px-5 py-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-900">{p.user_name}</p>
                          <p className="text-xs text-gray-400">{p.user_email}</p>
                        </td>
                        <td className="px-5 py-3 text-gray-600 max-w-48 truncate">{p.description}</td>
                        <td className="px-5 py-3 font-semibold text-gray-900">R$ {(p.amount / 100).toFixed(2).replace('.', ',')}</td>
                        <td className="px-5 py-3">
                          <Badge color={p.status === 'paid' ? 'green' : p.status === 'cancelled' ? 'red' : 'yellow'}>
                            {p.status === 'paid' ? 'Pago' : p.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs">{p.due_date ? new Date(p.due_date).toLocaleDateString('pt-BR') : '—'}</td>
                        <td className="px-5 py-3 text-gray-500 text-xs">{p.paid_at ? new Date(p.paid_at).toLocaleDateString('pt-BR') : '—'}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            {p.status !== 'paid' && (
                              <button onClick={() => handlePaymentStatus(p.id, 'paid')}
                                className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-lg hover:bg-green-100 transition font-medium">
                                Marcar pago
                              </button>
                            )}
                            {p.status === 'pending' && (
                              <button onClick={() => handlePaymentStatus(p.id, 'cancelled')}
                                className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-lg hover:bg-yellow-100 transition font-medium">
                                Cancelar
                              </button>
                            )}
                            <button onClick={() => handleDeletePayment(p.id)}
                              className="text-xs border border-red-200 text-red-500 px-2.5 py-1 rounded-lg hover:bg-red-50 transition font-medium">
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {payments.length === 0 && (
                  <div className="py-16 text-center text-gray-400">
                    <div className="text-4xl mb-3">💰</div>
                    <p>Nenhuma cobrança registrada.</p>
                    <button onClick={() => setNewPayment(true)} className="mt-3 text-sm text-blue-600 hover:underline">Criar primeira cobrança</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!loading && tab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Configurações</h2>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-1">Sincronizar dados</h3>
                <p className="text-sm text-gray-500 mb-4">Recarrega todos os dados do banco de dados.</p>
                <button onClick={() => loadAll(adminSecret)}
                  className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700 transition">
                  Recarregar dados
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
                <h3 className="font-semibold text-red-700 mb-1">Zona de perigo</h3>
                <p className="text-sm text-gray-500 mb-4">Apaga <strong>todos</strong> os usuários e pagamentos. Ação irreversível.</p>
                <button onClick={handleResetDB}
                  className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition">
                  Zerar banco de dados
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Estatísticas</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between"><span>Total de usuários</span><span className="font-semibold">{users.length}</span></div>
                  <div className="flex justify-between"><span>Prestadores ativos</span><span className="font-semibold">{providers.filter((p) => p.status === 'active').length}</span></div>
                  <div className="flex justify-between"><span>Prestadores premium</span><span className="font-semibold">{providers.filter((p) => p.plan === 'premium').length}</span></div>
                  <div className="flex justify-between"><span>Consumidores</span><span className="font-semibold">{consumers.length}</span></div>
                  <div className="flex justify-between"><span>Cobranças totais</span><span className="font-semibold">{payments.length}</span></div>
                  <div className="flex justify-between"><span>Receita total (pago)</span><span className="font-semibold text-green-700">R$ {(totalRevenue / 100).toFixed(2).replace('.', ',')}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
