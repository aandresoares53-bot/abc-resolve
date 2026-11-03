import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import { hotelsData, seasonalDates, packageTypes } from "@/lib/hotels-data";
import HotelCard from "@/components/HotelCard";

const regions = [
  { name: "Nordeste", emoji: "🌴", desc: "Praias, dunas e lagoas", hotels: 4, color: "#e67e22" },
  { name: "Sudeste", emoji: "🏙️", desc: "Cidades históricas e fazendas", hotels: 4, color: "#2980b9" },
  { name: "Sul", emoji: "❄️", desc: "Serra gaúcha e Gramado", hotels: 2, color: "#27ae60" },
  { name: "Centro-Oeste", emoji: "🌿", desc: "Chapada, Pantanal e Bonito", hotels: 2, color: "#16a085" },
  { name: "Norte", emoji: "🌳", desc: "Amazônia e ecoturismo", hotels: 1, color: "#8e44ad" },
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
    <main className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <Header />

      {/* Hero — compact Trivago style */}
      <section
        className="relative flex items-center justify-center pt-14"
        style={{
          background: "linear-gradient(135deg, #1a3a5c 0%, #0057b8 60%, #1a3a5c 100%)",
          minHeight: "320px",
        }}
      >
        <div className="relative z-10 text-center px-4 py-12 max-w-4xl mx-auto w-full">
          <p className="text-orange-300 text-sm font-semibold uppercase tracking-widest mb-3">
            Comparador de Hotéis e Pousadas no Brasil
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 leading-tight">
            Compare e economize na sua hospedagem
          </h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto mb-6">
            Buscamos os melhores preços em Booking.com, Hotels.com, Expedia e mais — tudo em um lugar só.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["🎄 Natal", "🎆 Réveillon", "🌴 Verão", "👨‍👩‍👧‍👦 Família", "💑 Casal", "🏖️ All-Inclusive"].map(item => (
              <a key={item} href="#buscar"
                className="bg-white/10 border border-white/20 text-white text-xs px-3 py-1.5 rounded-full hover:bg-white/20 transition-all">
                {item}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-200" style={{ backgroundColor: "var(--card-bg)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
            {stats.map(stat => (
              <div key={stat.label} className="py-4 px-6 text-center">
                <p className="text-xl font-black text-blue-900">{stat.value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search Section */}
      <SearchSection />

      {/* Seasonal Dates */}
      <section id="datas-sazonais" className="py-12 bg-white" style={{ backgroundColor: "var(--card-bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1" style={{ color: "var(--foreground)" }}>Datas & Épocas Especiais</h2>
          <p className="text-gray-500 text-sm mb-6">Pacotes exclusivos para cada período do ano</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {seasonalDates.map(s => (
              <a key={s.id} href="#buscar"
                className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100 hover:border-orange-300 hover:shadow-sm transition-all"
                style={{ backgroundColor: "var(--background)" }}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="font-semibold text-gray-800 text-sm" style={{ color: "var(--foreground)" }}>{s.label}</p>
                <p className="text-orange-500 text-xs mt-1 font-medium">Ver ofertas →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Package Types */}
      <section className="py-12" style={{ backgroundColor: "var(--background)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1" style={{ color: "var(--foreground)" }}>Pacotes para Cada Perfil</h2>
          <p className="text-gray-500 text-sm mb-6">Experiências personalizadas para família, casal e mais</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {packageTypes.map(p => (
              <a key={p.id} href="#buscar"
                className="bg-white rounded-xl p-4 text-center border border-gray-100 hover:border-orange-300 hover:shadow-sm transition-all"
                style={{ backgroundColor: "var(--card-bg)" }}>
                <div className="text-2xl mb-1.5">{p.icon}</div>
                <p className="font-semibold text-gray-700 text-xs" style={{ color: "var(--foreground)" }}>{p.label}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section id="promocoes" className="py-12 bg-white" style={{ backgroundColor: "var(--card-bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-800" style={{ color: "var(--foreground)" }}>Destaques & Promoções</h2>
              <p className="text-gray-500 text-sm">Selecionados com as melhores avaliações e descontos</p>
            </div>
            <a href="#buscar"
              className="px-4 py-1.5 border border-orange-500 text-orange-500 text-sm font-semibold rounded-full hover:bg-orange-500 hover:text-white transition-all">
              Ver todos →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {promotions.map(hotel => (
              <HotelCard key={hotel.id} hotel={hotel} variant="vertical" />
            ))}
          </div>
        </div>
      </section>

      {/* Regions */}
      <section id="regioes" className="py-12" style={{ backgroundColor: "var(--background)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1" style={{ color: "var(--foreground)" }}>Explore o Brasil Inteiro</h2>
          <p className="text-gray-500 text-sm mb-6">De Norte a Sul, cobrimos todos os destinos do país</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {regions.map(r => (
              <a key={r.name} href="#buscar"
                className="relative overflow-hidden rounded-xl p-5 text-white transition-all hover:opacity-90 hover:shadow-md"
                style={{ backgroundColor: r.color }}>
                <div className="text-3xl mb-2">{r.emoji}</div>
                <h3 className="font-bold text-base mb-0.5">{r.name}</h3>
                <p className="text-white/80 text-xs mb-3">{r.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="bg-black/20 text-white text-xs px-2 py-0.5 rounded-full font-medium">{r.hotels}+ destinos</span>
                  <span className="text-white/70 text-sm">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 bg-white border-t border-gray-100" style={{ backgroundColor: "var(--card-bg)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ color: "var(--foreground)" }}>Como funciona</h2>
          <p className="text-gray-500 text-sm mb-10">Em 3 passos você encontra a hospedagem perfeita</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "💬", title: "Descreva sua viagem", desc: "Informe destino, datas, número de pessoas e preferências" },
              { icon: "🔍", title: "Comparamos os preços", desc: "Buscamos em Booking, Hotels.com, Expedia e outros sites" },
              { icon: "✅", title: "Escolha e reserve", desc: "Compare avaliações e preços e reserve com segurança" },
            ].map(item => (
              <div key={item.title} className="flex flex-col items-center">
                <div className="w-14 h-14 bg-orange-50 border-2 border-orange-100 rounded-2xl flex items-center justify-center text-2xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-800 mb-1" style={{ color: "var(--foreground)" }}>{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12" style={{ backgroundColor: "var(--background)" }}>
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="text-3xl mb-3">📧</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2" style={{ color: "var(--foreground)" }}>Receba Promoções Exclusivas</h2>
          <p className="text-gray-500 text-sm mb-5">Cadastre-se e receba as melhores ofertas antes de todo mundo</p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input type="email" placeholder="seu@email.com"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:border-orange-400 text-sm"
              style={{ backgroundColor: "var(--card-bg)", color: "var(--foreground)" }} />
            <button className="px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all text-sm whitespace-nowrap">
              Cadastrar
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-3">Sem spam. Cancele quando quiser.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-0.5 mb-3">
                <span className="font-black text-white text-lg">encontrar</span>
                <span className="font-black text-orange-400 text-lg">hotéis</span>
              </div>
              <p className="text-gray-400 text-sm">Comparador de hotéis e pousadas em todo o Brasil.</p>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-xs uppercase tracking-wide text-gray-400">Destinos Populares</h4>
              <ul className="space-y-1.5 text-gray-400 text-sm">
                {[
                  { label: "Gramado", slug: "gramado" },
                  { label: "Florianópolis", slug: "florianopolis" },
                  { label: "Búzios", slug: "buzios" },
                  { label: "Porto de Galinhas", slug: "porto-de-galinhas" },
                  { label: "Jericoacoara", slug: "jericoacoara" },
                ].map(r => (
                  <li key={r.slug}><a href={`/hoteis/${r.slug}`} className="hover:text-orange-400 transition-colors">{r.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-xs uppercase tracking-wide text-gray-400">Pacotes</h4>
              <ul className="space-y-1.5 text-gray-400 text-sm">
                {["Família", "Casal", "Aventura", "All-Inclusive", "Lua de Mel"].map(p => (
                  <li key={p}><a href="#buscar" className="hover:text-orange-400 transition-colors">{p}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-xs uppercase tracking-wide text-gray-400">Datas Especiais</h4>
              <ul className="space-y-1.5 text-gray-400 text-sm">
                {["Natal & Réveillon", "Carnaval", "Semana Santa", "Férias de Julho", "Inverno"].map(d => (
                  <li key={d}><a href="#datas-sazonais" className="hover:text-orange-400 transition-colors">{d}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-gray-500 text-xs">© 2024 Encontrar Hotéis e Pousadas. Todos os direitos reservados.</p>
            <p className="text-gray-500 text-xs flex items-center gap-1.5">
              <span>🤖</span>
              <span>A.s Digital Design</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
