import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Star, Shield, Clock, ChevronRight, CheckCircle } from 'lucide-react';
import { getDB } from '@/lib/db';
import { StatsSection } from '@/components/StatsSection';
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel';

const COLORS = [
  'bg-orange-50 text-orange-600 border-orange-100',
  'bg-yellow-50 text-yellow-600 border-yellow-100',
  'bg-blue-50 text-blue-600 border-blue-100',
  'bg-purple-50 text-purple-600 border-purple-100',
  'bg-green-50 text-green-600 border-green-100',
  'bg-emerald-50 text-emerald-600 border-emerald-100',
  'bg-gray-50 text-gray-600 border-gray-200',
  'bg-indigo-50 text-indigo-600 border-indigo-100',
  'bg-pink-50 text-pink-600 border-pink-100',
  'bg-rose-50 text-rose-600 border-rose-100',
  'bg-red-50 text-red-600 border-red-100',
  'bg-violet-50 text-violet-600 border-violet-100',
  'bg-teal-50 text-teal-600 border-teal-100',
  'bg-cyan-50 text-cyan-600 border-cyan-100',
  'bg-lime-50 text-lime-600 border-lime-100',
  'bg-amber-50 text-amber-600 border-amber-100',
  'bg-sky-50 text-sky-600 border-sky-100',
  'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100',
];

const STEPS = [
  {
    step: '1',
    title: 'Descreva o serviço',
    desc: 'Conte o que você precisa, onde e quando. Leva menos de 2 minutos.',
    icon: Search,
  },
  {
    step: '2',
    title: 'Receba orçamentos',
    desc: 'Profissionais da sua região entram em contato com orçamentos personalizados.',
    icon: Star,
  },
  {
    step: '3',
    title: 'Escolha e contrate',
    desc: 'Compare avaliações, escolha o melhor profissional e feche o negócio.',
    icon: CheckCircle,
  },
];

const STATS = [
  { value: 'dynamic', label: 'Prestadores cadastrados', key: 'providers' },
  { value: '0', label: 'Serviços realizados' },
  { value: '7', label: 'Cidades atendidas' },
  { value: '0★', label: 'Avaliação média' },
];

export default async function HomePage() {
  const db = await getDB();
  const catRows = await db.prepare('SELECT name, slug, icon FROM categories ORDER BY name ASC').all<{ name: string; slug: string; icon: string }>();
  const categories = catRows.results;

  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/30">
                <Shield size={14} />
                Profissionais verificados no Grande ABC
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                Encontre o profissional certo para <span className="text-yellow-300">qualquer serviço</span>
              </h1>
              <p className="mt-5 text-lg md:text-xl text-primary-100 leading-relaxed max-w-2xl">
                Do eletricista ao professor particular — conectamos você a prestadores de serviço de confiança
                em Santo André, São Bernardo, São Caetano, Diadema e toda a região do ABC.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/solicitar-servico" className="btn-accent text-base py-4 px-8 shadow-lg">
                  Solicitar serviço gratuito
                </Link>
                <Link href="/cadastro-prestador" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-xl border border-white/40 transition-all duration-200 text-base text-center">
                  Sou prestador de serviço
                </Link>
              </div>
              <p className="mt-4 text-primary-200 text-sm flex items-center gap-1.5">
                <CheckCircle size={14} /> Grátis para clientes · Rápido · Sem compromisso
              </p>
            </div>
          </div>
        </section>

        {/* STATS */}
        <StatsSection stats={STATS} />

        {/* CATEGORIES */}
        <section id="categorias" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title">O que você precisa hoje?</h2>
              <p className="section-subtitle">Escolha a categoria e encontre o profissional ideal</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map(({ slug, name, icon }, i) => (
                <Link
                  key={slug}
                  href={`/solicitar-servico?categoria=${slug}`}
                  className={`card flex flex-col items-center gap-3 p-5 text-center border-2 ${COLORS[i % COLORS.length]} hover:scale-105 transition-transform duration-200 cursor-pointer`}
                >
                  <div className="p-2 rounded-xl bg-white/60 text-2xl">{icon}</div>
                  <span className="text-xs font-semibold leading-tight">{name}</span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/solicitar-servico" className="btn-primary inline-flex items-center gap-2">
                Ver todos os serviços <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="como-funciona" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="section-title">Como funciona</h2>
              <p className="section-subtitle">Em 3 passos simples você resolve tudo</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-primary-100" />
              {STEPS.map(({ step, title, desc, icon: Icon }) => (
                <div key={step} className="flex flex-col items-center text-center px-4">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center border-2 border-primary-100">
                      <Icon size={32} className="text-primary-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shadow">
                      {step}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/solicitar-servico" className="btn-primary text-base py-4 px-10">
                Começar agora — é grátis!
              </Link>
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="py-20 bg-primary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="section-title">Por que escolher o ABCResolve?</h2>
                <p className="mt-4 text-gray-500 leading-relaxed">
                  Somos a plataforma focada na região do Grande ABC. Conhecemos sua vizinhança.
                </p>
                <ul className="mt-8 space-y-5">
                  {[
                    { icon: Shield, title: 'Profissionais verificados', desc: 'Todos os prestadores passam por análise antes de aparecer na plataforma.' },
                    { icon: Clock, title: 'Resposta rápida', desc: 'Receba orçamentos em até 24 horas após sua solicitação.' },
                    { icon: Star, title: 'Avaliações reais', desc: 'Leia as opiniões de quem já contratou antes de decidir.' },
                    { icon: CheckCircle, title: '100% gratuito para clientes', desc: 'Você não paga nada para solicitar serviços e receber orçamentos.' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <li key={title} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-sm">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{title}</p>
                        <p className="text-gray-500 text-sm mt-0.5">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-primary-100">
                <h3 className="font-bold text-xl text-gray-900 mb-6">É prestador de serviço?</h3>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  Cadastre-se gratuitamente e receba pedidos de clientes na sua região. Você decide quais serviços aceitar.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Receba pedidos de clientes próximos',
                    'Mostre seus trabalhos e avaliações',
                    'Sem mensalidade — só quando fechar negócio',
                    'Atenda na sua cidade ou região',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/cadastro-prestador" className="btn-primary block text-center">
                  Quero me cadastrar como prestador
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <TestimonialsCarousel />

        {/* CTA FINAL */}
        <section className="py-20 bg-gradient-to-r from-primary-700 to-primary-500 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Pronto para resolver?
            </h2>
            <p className="text-primary-100 text-lg mb-8">
              Descreva o que você precisa e receba orçamentos de profissionais da sua região em minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/solicitar-servico" className="btn-accent text-base py-4 px-10 shadow-lg">
                Solicitar serviço agora
              </Link>
              <Link href="/cadastro-prestador" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-10 py-4 rounded-xl border border-white/40 transition-all duration-200">
                Cadastrar como prestador
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
