import Link from 'next/link'
import {
  FileText,
  Users,
  BarChart3,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Download,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">Orçamento Fácil</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Entrar
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>Mais de 5.000 profissionais já usam</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Orçamentos profissionais{' '}
            <span className="text-blue-600">em minutos</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Crie, envie e gerencie orçamentos para seus clientes de forma simples.
            Feito para eletricistas, encanadores, pintores e todos os profissionais de serviços.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Comece gratuitamente
            </Link>
            <Link
              href="#como-funciona"
              className="bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-200 hover:border-gray-300 transition-all"
            >
              Ver como funciona
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">Sem cartão de crédito • Plano gratuito disponível</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: '5.000+', label: 'Profissionais' },
              { value: '200.000+', label: 'Orçamentos gerados' },
              { value: '4.9/5', label: 'Avaliação média' },
              { value: '98%', label: 'Taxa de satisfação' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-blue-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Como funciona</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Três passos simples para começar a enviar orçamentos profissionais</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <Users className="w-6 h-6 text-blue-600" />,
                title: 'Cadastre seus clientes',
                desc: 'Adicione seus clientes com nome, telefone e endereço. Organize sua carteira de clientes.',
              },
              {
                step: '02',
                icon: <FileText className="w-6 h-6 text-blue-600" />,
                title: 'Crie seu orçamento',
                desc: 'Adicione serviços, produtos e mão de obra. O sistema calcula tudo automaticamente.',
              },
              {
                step: '03',
                icon: <Download className="w-6 h-6 text-blue-600" />,
                title: 'Envie e acompanhe',
                desc: 'Gere o PDF, envie por WhatsApp ou link público. Acompanhe aprovações em tempo real.',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-blue-50 rounded-2xl p-8">
                  <div className="text-5xl font-bold text-blue-100 mb-4">{item.step}</div>
                  <div className="bg-white rounded-xl w-12 h-12 flex items-center justify-center shadow-sm mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tudo que você precisa</h2>
            <p className="text-gray-600">Funcionalidades pensadas para profissionais autônomos e pequenas empresas</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <FileText className="w-5 h-5" />, title: 'PDF Profissional', desc: 'Gere PDFs com sua logo, dados da empresa e layout profissional.' },
              { icon: <Users className="w-5 h-5" />, title: 'Gestão de Clientes', desc: 'Cadastre e organize seus clientes com histórico completo.' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Relatórios', desc: 'Acompanhe seus números com gráficos e estatísticas.' },
              { icon: <CheckCircle className="w-5 h-5" />, title: 'Aprovação Online', desc: 'Clientes aprovam ou recusam orçamentos pelo link público.' },
              { icon: <Shield className="w-5 h-5" />, title: 'Catálogo de Serviços', desc: 'Salve seus serviços e produtos para usar nos orçamentos.' },
              { icon: <Zap className="w-5 h-5" />, title: 'WhatsApp', desc: 'Envie orçamentos direto pelo WhatsApp com um clique.' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="bg-blue-100 text-blue-600 rounded-lg w-10 h-10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Planos e Preços</h2>
            <p className="text-gray-600">Comece gratuitamente. Evolua quando precisar.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Grátis',
                price: 'R$ 0',
                period: '/mês',
                desc: 'Para quem está começando',
                features: ['5 orçamentos/mês', '10 clientes', '5 serviços', 'PDF básico', 'Link público'],
                cta: 'Começar grátis',
                highlight: false,
              },
              {
                name: 'Pro',
                price: 'R$ 29,90',
                period: '/mês',
                desc: 'Para autônomos ativos',
                features: ['Orçamentos ilimitados', 'Clientes ilimitados', 'Catálogo completo', 'PDF personalizado', 'Relatórios avançados', 'Suporte prioritário'],
                cta: 'Assinar Pro',
                highlight: true,
              },
              {
                name: 'Business',
                price: 'R$ 59,90',
                period: '/mês',
                desc: 'Para pequenas empresas',
                features: ['Tudo do Pro', 'Múltiplos usuários', 'Logo personalizada', 'API de integração', 'Relatórios customizados', 'Suporte dedicado'],
                cta: 'Assinar Business',
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border ${plan.highlight
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200'
                  : 'bg-white border-gray-200'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-500'}`}>
                  {plan.desc}
                </div>
                <div className="text-2xl font-bold mb-1">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-blue-200' : 'text-gray-500'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-blue-200' : 'text-blue-500'}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-3 rounded-xl font-semibold transition-all ${plan.highlight
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Preciso de cartão de crédito para começar?',
                a: 'Não! O plano gratuito não exige cartão de crédito. Comece agora mesmo.',
              },
              {
                q: 'Posso personalizar o PDF com minha logo?',
                a: 'Sim! No plano Pro e Business você pode adicionar sua logo e personalizar o layout do orçamento.',
              },
              {
                q: 'Como meu cliente aprova o orçamento?',
                a: 'Cada orçamento tem um link único. Seu cliente acessa o link e clica em "Aprovar" ou "Rejeitar".',
              },
              {
                q: 'Posso cancelar a qualquer momento?',
                a: 'Sim, sem fidelidade. Cancele quando quiser direto no painel.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{faq.q}</h3>
                    <p className="text-gray-600 text-sm">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para profissionalizar seus orçamentos?
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            Junte-se a milhares de profissionais que já economizam tempo com o Orçamento Fácil.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all shadow-lg"
          >
            Comece gratuitamente agora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-lg font-bold text-blue-600">Orçamento Fácil</span>
            <p className="text-gray-500 text-sm">© 2024 Orçamento Fácil. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link href="/login" className="text-gray-500 hover:text-gray-700 text-sm">Entrar</Link>
              <Link href="/register" className="text-gray-500 hover:text-gray-700 text-sm">Cadastrar</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
