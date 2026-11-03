import { hotelsData } from "@/lib/hotels-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import HotelCard from "@/components/HotelCard";
import Header from "@/components/Header";
import WeatherWidget from "@/components/WeatherWidget";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const hotel = hotelsData.find(h => h.id === params.id);
  if (!hotel) return {};
  return {
    title: `${hotel.name} — ${hotel.city}, ${hotel.state} | Encontrar Hotéis`,
    description: hotel.description.slice(0, 155),
    openGraph: {
      title: hotel.name,
      description: hotel.description.slice(0, 155),
      images: [hotel.image],
      type: "website",
    },
  };
}

export default function HotelPage({ params }: { params: { id: string } }) {
  const hotel = hotelsData.find(h => h.id === params.id);
  if (!hotel) notFound();

  const similar = hotelsData
    .filter(h => h.id !== hotel.id && (h.city === hotel.city || h.state === hotel.state))
    .slice(0, 3);

  const extraImages = [
    hotel.image,
    `https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80`,
    `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80`,
    `https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80`,
  ];

  // Default dates: tomorrow check-in, day after check-out
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const checkIn = fmt(tomorrow);
  const checkOut = fmt(dayAfter);
  const adults = 2; const children = 0; const rooms = 1;

  const nameCityState = encodeURIComponent(`${hotel.name}, ${hotel.city}, ${hotel.state}`);
  const nameCity = encodeURIComponent(`${hotel.name} ${hotel.city}`);

  const base = hotel.priceFrom;
  const partners = [
    { platform: "Booking.com", logo: "https://cf.bstatic.com/static/img/favicon/favicon-32x32.png", url: `https://www.booking.com/searchresults.pt-br.html?ss=${nameCityState}&dest_type=hotel&checkin=${checkIn}&checkout=${checkOut}&group_adults=${adults}&group_children=${children}&no_rooms=${rooms}&lang=pt-br`, price: Math.round(base * 1.00), badges: ["Cancelamento grátis", "5% cashback"], cashbackPct: 5, dealBonus: 0 },
    { platform: "Hotels.com", logo: "https://www.hotels.com/favicon.ico", url: `https://www.hotels.com/search.do?q-query=${nameCityState}&q-check-in=${checkIn}&q-check-out=${checkOut}&q-rooms=${rooms}&q-room-0-adults=${adults}&q-room-0-children=${children}`, price: Math.round(base * 1.02), badges: ["10 noites = 1 grátis"], cashbackPct: 0, dealBonus: 10 },
    { platform: "Expedia", logo: "https://www.expedia.com.br/favicon.ico", url: `https://www.expedia.com.br/Hotel-Search?destination=${nameCityState}&startDate=${checkIn}&endDate=${checkOut}&adults=${adults}&children=${children}`, price: Math.round(base * 0.98), badges: ["Preço garantido"], cashbackPct: 0, dealBonus: 5 },
    { platform: "Decolar", logo: "https://www.decolar.com/favicon.ico", url: `https://www.decolar.com/hotels/search/${encodeURIComponent(hotel.city)}?checkIn=${checkIn}&checkOut=${checkOut}&rooms=${rooms}&adults=${adults}&children=${children}&q=${nameCity}`, price: Math.round(base * 1.01), badges: ["Parcelamento 12x"], cashbackPct: 0, dealBonus: 0 },
    { platform: "Hurb", logo: "https://www.hurb.com/favicon.ico", url: `https://www.hurb.com/search?q=${nameCity}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}`, price: Math.round(base * 0.96), badges: ["🔥 Oferta relâmpago"], cashbackPct: 0, dealBonus: 20 },
    { platform: "CVC", logo: "https://www.cvc.com.br/favicon.ico", url: `https://www.cvc.com.br/hoteis/resultado?destino=${encodeURIComponent(hotel.city)}&entrada=${checkIn}&saida=${checkOut}&quartos=${rooms}&adultos=${adults}`, price: Math.round(base * 1.03), badges: ["Parcelamento 18x"], cashbackPct: 0, dealBonus: 0 },
    { platform: "Submarino Viagens", logo: "https://www.submarinoviagens.com.br/favicon.ico", url: `https://www.submarinoviagens.com.br/hoteis?q=${nameCity}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}`, price: Math.round(base * 1.01), badges: ["Cashback 3%"], cashbackPct: 3, dealBonus: 0 },
    { platform: "Google Hotels", logo: "https://www.google.com/favicon.ico", url: `https://www.google.com/travel/hotels/search?q=${nameCityState}&checkin=${checkIn}&checkout=${checkOut}&adults=${adults}`, price: Math.round(base * 0.99), badges: ["Compare preços"], cashbackPct: 0, dealBonus: 5 },
    { platform: "Trivago", logo: "https://www.trivago.com.br/favicon.ico", url: `https://www.trivago.com.br/?aDateRange[arr]=${checkIn}&aDateRange[dep]=${checkOut}&iRoomType=7&iPersons[]=${adults}&query=${nameCityState}`, price: Math.round(base * 0.97), badges: ["Melhor preço comparado"], cashbackPct: 0, dealBonus: 15 },
    { platform: "Hoteis.com", logo: "https://www.hoteis.com/favicon.ico", url: `https://www.hoteis.com/search.do?q-query=${nameCity}&q-check-in=${checkIn}&q-check-out=${checkOut}`, price: Math.round(base * 1.00), badges: ["Preço especial BR"], cashbackPct: 2, dealBonus: 0 },
    { platform: "Kayak", logo: "https://www.kayak.com.br/favicon.ico", url: `https://www.kayak.com.br/hotels/${encodeURIComponent(hotel.city)}-${encodeURIComponent(hotel.state)}/${checkIn}/${checkOut}/${adults}adults?q=${nameCity}`, price: Math.round(base * 0.99), badges: ["Comparador global"], cashbackPct: 0, dealBonus: 8 },
    { platform: "Airbnb", logo: "https://www.airbnb.com.br/favicon.ico", url: `https://www.airbnb.com.br/s/${encodeURIComponent(hotel.city + ", " + hotel.state)}/homes?checkin=${checkIn}&checkout=${checkOut}&adults=${adults}`, price: Math.round(base * 0.95), badges: ["Experiência local"], cashbackPct: 0, dealBonus: 10 },
  ].map(p => ({ ...p, dealScore: p.price * (1 - p.cashbackPct / 100) - p.dealBonus }))
   .sort((a, b) => a.dealScore - b.dealScore);

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": hotel.type === "hotel" ? "Hotel" : "LodgingBusiness",
    "name": hotel.name,
    "description": hotel.description,
    "image": hotel.image,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": hotel.city,
      "addressRegion": hotel.state,
      "addressCountry": "BR"
    },
    "starRating": { "@type": "Rating", "ratingValue": hotel.stars },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": hotel.rating,
      "reviewCount": hotel.reviews,
      "bestRating": "5"
    },
    "priceRange": `R$ ${hotel.priceFrom} - R$ ${hotel.priceTo}`,
    "amenityFeature": hotel.amenities.map(a => ({ "@type": "LocationFeatureSpecification", "name": a, "value": true })),
    "url": `https://encontrar-hoteis-pousadas.vercel.app/hotel/${hotel.id}`,
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      <Header />

      {/* Back */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors">
          ← Voltar para a busca
        </Link>
      </div>

      {/* Hero image grid */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="grid grid-cols-2 gap-2 rounded-3xl overflow-hidden h-72 sm:h-96">
          <img src={extraImages[0]} alt={hotel.name} className="w-full h-full object-cover" />
          <div className="grid grid-rows-2 gap-2">
            {extraImages.slice(1, 3).map((img, i) => (
              <img key={i} src={img} alt="" className="w-full h-full object-cover" />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {hotel.type === "hotel" ? "🏨 Hotel" : "🏡 Pousada"}
                </span>
                <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {"★".repeat(hotel.stars)}{"☆".repeat(5 - hotel.stars)}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">{hotel.name}</h1>
              <p className="text-gray-500 flex items-center gap-2 text-sm">
                📍 {hotel.city}, {hotel.state} · {hotel.region}
              </p>
              <div className="mt-2">
                <WeatherWidget city={hotel.city} />
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-2xl font-black text-amber-500">{hotel.rating}★</span>
                <span className="text-gray-500 text-sm">{hotel.reviews.toLocaleString("pt-BR")} avaliações</span>
                {hotel.featured && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">⭐ Destaque</span>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Sobre</h2>
              <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Destaques</h2>
              <div className="flex flex-wrap gap-2">
                {hotel.tags.map(tag => (
                  <span key={tag} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">{tag}</span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Comodidades</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {hotel.seasonal && hotel.seasonal.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Épocas Ideais</h2>
                <div className="flex flex-wrap gap-2">
                  {hotel.seasonal.map(s => (
                    <span key={s} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">📅 {s}</span>
                  ))}
                </div>
              </div>
            )}

            {hotel.packageFor && hotel.packageFor.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Perfil Ideal</h2>
                <div className="flex flex-wrap gap-2">
                  {hotel.packageFor.map(p => (
                    <span key={p} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">👥 {p}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white rounded-3xl shadow-lg border border-gray-100 p-5">
              <div className="text-center mb-4">
                {hotel.discount && (
                  <p className="text-gray-400 text-sm line-through">
                    R$ {Math.round(hotel.priceFrom / (1 - hotel.discount / 100))}
                  </p>
                )}
                <p className="text-4xl font-black text-blue-600">R$ {hotel.priceFrom}</p>
                <p className="text-gray-400 text-sm">por noite · 1 quarto · 2 adultos</p>
                {hotel.discount && (
                  <span className="inline-block mt-2 bg-red-100 text-red-600 text-sm font-bold px-3 py-1 rounded-full">
                    -{hotel.discount}% OFF
                  </span>
                )}
              </div>

              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Compare preços — {partners.length} parceiros</p>
              <div className="space-y-2 mb-3">
                {partners.map((p, i) => (
                  <a key={p.platform} href={p.url} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl border text-sm font-semibold transition-all hover:shadow-sm ${i === 0 ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent" : "bg-white border-gray-200 text-gray-700 hover:border-blue-400"}`}>
                    <img src={p.logo} alt="" className="w-4 h-4 rounded shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <span className="flex-1 text-left">{p.platform}</span>
                    <span className={i === 0 ? "text-white font-black" : "text-blue-700 font-black"}>R$ {p.price}</span>
                    {i === 0 && <span className="text-xs bg-yellow-300 text-yellow-900 px-1.5 rounded font-bold">MELHOR</span>}
                  </a>
                ))}
              </div>
              {partners[0]?.badges && partners[0].badges.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {partners[0].badges.map(b => (
                    <span key={b} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{b}</span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 text-center">Preços estimados · sujeitos a disponibilidade</p>
            </div>
          </div>
        </div>

        {/* Similar hotels */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Hotéis Similares em {hotel.state}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {similar.map(h => <HotelCard key={h.id} hotel={h} variant="vertical" />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
