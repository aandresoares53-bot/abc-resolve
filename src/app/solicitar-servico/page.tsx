'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Loader2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { ABC_CITIES } from '@/lib/cities';

function SolicitarForm() {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get('categoria') || '';

  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    city: '',
    neighborhood: '',
    category_slug: categoriaParam,
    description: '',
    urgency: 'normal',
  });

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json() as Promise<{ categories: { slug: string; name: string }[] }>)
      .then((d) => setCategories(d.categories));
  }, []);

  function set(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar solicitação');
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Solicitação enviada!</h2>
          <p className="text-gray-500 mb-6">
            Sua solicitação foi recebida. Prestadores da sua região entrarão em contato em breve.
            Fique de olho no seu e-mail e telefone.
          </p>
          <Link href="/" className="btn-primary inline-block">Voltar para a página inicial</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6">
        <ChevronLeft size={16} /> Voltar
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Solicitar serviço</h1>
      <p className="text-gray-500 mb-8">Preencha os dados abaixo e receba orçamentos gratuitamente.</p>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Seu nome *</label>
            <input className="input" required value={form.client_name} onChange={(e) => set('client_name', e.target.value)} placeholder="João Silva" />
          </div>
          <div>
            <label className="label">Telefone / WhatsApp *</label>
            <input className="input" required value={form.client_phone} onChange={(e) => set('client_phone', e.target.value)} placeholder="(11) 99999-9999" />
          </div>
        </div>

        <div>
          <label className="label">E-mail *</label>
          <input className="input" type="email" required value={form.client_email} onChange={(e) => set('client_email', e.target.value)} placeholder="joao@email.com" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Cidade *</label>
            <select className="input" required value={form.city} onChange={(e) => set('city', e.target.value)}>
              <option value="">Selecione...</option>
              {ABC_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Bairro</label>
            <input className="input" value={form.neighborhood} onChange={(e) => set('neighborhood', e.target.value)} placeholder="Seu bairro" />
          </div>
        </div>

        <div>
          <label className="label">Categoria do serviço *</label>
          <select className="input" required value={form.category_slug} onChange={(e) => set('category_slug', e.target.value)}>
            <option value="">Selecione a categoria...</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Descreva o serviço *</label>
          <textarea
            className="input resize-none h-32"
            required
            minLength={20}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Ex: Preciso de um eletricista para instalar 3 tomadas e trocar a fiação da sala. O imóvel é um apartamento de 70m² em Santo André."
          />
          <p className="text-xs text-gray-400 mt-1">Mínimo 20 caracteres. Quanto mais detalhes, melhor o orçamento.</p>
        </div>

        <div>
          <label className="label">Urgência</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'urgent', label: '🔴 Urgente', desc: 'Hoje ou amanhã' },
              { value: 'normal', label: '🟡 Normal', desc: 'Esta semana' },
              { value: 'flexible', label: '🟢 Flexível', desc: 'Sem pressa' },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-all ${form.urgency === opt.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <input type="radio" name="urgency" value={opt.value} className="sr-only" checked={form.urgency === opt.value} onChange={() => set('urgency', opt.value)} />
                <div className="font-medium text-sm">{opt.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base">
          {loading ? <><Loader2 size={18} className="animate-spin" /> Enviando...</> : 'Solicitar orçamentos gratuitos'}
        </button>

        <p className="text-center text-xs text-gray-400">
          Ao enviar, você concorda com nossos <Link href="/termos" className="underline">termos de uso</Link>.
        </p>
      </form>
    </div>
  );
}

export default function SolicitarServicoPage() {
  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <Suspense>
          <SolicitarForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
