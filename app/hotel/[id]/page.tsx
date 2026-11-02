import { hotelsData } from "@/lib/hotels-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import HotelCard from "@/components/HotelCard";
import Header from "@/components/Header";
import WeatherWidget from "@/components/WeatherWidget";

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

  const bookingUrl = `https://www.booking.com/searchresults.pt-br.html?ss=${encodeURIComponent(hotel.name + " " + hotel.city)}&lang=pt-br`;

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
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
            <div className="sticky top-20 bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
              <div className="text-center mb-5">
                {hotel.discount && (
                  <p className="text-gray-400 text-sm line-through">
                    R$ {Math.round(hotel.priceFrom / (1 - hotel.discount / 100))}
                  </p>
                )}
                <p className="text-4xl font-black text-blue-600">R$ {hotel.priceFrom}</p>
                <p className="text-gray-400 text-sm">por noite · por quarto</p>
                {hotel.discount && (
                  <span className="inline-block mt-2 bg-red-100 text-red-600 text-sm font-bold px-3 py-1 rounded-full">
                    -{hotel.discount}% OFF
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl text-center hover:shadow-lg transition-all"
                >
                  Reservar no Booking.com
                </a>
                <a
                  href={`https://www.hotels.com/search.do?q-query=${encodeURIComponent(hotel.name + " " + hotel.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl text-center hover:border-blue-400 transition-all"
                >
                  Ver no Hotels.com
                </a>
                <a
                  href={`https://www.expedia.com.br/Hotel-Search?destination=${encodeURIComponent(hotel.name + ", " + hotel.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl text-center hover:border-blue-400 transition-all"
                >
                  Ver na Expedia
                </a>
              </div>

              <p className="text-xs text-gray-400 text-center">Preços sujeitos a disponibilidade.</p>
            </div>
          </div>
        </div>

        {/* Similar hotels */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Hotéis Similares em {hotel.state}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {similar.map(h => <HotelCard key={h.id} hotel={h} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
