'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wrench, Users, ClipboardList, CheckCircle, Clock,
  LogOut, ChevronDown, RefreshCw, X, Check, AlertCircle,
  CreditCard, Pencil, Trash2, QrCode, BanknoteIcon, ArrowLeftRight, MessageCircle
} from 'lucide-react';
import type { Provider, ServiceRequest } from '@/types';
import { ABC_CITIES } from '@/lib/cities';

type Tab = 'providers' | 'requests' | 'subscriptions';
type ProviderStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
type RequestStatus = 'open' | 'matched' | 'closed';
type SubStatus = 'pending' | 'active' | 'expired' | 'cancelled';

interface Stats {
  total_providers: number;
  total_requests: number;
  approved_providers: number;
  open_requests: number;
  pix_pending: number;
  pix_active: number;
  suspended_providers: number;
}

interface Subscription {
  id: number;
  provider_id: number;
  provider_name: string;
  provider_email: string;
  provider_phone: string;
  category_name: string;
  status: SubStatus;
  amount: string;
  paid_at?: string;
  expires_at?: string;
  created_at: string;
}

const URGENCY_LABELS: Record<string, { label: string; color: string }> = {
  urgent: { label: 'Urgente', color: 'bg-red-100 text-red-700' },
  normal: { label: 'Normal', color: 'bg-yellow-100 text-yellow-700' },
  flexible: { label: 'Flexível', color: 'bg-green-100 text-green-700' },
};

interface EditProviderForm {
  id: number;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  neighborhood: string;
  description: string;
  experience_years: string;
  category_slug: string;
}

interface EditRequestForm {
  id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  city: string;
  neighborhood: string;
  description: string;
  urgency: string;
  category_name: string;
}

