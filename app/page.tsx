import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import { hotelsData, seasonalDates, packageTypes } from "@/lib/hotels-data";
import HotelCard from "@/components/HotelCard";

const regions = [
  { name: "Nordeste", emoji: "🌴", desc: "Praias paradisíacas, dunas e lagoas", hotels: 4, color: "from-orange-400 to-rose-400" },
  { name: "Sudeste", emoji: "🏙️", desc: "Cidades históricas, fazendas e praias", hotels: 4, color: "from-blue-400 to-indigo-500" },
  { name: "Sul", emoji: "❄️", desc: "Serra gaúcha, Gramado e Floripa", hotels: 2, color: "from-emerald-400 to-teal-500" },
  { name: "Centro-Oeste", emoji: "🌿", desc: "Chapada, Pantanal e Bonito", hotels: 2, color: "from-green-400 to-emerald-600" },
  { name: "Norte", emoji: "🌳", desc: "Floresta Amazônica e ecoturismo", hotels: 1, color: "from-amber-400 to-orange-500" },
];

const stats = [
  { value: "12.000+", label: "Hotéis e Pousadas" },
  { value: "5.570", label: "Cidades Cobertas" },
  { value: "R$890M", label: "Em economias geradas" },
  { value: "4.8★", label: "Avaliação média" },
];

export default function Home() {
  const promotions = hotelsData.filter(h => h.discount && h.discount >= 20).slice(0, 6);

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full" />
            <span>🤖 IA buscando as melhores ofertas em tempo real</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Encontre o hotel
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              perfeito para você
            </span>
          </h1>

          <p className="text-white/70 text-lg sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Nossa Inteligência Artificial busca os melhores hotéis e pousadas do Brasil
            com promoções exclusivas, pacotes para família e ofertas sazonais em todas as épocas do ano.
          </p>

          <div className="max-w-2xl mx-auto mb-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex gap-2">
              <a href="#buscar" className="flex-1 px-4 py-3 bg-transparent text-white/50 text-sm sm:text-base cursor-pointer flex items-center">
                Para onde você quer ir?
              </a>
              <a href="#buscar" className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm">
                ✨ Buscar
              </a>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {["🎄 Natal","🎆 Réveillon","🌴 Verão","👨‍👩‍👧‍👦 Família","💑 Casal","🏖️ All-Inclusive"].map(item => (
              <a key={item} href="#buscar" className="bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:text-white text-xs sm:text-sm px-3 py-1.5 rounded-full hover:bg-white/20 transition-all">
                {item}
              </a>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map(stat => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
                <p className="text-2xl sm:text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-white/60 text-xs sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Search Section */}
      <SearchSection />

      {/* Seasonal Dates */}
      <section id="datas-sazonais" className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Datas & Épocas Especiais</h2>
            <p className="text-gray-500 text-lg">Promoções e pacotes exclusivos para cada período do ano</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {seasonalDates.map(s => (
              <a key={s.id} href="#buscar" className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
                <div className="text-4xl mb-3">{s.icon}</div>
                <p className="font-bold text-gray-800 text-sm">{s.label}</p>
                <p className="text-blue-600 text-xs mt-1 font-medium">Ver ofertas →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Package Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Pacotes para Cada Perfil</h2>
            <p className="text-gray-500 text-lg">Experiências personalizadas para família, casal e muito mais</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {packageTypes.map(p => (
              <a key={p.id} href="#buscar" className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 text-center hover:from-blue-100 hover:to-purple-100 border border-blue-100 transition-all">
                <div className="text-3xl mb-2">{p.icon}</div>
                <p className="font-bold text-gray-800 text-sm">{p.label}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section id="promocoes" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">Destaques & Promoções</h2>
              <p className="text-gray-500">Selecionados pela IA com as melhores avaliações e descontos</p>
            </div>
            <a href="#buscar" className="px-5 py-2.5 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all text-sm">Ver todos →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map(hotel => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* Regions */}
      <section id="regioes" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Explore o Brasil Inteiro</h2>
            <p className="text-gray-500 text-lg">De Norte a Sul, cobrimos todos os destinos do país</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {regions.map(r => (
              <a key={r.name} href="#buscar" className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${r.color} text-white transition-all`}>
                <div className="text-4xl mb-3">{r.emoji}</div>
                <h3 className="font-black text-lg mb-1">{r.name}</h3>
                <p className="text-white/80 text-xs mb-3">{r.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-medium">{r.hotels}+ destinos</span>
                  <span className="text-white/80">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Como Funciona a Busca com IA</h2>
          <p className="text-white/70 text-lg mb-12">Em 3 passos simples você encontra a acomodação perfeita</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: "💬", title: "Descreva sua viagem", desc: "Fale em linguagem natural: destino, datas, número de pessoas e preferências" },
              { icon: "🤖", title: "IA faz a busca", desc: "Nossa inteligência artificial analisa milhares de opções e filtra as mais relevantes" },
              { icon: "✅", title: "Escolha e reserve", desc: "Compare preços, avaliações e promoções exclusivas e reserve com segurança" },
            ].map(item => (
              <div key={item.title} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">{item.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-4xl mb-4">📧</div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">Receba Promoções Exclusivas</h2>
          <p className="text-gray-500 mb-6">Cadastre-se e nossa IA te avisa das melhores ofertas sazonais antes de todo mundo</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input type="email" placeholder="seu@email.com" className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-gray-800 text-sm" />
            <button className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm whitespace-nowrap">Cadastrar</button>
          </div>
          <p className="text-gray-400 text-xs mt-3">Sem spam. Apenas as melhores ofertas.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🏨</span>
                <div>
                  <p className="font-bold text-white">Encontrar</p>
                  <p className="text-blue-400 font-bold text-sm">Hotéis & Pousadas</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Busca inteligente com IA para hotéis e pousadas em todo o Brasil.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-300">Destinos</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {["Nordeste","Sudeste","Sul","Centro-Oeste","Norte"].map(r => (
                  <li key={r}><a href="#regioes" className="hover:text-blue-400 transition-colors">{r}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-300">Pacotes</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {["Família","Casal","Aventura","All-Inclusive","Lua de Mel"].map(p => (
                  <li key={p}><a href="#buscar" className="hover:text-blue-400 transition-colors">{p}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wide text-gray-300">Datas Especiais</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {["Natal & Réveillon","Carnaval","Semana Santa","Férias de Julho","Inverno"].map(d => (
                  <li key={d}><a href="#datas-sazonais" className="hover:text-blue-400 transition-colors">{d}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2024 Encontrar Hotéis e Pousadas. Todos os direitos reservados.</p>
            <p className="text-gray-500 text-sm flex items-center gap-2"><span>🤖</span><span>Powered by Inteligência Artificial</span></p>
          </div>
        </div>
      </footer>
    </main>
  );
}
