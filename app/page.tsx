'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

const services = [
  { icon: '🔧', label: 'Encanador' },
  { icon: '⚡', label: 'Eletricista' },
  { icon: '🎨', label: 'Pintor' },
  { icon: '🪚', label: 'Carpinteiro' },
  { icon: '🌿', label: 'Jardineiro' },
  { icon: '🧹', label: 'Limpeza' },
  { icon: '❄️', label: 'Ar Condicionado' },
  { icon: '🏠', label: 'Reparos Gerais' },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ABCResolve</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login?type=consumer" className="text-gray-600 hover:text-blue-600 font-medium transition text-sm">
              Entrar
            </Link>
            <Link href="/register?type=provider" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm">
              Sou Prestador
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-300 rounded-full filter blur-3xl"></div>
        </div>
        <div className="relative container mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/30">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Mais de 500 prestadores na região do ABC
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Encontre o profissional<br />
            <span className="text-yellow-300">certo para você</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Conecte-se com prestadores de serviços confiáveis em Santo André, São Bernardo, São Caetano e toda a região do Grande ABC.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/login?type=consumer')}
              className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition shadow-lg text-lg"
            >
              🔍 Buscar Serviços
            </button>
            <button
              onClick={() => router.push('/register?type=provider')}
              className="bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-300 transition shadow-lg text-lg"
            >
              💼 Sou Prestador
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="relative border-t border-white/20">
          <div className="container mx-auto px-6 py-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-extrabold text-yellow-300">500+</div>
              <div className="text-blue-200 text-sm mt-1">Prestadores</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-yellow-300">6</div>
              <div className="text-blue-200 text-sm mt-1">Cidades</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-yellow-300">4.8★</div>
              <div className="text-blue-200 text-sm mt-1">Avaliação média</div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Como funciona</h2>
            <p className="text-gray-500 text-lg">Simples, rápido e seguro</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: '🔍', title: 'Busque o serviço', desc: 'Escolha o tipo de serviço e a cidade. Veja todos os prestadores disponíveis na sua região.' },
              { step: '2', icon: '👤', title: 'Escolha o profissional', desc: 'Compare perfis, avaliações e entre em contato diretamente com o prestador.' },
              { step: '3', icon: '✅', title: 'Contrate com segurança', desc: 'Combine o serviço, agende e avalie após a conclusão.' },
            ].map(item => (
              <div key={item.step} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow">
                  {item.step}
                </div>
                <div className="text-5xl mb-5 mt-2">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Serviços disponíveis</h2>
            <p className="text-gray-500 text-lg">Encontre profissionais para qualquer necessidade</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {services.map(s => (
              <button
                key={s.label}
                onClick={() => router.push('/login?type=consumer')}
                className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition group"
              >
                <span className="text-4xl group-hover:scale-110 transition">{s.icon}</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">{s.label}</span>
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/login?type=consumer')}
              className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Ver todos os serviços →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Prestador */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="text-5xl mb-6">💼</div>
          <h2 className="text-3xl font-bold mb-4">É prestador de serviços?</h2>
          <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
            Cadastre-se gratuitamente e comece a receber clientes hoje mesmo. Milhares de consumidores buscam profissionais na sua região.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?type=provider"
              className="bg-white text-green-700 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition shadow-lg text-lg"
            >
              Criar conta grátis
            </Link>
            <Link
              href="/login?type=provider"
              className="bg-green-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-green-400 transition shadow-lg text-lg border-2 border-white/30"
            >
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="text-white font-bold text-lg">ABCResolve</span>
          </div>
          <p className="text-sm">Conectando profissionais e clientes no Grande ABC</p>
          <p className="text-xs mt-4 text-gray-600">© 2025 ABCResolve. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