interface EditSubForm {
  id: number;
  provider_name: string;
  provider_email: string;
  provider_phone: string;
  amount: string;
  status: SubStatus;
}

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('providers');
  const [stats, setStats] = useState<Stats | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus>('pending');
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('open');
  const [subStatus, setSubStatus] = useState<SubStatus>('pending');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Provider edit/delete
  const [editProvider, setEditProvider] = useState<EditProviderForm | null>(null);
  const [editProviderLoading, setEditProviderLoading] = useState(false);
  const [editProviderError, setEditProviderError] = useState('');
  const [deleteProviderId, setDeleteProviderId] = useState<number | null>(null);
  const [deleteProviderLoading, setDeleteProviderLoading] = useState(false);

  // Request edit/delete
  const [editRequest, setEditRequest] = useState<EditRequestForm | null>(null);
  const [editRequestLoading, setEditRequestLoading] = useState(false);
  const [editRequestError, setEditRequestError] = useState('');
  const [deleteRequestId, setDeleteRequestId] = useState<number | null>(null);
  const [deleteRequestLoading, setDeleteRequestLoading] = useState(false);

  // Subscription edit/delete
  const [editSub, setEditSub] = useState<EditSubForm | null>(null);
  const [editSubLoading, setEditSubLoading] = useState(false);
  const [editSubError, setEditSubError] = useState('');
  const [deleteSubId, setDeleteSubId] = useState<number | null>(null);
  const [deleteSubLoading, setDeleteSubLoading] = useState(false);

  // Conversão
  const [convertReqToProvider, setConvertReqToProvider] = useState<{ id: number; name: string } | null>(null);
  const [convertProviderToReq, setConvertProviderToReq] = useState<{ id: number; name: string } | null>(null);
  const [convertForm, setConvertForm] = useState({ whatsapp: '', neighborhood: '', experience_years: '0', urgency: 'normal' });
  const [convertLoading, setConvertLoading] = useState(false);
  const [convertError, setConvertError] = useState('');
  const [convertSuccess, setConvertSuccess] = useState('');
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);

  const fetchStats = useCallback(async () => {
    // Verifica e suspende automaticamente assinaturas expiradas
    await fetch('/api/admin/cron', { method: 'POST' });
    const res = await fetch('/api/admin/stats');
    if (res.status === 401) { router.push('/admin'); return; }
    setStats(await res.json() as Stats);
  }, [router]);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/providers?status=${providerStatus}`);
    if (res.status === 401) { router.push('/admin'); return; }
    const d = await res.json() as { providers: Provider[] };
    setProviders(d.providers || []);
    setLoading(false);
  }, [providerStatus, router]);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/requests?status=${requestStatus}`);
    if (res.status === 401) { router.push('/admin'); return; }
    const d = await res.json() as { requests: ServiceRequest[] };
    setRequests(d.requests || []);
    setLoading(false);
  }, [requestStatus, router]);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/subscriptions?status=${subStatus}`);
    if (res.status === 401) { router.push('/admin'); return; }
    const d = await res.json() as { subscriptions: Subscription[] };
    setSubscriptions(d.subscriptions || []);
    setLoading(false);
  }, [subStatus, router]);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json() as Promise<{ categories: { slug: string; name: string }[] }>)
      .then((d) => setCategories(d.categories));
  }, []);
  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { if (tab === 'providers') fetchProviders(); }, [tab, fetchProviders]);
  useEffect(() => { if (tab === 'requests') fetchRequests(); }, [tab, fetchRequests]);
  useEffect(() => { if (tab === 'subscriptions') fetchSubscriptions(); }, [tab, fetchSubscriptions]);

  // Provider actions
  async function updateProviderStatus(id: number, status: ProviderStatus) {
    setActionLoading(id);
    await fetch('/api/admin/providers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setProviders((p) => p.filter((x) => x.id !== id));
    fetchStats();
    setActionLoading(null);
  }

  async function saveProvider() {
    if (!editProvider) return;
    setEditProviderLoading(true);
    setEditProviderError('');
    try {
      const res = await fetch('/api/admin/providers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editProvider),
      });
      if (!res.ok) { const d = await res.json() as { error?: string }; throw new Error(d.error || 'Erro ao salvar'); }
      const updatedCatName = categories.find((c) => c.slug === editProvider.category_slug)?.name;
      setProviders((prev) => prev.map((p) => p.id === editProvider.id ? { ...p, ...editProvider, experience_years: Number(editProvider.experience_years), category_name: updatedCatName ?? p.category_name } : p));
      setEditProvider(null);
    } catch (err: unknown) {
      setEditProviderError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setEditProviderLoading(false);
    }
  }

  async function confirmDeleteProvider() {
    if (!deleteProviderId) return;
    setDeleteProviderLoading(true);
    await fetch('/api/admin/providers', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteProviderId }) });
    setProviders((p) => p.filter((x) => x.id !== deleteProviderId));
    fetchStats();
    setDeleteProviderId(null);
    setDeleteProviderLoading(false);
  }

  // Request actions
  async function updateRequestStatus(id: number, status: RequestStatus) {
    setActionLoading(id);
    await fetch('/api/admin/requests', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setRequests((r) => r.filter((x) => x.id !== id));
    fetchStats();
    setActionLoading(null);
  }

  async function saveRequest() {
    if (!editRequest) return;
    setEditRequestLoading(true);
    setEditRequestError('');
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editRequest),
      });
      if (!res.ok) { const d = await res.json() as { error?: string }; throw new Error(d.error || 'Erro ao salvar'); }
      setRequests((prev) => prev.map((r) => r.id === editRequest.id ? { ...r, ...editRequest, urgency: editRequest.urgency as 'normal' | 'urgent' | 'flexible' } : r));
      setEditRequest(null);
    } catch (err: unknown) {
      setEditRequestError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setEditRequestLoading(false);
    }
  }

  async function confirmDeleteRequest() {
    if (!deleteRequestId) return;
    setDeleteRequestLoading(true);
    await fetch('/api/admin/requests', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteRequestId }) });
    setRequests((r) => r.filter((x) => x.id !== deleteRequestId));
    fetchStats();
    setDeleteRequestId(null);
    setDeleteRequestLoading(false);
  }

  // Subscription actions
  async function updateSubStatus(id: number, status: SubStatus) {
    setActionLoading(id);
    await fetch('/api/admin/subscriptions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setSubscriptions((s) => s.filter((x) => x.id !== id));
    fetchStats();
    setActionLoading(null);
  }

  async function saveSub() {
    if (!editSub) return;
    setEditSubLoading(true);
    setEditSubError('');
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editSub.id, status: editSub.status, amount: editSub.amount }),
      });
      if (!res.ok) { const d = await res.json() as { error?: string }; throw new Error(d.error || 'Erro ao salvar'); }
      setSubscriptions((prev) => prev.map((s) => s.id === editSub.id ? { ...s, ...editSub } : s));
      setEditSub(null);
    } catch (err: unknown) {
      setEditSubError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setEditSubLoading(false);
    }
  }

  async function confirmDeleteSub() {
    if (!deleteSubId) return;
    setDeleteSubLoading(true);
    await fetch('/api/admin/subscriptions', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteSubId }) });
    setSubscriptions((s) => s.filter((x) => x.id !== deleteSubId));
    fetchStats();
    setDeleteSubId(null);
    setDeleteSubLoading(false);
  }

  async function doConvert(direction: string, source_id: number) {
    setConvertLoading(true);
    setConvertError('');
    setConvertSuccess('');
    try {
      const res = await fetch('/api/admin/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction, source_id, ...convertForm }),
      });
      const d = await res.json() as { error?: string };
      if (!res.ok) throw new Error(d.error || 'Erro ao converter');
      setConvertSuccess(direction === 'request_to_provider' ? 'Convertido para prestador com sucesso!' : 'Convertido para solicitante com sucesso!');
      setConvertReqToProvider(null);
      setConvertProviderToReq(null);
      fetchStats();
    } catch (err: unknown) {
      setConvertError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setConvertLoading(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin');
  }

  function DeleteModal({ title, message, loading, onConfirm, onCancel }: { title: string; message: string; loading: boolean; onConfirm: () => void; onCancel: () => void }) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-600" />
          </div>
          <h2 className="font-bold text-gray-900 text-lg mb-2">{title}</h2>
          <p className="text-gray-500 text-sm mb-6">{message}</p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="btn-secondary flex-1 py-2.5 text-sm">Cancelar</button>
            <button onClick={onConfirm} disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
              {loading ? 'Excluindo...' : 'Sim, excluir'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── MODAIS PRESTADORES ── */}
      {editProvider && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">Editar prestador</h2>
              <button onClick={() => setEditProvider(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Nome completo</label>
                  <input className="input" value={editProvider.name} onChange={(e) => setEditProvider({ ...editProvider, name: e.target.value })} />
                </div>
                <div>
                  <label className="label">E-mail</label>
                  <input className="input" type="email" value={editProvider.email} onChange={(e) => setEditProvider({ ...editProvider, email: e.target.value })} />
                </div>
                <div>
                  <label className="label">Telefone</label>
                  <input className="input" value={editProvider.phone} onChange={(e) => setEditProvider({ ...editProvider, phone: e.target.value })} />
                </div>
                <div>
                  <label className="label">WhatsApp</label>
                  <input className="input" value={editProvider.whatsapp} onChange={(e) => setEditProvider({ ...editProvider, whatsapp: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="label">Categoria de atividade</label>
                  <select className="input" value={editProvider.category_slug} onChange={(e) => setEditProvider({ ...editProvider, category_slug: e.target.value })}>
                    <option value="">Selecione a categoria...</option>
                    {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Cidade</label>
                  <select className="input" value={editProvider.city} onChange={(e) => setEditProvider({ ...editProvider, city: e.target.value })}>
                    {ABC_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Bairro</label>
                  <input className="input" value={editProvider.neighborhood} onChange={(e) => setEditProvider({ ...editProvider, neighborhood: e.target.value })} />
                </div>
                <div>
                  <label className="label">Anos de experiência</label>
                  <select className="input" value={editProvider.experience_years} onChange={(e) => setEditProvider({ ...editProvider, experience_years: e.target.value })}>
                    <option value="0">Menos de 1 ano</option>
                    <option value="1">1 ano</option>
                    <option value="2">2 anos</option>
                    <option value="3">3 anos</option>
                    <option value="5">5 anos</option>
                    <option value="10">10+ anos</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="label">Descrição dos serviços</label>
                  <textarea className="input resize-none h-24" value={editProvider.description} onChange={(e) => setEditProvider({ ...editProvider, description: e.target.value })} />
                </div>
              </div>
              {editProviderError && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{editProviderError}</div>}
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setEditProvider(null)} className="btn-secondary flex-1 py-2.5 text-sm">Cancelar</button>
              <button onClick={saveProvider} disabled={editProviderLoading} className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2">
                {editProviderLoading ? 'Salvando...' : <><Check size={15} /> Salvar</>}
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteProviderId !== null && (
        <DeleteModal
          title="Excluir prestador?"
          message="Esta ação é permanente. O cadastro e a assinatura serão removidos."
          loading={deleteProviderLoading}
          onConfirm={confirmDeleteProvider}
          onCancel={() => setDeleteProviderId(null)}
        />
      )}

      {/* ── MODAIS SOLICITAÇÕES ── */}
      {editRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">Editar solicitação</h2>
              <button onClick={() => setEditRequest(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Nome do cliente</label>
                  <input className="input" value={editRequest.client_name} onChange={(e) => setEditRequest({ ...editRequest, client_name: e.target.value })} />
                </div>
                <div>
                  <label className="label">E-mail</label>
                  <input className="input" type="email" value={editRequest.client_email} onChange={(e) => setEditRequest({ ...editRequest, client_email: e.target.value })} />
                </div>
                <div>
                  <label className="label">Telefone</label>
                  <input className="input" value={editRequest.client_phone} onChange={(e) => setEditRequest({ ...editRequest, client_phone: e.target.value })} />
                </div>
                <div>
                  <label className="label">Cidade</label>
                  <select className="input" value={editRequest.city} onChange={(e) => setEditRequest({ ...editRequest, city: e.target.value })}>
                    {ABC_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Bairro</label>
                  <input className="input" value={editRequest.neighborhood} onChange={(e) => setEditRequest({ ...editRequest, neighborhood: e.target.value })} />
                </div>
                <div>
                  <label className="label">Urgência</label>
                  <select className="input" value={editRequest.urgency} onChange={(e) => setEditRequest({ ...editRequest, urgency: e.target.value })}>
                    <option value="urgent">🔴 Urgente</option>
                    <option value="normal">🟡 Normal</option>
                    <option value="flexible">🟢 Flexível</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="label">Descrição</label>
                  <textarea className="input resize-none h-24" value={editRequest.description} onChange={(e) => setEditRequest({ ...editRequest, description: e.target.value })} />
                </div>
              </div>
              {editRequestError && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{editRequestError}</div>}
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setEditRequest(null)} className="btn-secondary flex-1 py-2.5 text-sm">Cancelar</button>
              <button onClick={saveRequest} disabled={editRequestLoading} className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2">
                {editRequestLoading ? 'Salvando...' : <><Check size={15} /> Salvar</>}
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteRequestId !== null && (
        <DeleteModal
          title="Excluir solicitação?"
          message="Esta ação é permanente e não pode ser desfeita."
          loading={deleteRequestLoading}
          onConfirm={confirmDeleteRequest}
          onCancel={() => setDeleteRequestId(null)}
        />
      )}

      {/* ── MODAIS ASSINATURAS ── */}
      {editSub && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 text-lg">Editar assinatura</h2>
              <button onClick={() => setEditSub(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label">Prestador</label>
                <input className="input bg-gray-50" value={editSub.provider_name} disabled />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Valor (R$)</label>
                  <input className="input" value={editSub.amount} onChange={(e) => setEditSub({ ...editSub, amount: e.target.value })} placeholder="19.90" />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={editSub.status} onChange={(e) => setEditSub({ ...editSub, status: e.target.value as SubStatus })}>
                    <option value="pending">⏳ Aguardando</option>
                    <option value="active">✅ Ativa</option>
                    <option value="expired">⏰ Expirada</option>
                    <option value="cancelled">❌ Cancelada</option>
                  </select>
                </div>
              </div>
              {editSubError && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{editSubError}</div>}
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setEditSub(null)} className="btn-secondary flex-1 py-2.5 text-sm">Cancelar</button>
              <button onClick={saveSub} disabled={editSubLoading} className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2">
                {editSubLoading ? 'Salvando...' : <><Check size={15} /> Salvar</>}
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteSubId !== null && (
        <DeleteModal
          title="Excluir assinatura?"
          message="A assinatura será removida permanentemente."
          loading={deleteSubLoading}
          onConfirm={confirmDeleteSub}
          onCancel={() => setDeleteSubId(null)}
        />
      )}

      {/* ── MODAL CONVERSÃO: Solicitação → Prestador ── */}
      {convertReqToProvider && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Converter para Prestador</h2>
                <p className="text-sm text-gray-500 mt-0.5">{convertReqToProvider.name}</p>
              </div>
              <button onClick={() => { setConvertReqToProvider(null); setConvertError(''); }} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">Os dados do solicitante serão usados para criar o perfil de prestador. Preencha as informações adicionais abaixo:</p>
              <div>
                <label className="label">WhatsApp</label>
                <input className="input" placeholder="(11) 99999-9999" value={convertForm.whatsapp} onChange={(e) => setConvertForm({ ...convertForm, whatsapp: e.target.value })} />
              </div>
              <div>
                <label className="label">Bairro</label>
                <input className="input" placeholder="Bairro de atuação" value={convertForm.neighborhood} onChange={(e) => setConvertForm({ ...convertForm, neighborhood: e.target.value })} />
              </div>
              <div>
                <label className="label">Anos de experiência</label>
                <select className="input" value={convertForm.experience_years} onChange={(e) => setConvertForm({ ...convertForm, experience_years: e.target.value })}>
                  <option value="0">Menos de 1 ano</option>
                  <option value="1">1 ano</option>
                  <option value="2">2 anos</option>
                  <option value="3">3 anos</option>
                  <option value="5">5 anos</option>
                  <option value="10">10+ anos</option>
                </select>
              </div>
              {convertError && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{convertError}</div>}
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => { setConvertReqToProvider(null); setConvertError(''); }} className="btn-secondary flex-1 py-2.5 text-sm">Cancelar</button>
              <button onClick={() => doConvert('request_to_provider', convertReqToProvider.id)} disabled={convertLoading}
                className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2">
                {convertLoading ? 'Convertendo...' : <><ArrowLeftRight size={14} /> Converter</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONVERSÃO: Prestador → Solicitante ── */}
      {convertProviderToReq && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Converter para Solicitante</h2>
                <p className="text-sm text-gray-500 mt-0.5">{convertProviderToReq.name}</p>
              </div>
              <button onClick={() => { setConvertProviderToReq(null); setConvertError(''); }} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">Os dados do prestador serão usados para criar uma solicitação de serviço. Defina a urgência:</p>
              <div>
                <label className="label">Urgência</label>
                <select className="input" value={convertForm.urgency} onChange={(e) => setConvertForm({ ...convertForm, urgency: e.target.value })}>
                  <option value="urgent">🔴 Urgente</option>
                  <option value="normal">🟡 Normal</option>
                  <option value="flexible">🟢 Flexível</option>
                </select>
              </div>
              {convertError && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{convertError}</div>}
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => { setConvertProviderToReq(null); setConvertError(''); }} className="btn-secondary flex-1 py-2.5 text-sm">Cancelar</button>
              <button onClick={() => doConvert('provider_to_request', convertProviderToReq.id)} disabled={convertLoading}
                className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-2">
                {convertLoading ? 'Convertendo...' : <><ArrowLeftRight size={14} /> Converter</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST SUCESSO ── */}
      {convertSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium">
          <CheckCircle size={16} /> {convertSuccess}
          <button onClick={() => setConvertSuccess('')} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
        </div>
      )}

      {/* ── TOP BAR ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-lg text-primary-700">
            <div className="bg-primary-600 text-white p-1.5 rounded-md"><Wrench size={16} /></div>
            ABC<span className="text-accent-500">Resolve</span>
            <span className="text-gray-400 font-normal text-sm">/ Admin</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors">
            <LogOut size={15} /> Sair
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: 'Total prestadores', value: stats.total_providers, icon: Users, color: 'text-primary-600 bg-primary-50' },
              { label: 'Aprovados', value: stats.approved_providers, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
              { label: 'Total solicitações', value: stats.total_requests, icon: ClipboardList, color: 'text-indigo-600 bg-indigo-50' },
              { label: 'Abertas', value: stats.open_requests, icon: Clock, color: 'text-orange-600 bg-orange-50' },
              { label: 'PIX pendente', value: stats.pix_pending, icon: QrCode, color: stats.pix_pending > 0 ? 'text-yellow-600 bg-yellow-50' : 'text-gray-400 bg-gray-50' },
              { label: 'PIX confirmado', value: stats.pix_active, icon: BanknoteIcon, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Suspensos', value: stats.suspended_providers ?? 0, icon: AlertCircle, color: (stats.suspended_providers ?? 0) > 0 ? 'text-red-600 bg-red-50' : 'text-gray-400 bg-gray-50' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className={`card p-5 ${label === 'PIX pendente' && stats.pix_pending > 0 ? 'ring-2 ring-yellow-300' : ''} ${label === 'Suspensos' && (stats.suspended_providers ?? 0) > 0 ? 'ring-2 ring-red-300' : ''}`}>
                <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}><Icon size={18} /></div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{label}</div>
                {label === 'PIX pendente' && value > 0 && (
                  <button onClick={() => { setTab('subscriptions'); setSubStatus('pending'); }}
                    className="mt-2 text-xs text-yellow-700 underline font-medium">Ver agora →</button>
                )}
                {label === 'Suspensos' && value > 0 && (
                  <button onClick={() => { setTab('providers'); setProviderStatus('suspended'); }}
                    className="mt-2 text-xs text-red-700 underline font-medium">Ver agora →</button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200 p-1 rounded-xl w-fit mb-6">
          {(['providers', 'requests', 'subscriptions'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t === 'subscriptions' && <CreditCard size={14} />}
              {t === 'providers' ? 'Prestadores' : t === 'requests' ? 'Solicitações' : 'Assinaturas'}
            </button>
          ))}
        </div>

        {/* ── ABA PRESTADORES ── */}
        {tab === 'providers' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2 flex-wrap">
                {(['pending', 'approved', 'suspended', 'rejected'] as ProviderStatus[]).map((s) => (
                  <button key={s} onClick={() => setProviderStatus(s)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${providerStatus === s ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 text-gray-600 hover:border-primary-400'}`}>
                    {s === 'pending' ? 'Pendentes' : s === 'approved' ? 'Aprovados' : s === 'suspended' ? '🔒 Suspensos' : 'Rejeitados'}
                  </button>
                ))}
              </div>
              <button onClick={fetchProviders} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
                <RefreshCw size={14} /> Atualizar
              </button>
            </div>

            {loading ? (
              <div className="text-center py-16 text-gray-400">Carregando...</div>
            ) : providers.length === 0 ? (
              <div className="text-center py-16 text-gray-400"><AlertCircle size={32} className="mx-auto mb-2 opacity-40" />Nenhum prestador neste status</div>
            ) : (
              <div className="space-y-3">
                {providers.map((p) => {
                  const pExt = p as Provider & { pix_status?: string };
                  return (
                    <div key={p.id} className="card p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900">{p.name}</h3>
                            <span className="badge bg-gray-100 text-gray-600 text-xs">{p.category_name}</span>
                            <span className="badge bg-blue-50 text-blue-700 text-xs">{p.city}</span>
                            {pExt.pix_status === 'active'
                              ? <span className="badge bg-emerald-50 text-emerald-700 text-xs font-semibold">✅ PIX pago</span>
                              : pExt.pix_status === 'pending'
                              ? <span className="badge bg-yellow-50 text-yellow-700 text-xs font-semibold">⏳ PIX pendente</span>
                              : <span className="badge bg-red-50 text-red-600 text-xs font-semibold">❌ Sem PIX</span>}
                          </div>
                          <div className="mt-1 text-sm text-gray-500 flex flex-wrap gap-3">
                            <span>{p.email}</span><span>{p.phone}</span>
                            {p.experience_years > 0 && <span>{p.experience_years} ano(s)</span>}
                          </div>
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{p.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(p.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 flex-shrink-0">
                          <a
                            href={`https://wa.me/55${(p.whatsapp || p.phone).replace(/\D/g, '')}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 border border-green-200">
                            <MessageCircle size={12} /> WhatsApp
                          </a>
                          <button onClick={() => { setEditProviderError(''); setEditProvider({ id: p.id, name: p.name, email: p.email, phone: p.phone, whatsapp: p.whatsapp || '', city: p.city, neighborhood: p.neighborhood || '', description: p.description, experience_years: String(p.experience_years), category_slug: (p as Provider & { category_slug?: string }).category_slug || '' }); }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 border border-blue-200">
                            <Pencil size={12} /> Editar
                          </button>
                          <button onClick={() => { setConvertError(''); setConvertForm({ whatsapp: '', neighborhood: '', experience_years: '0', urgency: 'normal' }); setConvertProviderToReq({ id: p.id, name: p.name }); }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-xs font-medium hover:bg-violet-100 border border-violet-200">
                            <ArrowLeftRight size={12} /> → Solicitante
                          </button>
                          <button onClick={() => setDeleteProviderId(p.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 border border-red-200">
                            <Trash2 size={12} /> Excluir
                          </button>
                          {providerStatus === 'pending' && (
                            <>
                              <button disabled={actionLoading === p.id} onClick={() => updateProviderStatus(p.id, 'approved')}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50">
                                <Check size={13} /> Aprovar
                              </button>
                              <button disabled={actionLoading === p.id} onClick={() => updateProviderStatus(p.id, 'rejected')}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 disabled:opacity-50">
                                <X size={13} /> Rejeitar
                              </button>
                            </>
                          )}
                          {providerStatus === 'approved' && (
                            <button disabled={actionLoading === p.id} onClick={() => updateProviderStatus(p.id, 'rejected')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 disabled:opacity-50">
                              <X size={13} /> Desativar
                            </button>
                          )}
                          {providerStatus === 'suspended' && (
                            <button disabled={actionLoading === p.id} onClick={() => { setTab('subscriptions'); setSubStatus('expired'); }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-medium hover:bg-yellow-100 border border-yellow-200 disabled:opacity-50">
                              <QrCode size={13} /> Confirmar renovação PIX
                            </button>
                          )}
                          {providerStatus === 'rejected' && (
                            <button disabled={actionLoading === p.id} onClick={() => updateProviderStatus(p.id, 'approved')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50">
                              <Check size={13} /> Reativar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ABA SOLICITAÇÕES ── */}
        {tab === 'requests' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2 flex-wrap">
                {(['open', 'matched', 'closed'] as RequestStatus[]).map((s) => (
                  <button key={s} onClick={() => setRequestStatus(s)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${requestStatus === s ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 text-gray-600 hover:border-primary-400'}`}>
                    {s === 'open' ? 'Abertos' : s === 'matched' ? 'Em andamento' : 'Fechados'}
                  </button>
                ))}
              </div>
              <button onClick={fetchRequests} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
                <RefreshCw size={14} /> Atualizar
              </button>
            </div>
            {loading ? (
              <div className="text-center py-16 text-gray-400">Carregando...</div>
            ) : requests.length === 0 ? (
              <div className="text-center py-16 text-gray-400"><AlertCircle size={32} className="mx-auto mb-2 opacity-40" />Nenhuma solicitação neste status</div>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <div key={r.id} className="card p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{r.client_name}</h3>
                          <span className="badge bg-gray-100 text-gray-600 text-xs">{r.category_name}</span>
                          <span className="badge bg-blue-50 text-blue-700 text-xs">{r.city}</span>
                          {r.urgency && <span className={`badge text-xs ${URGENCY_LABELS[r.urgency]?.color}`}>{URGENCY_LABELS[r.urgency]?.label}</span>}
                        </div>
                        <div className="mt-1 text-sm text-gray-500 flex flex-wrap gap-3">
                          <span>{r.client_email}</span><span>{r.client_phone}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{r.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(r.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 flex-shrink-0">
                        <button onClick={() => { setEditRequestError(''); setEditRequest({ id: r.id, client_name: r.client_name, client_email: r.client_email, client_phone: r.client_phone, city: r.city, neighborhood: r.neighborhood || '', description: r.description, urgency: r.urgency || 'normal', category_name: r.category_name ?? '' }); }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 border border-blue-200">
                          <Pencil size={12} /> Editar
                        </button>
                        <button onClick={() => { setConvertError(''); setConvertForm({ whatsapp: '', neighborhood: '', experience_years: '0', urgency: 'normal' }); setConvertReqToProvider({ id: r.id, name: r.client_name }); }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-xs font-medium hover:bg-violet-100 border border-violet-200">
                          <ArrowLeftRight size={12} /> → Prestador
                        </button>
                        <button onClick={() => setDeleteRequestId(r.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 border border-red-200">
                          <Trash2 size={12} /> Excluir
                        </button>
                        {requestStatus === 'open' && (
                          <>
                            <button disabled={actionLoading === r.id} onClick={() => updateRequestStatus(r.id, 'matched')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-medium hover:bg-primary-700 disabled:opacity-50">
                              <ChevronDown size={13} /> Em andamento
                            </button>
                            <button disabled={actionLoading === r.id} onClick={() => updateRequestStatus(r.id, 'closed')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 disabled:opacity-50">
                              <X size={13} /> Fechar
                            </button>
                          </>
                        )}
                        {requestStatus === 'matched' && (
                          <button disabled={actionLoading === r.id} onClick={() => updateRequestStatus(r.id, 'closed')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 disabled:opacity-50">
                            <Check size={13} /> Concluir
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ABA ASSINATURAS ── */}
        {tab === 'subscriptions' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2 flex-wrap">
                {(['pending', 'active', 'expired', 'cancelled'] as SubStatus[]).map((s) => (
                  <button key={s} onClick={() => setSubStatus(s)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${subStatus === s ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 text-gray-600 hover:border-primary-400'}`}>
                    {s === 'pending' ? '🕐 Aguardando' : s === 'active' ? '✅ Ativas' : s === 'expired' ? '⏰ Expiradas' : '❌ Canceladas'}
                  </button>
                ))}
              </div>
              <button onClick={fetchSubscriptions} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
                <RefreshCw size={14} /> Atualizar
              </button>
            </div>

            {subStatus === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-800 mb-4 flex items-start gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                Verifique o comprovante no e-mail <strong className="ml-1">suporte@gde.com.br</strong> antes de confirmar o pagamento.
              </div>
            )}

            {loading ? (
              <div className="text-center py-16 text-gray-400">Carregando...</div>
            ) : subscriptions.length === 0 ? (
              <div className="text-center py-16 text-gray-400"><AlertCircle size={32} className="mx-auto mb-2 opacity-40" />Nenhuma assinatura neste status</div>
            ) : (
              <div className="space-y-3">
                {subscriptions.map((s) => (
                  <div key={s.id} className="card p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900">{s.provider_name}</h3>
                          <span className="badge bg-gray-100 text-gray-600 text-xs">{s.category_name}</span>
                          <span className="badge bg-green-50 text-green-700 text-xs font-bold">R$ {s.amount}/mês</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500 flex flex-wrap gap-3">
                          <span>{s.provider_email}</span><span>{s.provider_phone}</span>
                        </div>
                        {s.paid_at && <p className="text-xs text-gray-400 mt-1">Pago em: {new Date(s.paid_at).toLocaleDateString('pt-BR')}</p>}
                        {s.expires_at && <p className="text-xs text-gray-400">Expira em: {new Date(s.expires_at).toLocaleDateString('pt-BR')}</p>}
                        <p className="text-xs text-gray-400 mt-0.5">Cadastrado em: {new Date(s.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 flex-shrink-0">
                        <button onClick={() => { setEditSubError(''); setEditSub({ id: s.id, provider_name: s.provider_name, provider_email: s.provider_email, provider_phone: s.provider_phone, amount: s.amount, status: s.status }); }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 border border-blue-200">
                          <Pencil size={12} /> Editar
                        </button>
                        <button onClick={() => setDeleteSubId(s.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 border border-red-200">
                          <Trash2 size={12} /> Excluir
                        </button>
                        {subStatus === 'pending' && (
                          <>
                            <button disabled={actionLoading === s.id} onClick={() => updateSubStatus(s.id, 'active')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50">
                              <Check size={13} /> Confirmar PIX
                            </button>
                            <button disabled={actionLoading === s.id} onClick={() => updateSubStatus(s.id, 'cancelled')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 disabled:opacity-50">
                              <X size={13} /> Cancelar
                            </button>
                          </>
                        )}
                        {subStatus === 'active' && (
                          <button disabled={actionLoading === s.id} onClick={() => updateSubStatus(s.id, 'cancelled')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 disabled:opacity-50">
                            <X size={13} /> Cancelar
                          </button>
                        )}
                        {(subStatus === 'expired' || subStatus === 'cancelled') && (
                          <button disabled={actionLoading === s.id} onClick={() => updateSubStatus(s.id, 'active')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50">
                            <Check size={13} /> Reativar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
