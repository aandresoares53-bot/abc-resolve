'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Loader2, ChevronLeft, Shield, Star, Clock } from 'lucide-react';
import Link from 'next/link';
import { ABC_CITIES } from '@/lib/cities';

export default function CadastroPrestadorPage() {
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    city: '',
    neighborhood: '',
    category_slug: '',
    description: '',
    experience_years: '0',
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
      const res = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar cadastro');
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <>
        <Header />
        <main className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Cadastro realizado!</h2>
            <p className="text-gray-500 mb-6">
              Agora ative seu perfil pagando a assinatura mensal de <strong>R$ 19,90</strong> via PIX.
              Após a confirmação do pagamento, seu perfil ficará visível para os clientes em até 24h.
            </p>
            <Link href="/assinatura" className="btn-primary inline-block w-full mb-3">
              Pagar assinatura via PIX →
            </Link>
            <Link href="/" className="block text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Fazer depois
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6">
            <ChevronLeft size={16} /> Voltar
          </Link>

          <div className="grid md:grid-cols-5 gap-10">
            {/* Info sidebar */}
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Cadastre-se como prestador</h1>
              <p className="text-gray-500 mb-8">Comece a receber pedidos de clientes na sua região. Gratuito para começar.</p>
              <div className="space-y-5">
                {[
                  { icon: Shield, title: 'Perfil verificado', desc: 'Seu cadastro é analisado pela nossa equipe.' },
                  { icon: Star, title: 'Avaliações visíveis', desc: 'Clientes veem suas avaliações antes de contratar.' },
                  { icon: Clock, title: 'Receba pedidos 24h', desc: 'Notificações de novos clientes na sua área.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="md:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="label">Nome completo *</label>
                  <input className="input" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="João Silva" />
                </div>
                <div>
                  <label className="label">E-mail *</label>
                  <input className="input" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="joao@email.com" />
                </div>
                <div>
                  <label className="label">Telefone *</label>
                  <input className="input" required value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(11) 99999-9999" />
                </div>
                <div>
                  <label className="label">WhatsApp</label>
                  <input className="input" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="(11) 99999-9999" />
                </div>
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
                <div>
                  <label className="label">Área de atuação *</label>
                  <select className="input" required value={form.category_slug} onChange={(e) => set('category_slug', e.target.value)}>
                    <option value="">Selecione...</option>
                    {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Anos de experiência</label>
                  <select className="input" value={form.experience_years} onChange={(e) => set('experience_years', e.target.value)}>
                    <option value="0">Menos de 1 ano</option>
                    <option value="1">1 ano</option>
                    <option value="2">2 anos</option>
                    <option value="3">3 anos</option>
                    <option value="5">5 anos</option>
                    <option value="10">10+ anos</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Descreva seus serviços *</label>
                  <textarea
                    className="input resize-none h-32"
                    required
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    placeholder="Ex: Eletricista com 10 anos de experiência em instalações residenciais e comerciais. Especializado em ar-condicionado, quadros elétricos e iluminação."
                  />
                  <p className="text-xs text-gray-400 mt-1">Descreva sua experiência e os serviços que oferece.</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Enviando...</> : 'Enviar cadastro'}
              </button>
              <p className="text-center text-xs text-gray-400">
                Ao enviar, você concorda com nossos <Link href="/termos" className="underline">termos de uso</Link>. Análise em até 48h.
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
