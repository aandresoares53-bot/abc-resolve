import { hotelsData } from "@/lib/hotels-data";
import { fetchPixabayPhotos } from "@/lib/hotel-photos";
import { notFound } from "next/navigation";
import Link from "next/link";
import HotelCard from "@/components/HotelCard";
import Header from "@/components/Header";
import WeatherWidget from "@/components/WeatherWidget";
import PhotoGallery from "@/components/PhotoGallery";
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

export default async function HotelPage({ params, searchParams }: { params: { id: string }; searchParams?: { adults?: string; children?: string; checkIn?: string; checkOut?: string; nights?: string } }) {
  const hotel = hotelsData.find(h => h.id === params.id);
  if (!hotel) notFound();

  const adults = parseInt(searchParams?.adults || "2");
  const children = parseInt(searchParams?.children || "0");
  const totalGuests = adults + children;
  const spNights = parseInt(searchParams?.nights || "1");

  const similar = hotelsData
    .filter(h => h.id !== hotel.id && (h.city === hotel.city || h.state === hotel.state))
    .slice(0, 3);

  const photos = await fetchPixabayPhotos(hotel!);

  // Use dates from search params or default to tomorrow/day-after
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  const checkIn = searchParams?.checkIn || fmt(tomorrow);
  const checkOut = searchParams?.checkOut || fmt(dayAfter);
  const rooms = Math.max(1, Math.ceil(adults / 2));

  const nameCityState = encodeURIComponent(`${hotel.name}, ${hotel.city}, ${hotel.state}`);
  const nameCity = encodeURIComponent(`${hotel.name} ${hotel.city}`);

  const base = hotel.priceFrom;
  const bookingPartner = { platform: "Booking.com", logo: "https://cf.bstatic.com/static/img/favicon/favicon-32x32.png", url: `https://www.booking.com/searchresults.pt-br.html?ss=${nameCityState}&dest_type=hotel&checkin=${checkIn}&checkout=${checkOut}&group_adults=${adults}&group_children=${children}&no_rooms=${rooms}&lang=pt-br`, price: Math.round(base * 1.00), badges: ["Cancelamento grátis", "5% cashback"], cashbackPct: 5, dealBonus: 0, featured: true };
  const otherPartners = [
    { platform: "Expedia", logo: "https://www.expedia.com.br/favicon.ico", url: `https://www.expedia.com.br/Hotel-Search?destination=${nameCityState}&startDate=${checkIn}&endDate=${checkOut}&adults=${adults}&children=${children}`, price: Math.round(base * 0.98), badges: ["Preço garantido"], cashbackPct: 0, dealBonus: 5, featured: false },
    { platform: "Decolar", logo: "https://www.decolar.com/favicon.ico", url: `https://www.decolar.com/hotels/search/${encodeURIComponent(hotel.city)}?checkIn=${checkIn}&checkOut=${checkOut}&rooms=${rooms}&adults=${adults}&children=${children}&q=${nameCity}`, price: Math.round(base * 1.01), badges: ["Parcelamento 12x"], cashbackPct: 0, dealBonus: 0, featured: false },
    { platform: "CVC", logo: "https://www.cvc.com.br/favicon.ico", url: `https://www.cvc.com.br/hoteis/resultado?destino=${encodeURIComponent(hotel.city)}&entrada=${checkIn}&saida=${checkOut}&quartos=${rooms}&adultos=${adults}`, price: Math.round(base * 1.03), badges: ["Parcelamento 18x"], cashbackPct: 0, dealBonus: 0, featured: false },
    { platform: "Google Hotels", logo: "https://www.google.com/favicon.ico", url: `https://www.google.com/travel/hotels/search?q=${nameCityState}&checkin=${checkIn}&checkout=${checkOut}&adults=${adults}`, price: Math.round(base * 0.99), badges: ["Compare preços"], cashbackPct: 0, dealBonus: 5, featured: false },
    { platform: "Trivago", logo: "https://www.trivago.com.br/favicon.ico", url: `https://www.trivago.com.br/?aDateRange[arr]=${checkIn}&aDateRange[dep]=${checkOut}&iRoomType=7&iPersons[]=${adults}&query=${nameCityState}`, price: Math.round(base * 0.97), badges: ["Melhor preço comparado"], cashbackPct: 0, dealBonus: 15, featured: false },
    { platform: "Kayak", logo: "https://www.kayak.com.br/favicon.ico", url: `https://www.kayak.com.br/hotels/${encodeURIComponent(hotel.city)}-${encodeURIComponent(hotel.state)}/${checkIn}/${checkOut}/${adults}adults?q=${nameCity}`, price: Math.round(base * 0.99), badges: ["Comparador global"], cashbackPct: 0, dealBonus: 8, featured: false },
    { platform: "Airbnb", logo: "https://www.airbnb.com.br/favicon.ico", url: `https://www.airbnb.com.br/s/${encodeURIComponent(hotel.city + ", " + hotel.state)}/homes?checkin=${checkIn}&checkout=${checkOut}&adults=${adults}`, price: Math.round(base * 0.95), badges: ["Experiência local"], cashbackPct: 0, dealBonus: 10, featured: false },
  ].map(p => ({ ...p, dealScore: p.price * (1 - p.cashbackPct / 100) - p.dealBonus }))
   .sort((a, b) => a.dealScore - b.dealScore);
  const partners = [{ ...bookingPartner, dealScore: 0 }, ...otherPartners];

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

      {/* Photo Gallery */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <PhotoGallery photos={photos} hotelName={hotel.name} />
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

            {/* Room types — adapted to guest count */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Tipos de Acomodação</h2>
              <p className="text-sm text-blue-600 font-medium mb-3">
                💡 Sugestão para {adults} adulto{adults > 1 ? "s" : ""}{children > 0 ? ` e ${children} criança${children > 1 ? "s" : ""}` : ""} · {spNights} noite{spNights > 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(() => {
                  const isChale = hotel.tags.some(t => t.toLowerCase().includes("chalé") || t.toLowerCase().includes("chale") || t.toLowerCase().includes("bangalô") || t.toLowerCase().includes("bangalo"));
                  const needsFamily = totalGuests >= 3;
                  const isRomantic = totalGuests === 2 && children === 0;

                  type Room = { icon: string; name: string; desc: string; capacity: string; photo: string; recommended?: boolean };
                  let rooms: Room[] = [];

                  if (isChale) {
                    rooms = [
                      { icon: "🏡", name: needsFamily ? "Chalé Família" : isRomantic ? "Chalé Romântico" : "Chalé Standard", desc: needsFamily ? `Chalé amplo para ${totalGuests} pessoas com varanda` : isRomantic ? "Chalé privativo com banheira e varanda" : "Chalé privativo com varanda e jardim", capacity: `${totalGuests} pessoas`, photo: photos[1]?.url || photos[0].url, recommended: true },
                      { icon: "🛏️", name: "Suíte com Varanda", desc: "Suíte com varanda e vista panorâmica", capacity: "2 adultos", photo: photos[2]?.url || photos[0].url },
                      { icon: "🏡", name: "Chalé Luxo", desc: "Chalé premium com hidromassagem", capacity: "2 adultos", photo: photos[3]?.url || photos[0].url },
                    ];
                  } else if (hotel.type === "pousada") {
                    rooms = [
                      { icon: needsFamily ? "👨‍👩‍👧" : isRomantic ? "💑" : "🛏️", name: needsFamily ? "Quarto Família" : isRomantic ? "Quarto Casal" : "Quarto Standard", desc: needsFamily ? `Quarto espaçoso para ${totalGuests} pessoas` : isRomantic ? "Cama queen com decoração romântica" : "Quarto confortável com café da manhã", capacity: `${totalGuests} pessoas`, photo: photos[1]?.url || photos[0].url, recommended: true },
                      { icon: "⭐", name: "Suíte Superior", desc: "Suíte com área de estar e vista", capacity: "2 adultos", photo: photos[2]?.url || photos[0].url },
                      { icon: "🛏️", name: "Quarto Standard", desc: "Quarto aconchegante com café da manhã", capacity: "2 adultos", photo: photos[3]?.url || photos[0].url },
                    ];
                  } else {
                    rooms = [
                      { icon: needsFamily ? "👨‍👩‍👧" : isRomantic ? "💑" : "🛏️", name: needsFamily ? "Apartamento Família" : isRomantic ? "Quarto Casal Superior" : "Standard", desc: needsFamily ? `Apartamento para ${totalGuests} pessoas` : isRomantic ? "Cama king, vista e frigobar" : "Quarto confortável com todas comodidades", capacity: `${totalGuests} pessoas`, photo: photos[1]?.url || photos[0].url, recommended: true },
                      { icon: "👑", name: "Suíte Executiva", desc: "Suíte com sala de estar e banheira", capacity: "2 adultos", photo: photos[2]?.url || photos[0].url },
                      { icon: "🛏️", name: "Standard", desc: "Quarto standard com vista interna", capacity: "2 adultos", photo: photos[3]?.url || photos[0].url },
                      { icon: "⭐", name: "Superior", desc: "Quarto superior com vista privilegiada", capacity: "2 adultos", photo: photos[4]?.url || photos[0].url },
                    ];
                  }

                  return rooms.map(room => (
                    <div key={room.name} className={`border rounded-2xl overflow-hidden flex hover:shadow-md transition-all ${room.recommended ? "border-blue-400 ring-1 ring-blue-200" : "border-gray-200"}`}>
                      <img src={room.photo} alt={room.name} className="w-24 h-24 object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div className="p-3 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-gray-900 text-sm">{room.icon} {room.name}</p>
                          {room.recommended && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">✓ Ideal</span>}
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5">{room.desc}</p>
                        <p className="text-blue-600 text-xs mt-1 font-medium">👤 {room.capacity}</p>
                        <p className="text-green-700 text-xs font-bold mt-1">A partir de R$ {hotel.priceFrom}/noite</p>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
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
                <p className="text-gray-400 text-sm">por noite · {rooms} quarto{rooms > 1 ? "s" : ""} · {adults} adulto{adults > 1 ? "s" : ""}{children > 0 ? ` · ${children} criança${children > 1 ? "s" : ""}` : ""}</p>
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
                    <img src={p.logo} alt="" className="w-4 h-4 rounded shrink-0" />
                    <span className="flex-1 text-left">{p.platform}</span>
                    <span className={i === 0 ? "text-white font-black" : "text-blue-700 font-black"}>R$ {p.price}</span>
                    {i === 0 && <span className="text-xs bg-yellow-300 text-yellow-900 px-1.5 rounded font-bold">⭐ RECOMENDADO</span>}
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
