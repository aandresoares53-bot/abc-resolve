import Header from '@/components/Header'
import Link from 'next/link'
import { hotelsData } from '@/lib/hotels-data'
import HotelCard from '@/components/HotelCard'

const destinosData: Record<string, {
  name: string, state: string, emoji: string,
  description: string, bestTime: string, climate: string,
  activities: string[], tips: string[], image: string
}> = {
  "gramado": {
    name: "Gramado", state: "RS", emoji: "🏔️",
    description: "A mais europeia das cidades brasileiras, Gramado encanta com seu charme alemão, chocolates artesanais e o famoso Festival de Cinema.",
    bestTime: "Junho a Agosto (Inverno, neve ocasional)",
    climate: "Temperado, com invernos frios (pode nevar) e verões amenos",
    activities: ["Mini Mundo", "Snowland", "Lago Negro", "Parque Caracol", "Rua Coberta", "Aldeia do Papai Noel"],
    tips: ["Reserve com meses de antecedência no Natal Luz", "Visite as chocolaterias na Rua Coberta", "Faça passeio de teleférico no Parque Caracol"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
  },
  "bonito": {
    name: "Bonito", state: "MS", emoji: "🐟",
    description: "Capital do Ecoturismo, Bonito impressiona com suas águas cristalinas, flutuação em rios e cavernas de cristal únicas no mundo.",
    bestTime: "Junho a Setembro (inverno seco)",
    climate: "Tropical com seca no inverno — melhor época para flutuação",
    activities: ["Flutuação no Rio da Prata", "Gruta do Lago Azul", "Abismo Anhumas", "Baía Bonita", "Recanto Ecológico"],
    tips: ["Atividades têm cota diária — reserve com antecedência", "Contrate agência local para pacotes", "Leve protetor solar biodegradável"],
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200&q=80"
  },
  "fernando-de-noronha": {
    name: "Fernando de Noronha", state: "PE", emoji: "🏝️",
    description: "Paraíso ecológico no meio do Atlântico, Noronha tem as melhores praias do Brasil e águas turquesa com tartarugas e golfinhos.",
    bestTime: "Agosto a Março (mar calmo, boa visibilidade)",
    climate: "Tropical oceânico, quente o ano todo. Chove de março a agosto.",
    activities: ["Baía do Sancho", "Mergulho com golfinhos", "Baía dos Porcos", "Mirante dos Golfinhos", "Trilha do Atalaia"],
    tips: ["Taxa de Preservação Ambiental obrigatória", "Reserve passagens e pousadas com 6+ meses", "Limite de turistas por dia nas praias"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
  },
  "jericoacoara": {
    name: "Jericoacoara", state: "CE", emoji: "🌅",
    description: "Vila rústica no litoral do Ceará, Jeri é famosa pelo pôr do sol na Duna do Pôr do Sol, kitesurf e lagoas paradisíacas.",
    bestTime: "Agosto a Dezembro (ventos para kitesurf)",
    climate: "Tropical semiárido, quente e seco na maior parte do ano",
    activities: ["Duna do Pôr do Sol", "Lagoa do Paraíso", "Lagoa Azul", "Kitesurf", "Passeio de Buggy"],
    tips: ["Acesso por estrada de areia — use transfer local", "Ruas são de areia — esqueça o salto", "Noites frescas — leve uma blusa"],
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80"
  },
  "pantanal": {
    name: "Pantanal", state: "MS", emoji: "🐊",
    description: "A maior planície inundável do mundo, o Pantanal é o melhor lugar do Brasil para ver animais selvagens: onças, capivaras, tuiuiús e muito mais.",
    bestTime: "Maio a Setembro (seca — animais concentrados perto da água)",
    climate: "Tropical continental, com seca no inverno e cheias no verão",
    activities: ["Safari fotográfico", "Pesca esportiva", "Observação de onças", "Passeio de barco", "Cavalgada"],
    tips: ["Hospede-se em fazendas-pousadas para melhor experiência", "Leve repelente potente", "Roupas claras e neutras para safári"],
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80"
  },
  "ouro-preto": {
    name: "Ouro Preto", state: "MG", emoji: "🏛️",
    description: "Patrimônio da Humanidade, Ouro Preto é a joia do Barroco brasileiro com igrejas douradas, museus e casarões coloniais do século XVIII.",
    bestTime: "Março a Maio / Setembro a Novembro (clima ameno, menos chuva)",
    climate: "Subtropical de altitude, com invernos secos e verões chuvosos",
    activities: ["Igreja São Francisco de Assis", "Museu do Ouro", "Mina do Chico Rei", "Praça Tiradentes", "Trilha da Cachoeira"],
    tips: ["Use calçado confortável — ruas de pedra íngreme", "Reserve para Carnaval e Semana Santa com meses de antecedência", "Visite Mariana de carro ou trem"],
    image: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=1200&q=80"
  },
  "lencois-maranhenses": {
    name: "Lençóis Maranhenses", state: "MA", emoji: "🏜️",
    description: "Um dos cenários mais surreais do planeta: dunas brancas gigantes cobertas de lagoas azuis e verdes formadas pelas chuvas.",
    bestTime: "Junho a Setembro (lagoas cheias após as chuvas)",
    climate: "Semiárido com chuvas concentradas de janeiro a junho",
    activities: ["Lagoa Azul", "Lagoa Bonita", "Passeio de Buggy", "Travessia completa", "Lagoa Vermelha"],
    tips: ["Acesse pela cidade de Barreirinhas", "Reserve guia local — área é vasta e sem sinalização", "Lagoas secam de outubro a dezembro"],
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1200&q=80"
  },
  "foz-do-iguacu": {
    name: "Foz do Iguaçu", state: "PR", emoji: "💧",
    description: "As maiores cataratas do mundo, com 275 quedas d'água e 2,7 km de extensão. Uma das Sete Maravilhas da Natureza.",
    bestTime: "Março a Novembro (correnteza forte e vazão maior após chuvas de jan/fev)",
    climate: "Subtropical úmido, com verões quentes e chuvosos",
    activities: ["Cataratas lado brasileiro", "Cataratas lado argentino", "Garganta do Diabo", "Macuco Safari (barco)", "Parque das Aves"],
    tips: ["Visite os dois lados (Brasil e Argentina)", "Leve capa de chuva para o Macuco Safari", "Compre ingressos online antecipadamente"],
    image: "https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?w=1200&q=80"
  },
}

export async function generateStaticParams() {
  return Object.keys(destinosData).map(slug => ({ slug }))
}

export default function DestinoPage({ params }: { params: { slug: string } }) {
  const destino = destinosData[params.slug]
  if (!destino) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <Header />
        <div className="text-center">
          <p className="text-6xl mb-4">🗺️</p>
          <h1 className="text-2xl font-black text-gray-900 mb-3">Destino não encontrado</h1>
          <Link href="/" className="text-blue-600 hover:underline">← Voltar para a busca</Link>
        </div>
      </main>
    )
  }

  const localHotels = hotelsData.filter(h =>
    h.city.toLowerCase().includes(destino.name.toLowerCase()) ||
    h.state === destino.state
  ).slice(0, 3)

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Header />
      <div style={{ height: '420px', overflow: 'hidden', position: 'relative', marginTop: '64px' }}>
        <img src={destino.image} alt={destino.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.75))' }}>
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem' }}>
            <span style={{ fontSize: '3rem' }}>{destino.emoji}</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', margin: '0 0 4px' }}>{destino.name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>{destino.state} · Guia Completo de Viagem</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">{destino.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-blue-50 rounded-2xl p-5">
            <h3 className="font-bold text-blue-800 mb-2">🌤️ Clima</h3>
            <p className="text-blue-700 text-sm leading-relaxed">{destino.climate}</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-5">
            <h3 className="font-bold text-emerald-800 mb-2">📅 Melhor época para visitar</h3>
            <p className="text-emerald-700 text-sm leading-relaxed">{destino.bestTime}</p>
          </div>
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-4">O que fazer em {destino.name}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          {destino.activities.map(a => (
            <div key={a} className="bg-white border border-gray-100 rounded-xl p-3 text-sm text-gray-700 shadow-sm hover:border-blue-200 transition-colors">
              ✨ {a}
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-4">Dicas importantes</h2>
        <ul className="space-y-3 mb-10">
          {destino.tips.map(t => (
            <li key={t} className="flex gap-3 text-gray-600 bg-amber-50 rounded-xl p-3 text-sm">
              <span className="text-amber-500 font-bold">💡</span>{t}
            </li>
          ))}
        </ul>

        {localHotels.length > 0 && (
          <>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Onde se hospedar em {destino.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {localHotels.map(h => <HotelCard key={h.id} hotel={h} />)}
            </div>
          </>
        )}

        <div className="flex gap-3 flex-wrap">
          <Link href="/" className="inline-block px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all">
            ← Voltar para busca
          </Link>
          <Link href="/mapa" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
            🗺️ Ver no mapa
          </Link>
        </div>
      </div>
    </main>
  )
}
