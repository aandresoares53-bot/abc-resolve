"use client";
import { useSearchParams } from "next/navigation";
import { hotelsData } from "@/lib/hotels-data";
import Link from "next/link";
import Header from "@/components/Header";
import { Suspense } from "react";

function CompareContent() {
  const params = useSearchParams();
  const ids = (params.get("ids") || "").split(",").filter(Boolean);
  const hotels = ids.map(id => hotelsData.find(h => h.id === id)).filter(Boolean) as typeof hotelsData;

  if (hotels.length < 2) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Selecione pelo menos 2 hotéis</h2>
        <Link href="/" className="text-blue-600 hover:underline">Voltar para a busca</Link>
      </div>
    );
  }

  const rows = [
    { label: "Tipo", fn: (h: typeof hotels[0]) => h.type === "hotel" ? "🏨 Hotel" : "🏡 Pousada" },
    { label: "Cidade", fn: (h: typeof hotels[0]) => `${h.city}, ${h.state}` },
    { label: "Estrelas", fn: (h: typeof hotels[0]) => "★".repeat(h.stars) + "☆".repeat(5 - h.stars) },
    { label: "Avaliação", fn: (h: typeof hotels[0]) => `${h.rating} ⭐ (${h.reviews.toLocaleString("pt-BR")} av.)` },
    { label: "Preço/noite", fn: (h: typeof hotels[0]) => `R$ ${h.priceFrom}` },
    { label: "Desconto", fn: (h: typeof hotels[0]) => h.discount ? `-${h.discount}%` : "—" },
    { label: "Comodidades", fn: (h: typeof hotels[0]) => h.amenities.join(", ") },
    { label: "Pacotes", fn: (h: typeof hotels[0]) => h.packageFor?.join(", ") || "—" },
    { label: "Épocas ideais", fn: (h: typeof hotels[0]) => h.seasonal?.join(", ") || "—" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 pb-16">
      <div className="mb-8">
        <Link href="/" className="text-gray-500 hover:text-blue-600 text-sm font-medium">← Voltar</Link>
        <h1 className="text-3xl font-black text-gray-900 mt-4 mb-2">Comparar Hotéis</h1>
      </div>

      {/* Hotel header cards */}
      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}>
        <div />
        {hotels.map(hotel => (
          <div key={hotel.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm text-center">
            <img src={hotel.image} alt={hotel.name} className="w-full h-32 object-cover" />
            <div className="p-3">
              <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{hotel.name}</h3>
              <p className="text-xs text-gray-500">{hotel.city}, {hotel.state}</p>
              <Link
                href={`https://www.booking.com/searchresults.pt-br.html?ss=${encodeURIComponent(hotel.name)}&lang=pt-br`}
                target="_blank"
                className="mt-2 inline-block px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reservar
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {rows.map((row, ri) => (
          <div
            key={row.label}
            className={`grid items-start gap-4 px-4 py-3 ${ri % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
            style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}
          >
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide pt-0.5">{row.label}</div>
            {hotels.map(hotel => (
              <div key={hotel.id} className="text-sm text-gray-800">{row.fn(hotel)}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CompararPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <Header />
      <Suspense fallback={<div className="text-center py-20 text-gray-400">Carregando...</div>}>
        <CompareContent />
      </Suspense>
    </main>
  );
}
