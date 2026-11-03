import { hotelsData } from "@/lib/hotels-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import HotelCard from "@/components/HotelCard";
import Header from "@/components/Header";
import type { Metadata } from "next";

function slugToCity(slug: string): string {
  const map: Record<string, string> = {
    "florianopolis": "Florianópolis",
    "fortaleza": "Fortaleza",
    "salvador": "Salvador",
    "recife": "Recife",
    "rio-de-janeiro": "Rio de Janeiro",
    "sao-paulo": "São Paulo",
    "gramado": "Gramado",
    "buzios": "Búzios",
    "paraty": "Paraty",
    "porto-de-galinhas": "Porto de Galinhas",
    "jericoacoara": "Jericoacoara",
    "fernando-de-noronha": "Fernando de Noronha",
    "morro-de-sao-paulo": "Morro de São Paulo",
    "campos-do-jordao": "Campos do Jordão",
    "bonito": "Bonito",
    "manaus": "Manaus",
    "belem": "Belém",
    "curitiba": "Curitiba",
    "foz-do-iguacu": "Foz do Iguaçu",
    "natal": "Natal",
    "maceio": "Maceió",
    "joao-pessoa": "João Pessoa",
    "alter-do-chao": "Alter do Chão",
    "pirenopolis": "Pirenópolis",
    "arraial-do-cabo": "Arraial do Cabo",
    "pipa": "Pipa",
    "canoa-quebrada": "Canoa Quebrada",
    "trancoso": "Trancoso",
    "porto-seguro": "Porto Seguro",
    "ilhabela": "Ilhabela",
    "ubatuba": "Ubatuba",
    "angra-dos-reis": "Angra dos Reis",
    "cabo-frio": "Cabo Frio",
    "caraguatatuba": "Caraguatatuba",
    "sao-sebastiao": "São Sebastião",
    "bertioga": "Bertioga",
    "guaruja": "Guarujá",
    "santos": "Santos",
    "praia-grande": "Praia Grande",
    "mongagua": "Mongaguá",
    "peruibe": "Peruíbe",
    "cananeia": "Cananéia",
    "pontal-do-parana": "Pontal do Paraná",
    "bombinhas": "Bombinhas",
    "garopaba": "Garopaba",
    "itapema": "Itapema",
    "imbituba": "Imbituba",
    "balneario-camboriu": "Balneário Camboriú",
    "blumenau": "Blumenau",
    "ouro-preto": "Ouro Preto",
    "tiradentes": "Tiradentes",
    "maragogi": "Maragogi",
    "itacare": "Itacaré",
    "aracaju": "Aracaju",
    "goiania": "Goiânia",
    "brasilia": "Brasília",
    "caldas-novas": "Caldas Novas",
    "belo-horizonte": "Belo Horizonte",
    "porto-alegre": "Porto Alegre",
    "sao-luis": "São Luís",
    "barreirinhas": "Barreirinhas",
    "ilheus": "Ilhéus",
  };
  return map[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export async function generateMetadata({ params }: { params: { cidade: string } }): Promise<Metadata> {
  const city = slugToCity(params.cidade);
  const hotels = hotelsData.filter(h => h.city === city);
  if (hotels.length === 0) return {};
  const state = hotels[0].state;
  return {
    title: `Hotéis em ${city}, ${state} — ${hotels.length} opções | Encontrar Hotéis`,
    description: `Compare ${hotels.length} hotéis e pousadas em ${city}. Veja avaliações, preços e reserve no Booking.com, Expedia, Hotels.com e mais.`,
    openGraph: {
      title: `Hotéis em ${city}`,
      description: `${hotels.length} opções de hospedagem em ${city}, ${state}`,
      images: hotels[0]?.image ? [hotels[0].image] : [],
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  const cities = Array.from(new Set(hotelsData.map(h => h.city)));
  return cities.map(city => ({
    cidade: city
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, ""),
  }));
}

export default function HoteisNaCidade({ params }: { params: { cidade: string } }) {
  const city = slugToCity(params.cidade);
  const hotels = hotelsData.filter(h => h.city === city).sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.rating - a.rating;
  });

  if (hotels.length === 0) notFound();

  const state = hotels[0].state;
  const region = hotels[0].region;
  const avgRating = (hotels.reduce((s, h) => s + h.rating, 0) / hotels.length).toFixed(1);
  const minPrice = Math.min(...hotels.map(h => h.priceFrom));

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Hotéis em ${city}`,
    "description": `${hotels.length} hotéis e pousadas em ${city}, ${state}`,
    "numberOfItems": hotels.length,
    "itemListElement": hotels.slice(0, 10).map((h, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Hotel",
        "name": h.name,
        "url": `https://encontrar-hoteis-pousadas.vercel.app/hotel/${h.id}`,
        "image": h.image,
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": h.rating, "reviewCount": h.reviews }
      }
    }))
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      <Header />

      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <Link href="/" className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors">← Busca</Link>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
          {hotels[0]?.image && (
            <img src={hotels[0].image} alt={city} className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-3xl" />
          )}
          <div className="relative z-10">
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-wide mb-2">{region} · {state}</p>
            <h1 className="text-4xl sm:text-5xl font-black mb-3">Hotéis em {city}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-blue-100">
              <span>🏨 {hotels.length} opções de hospedagem</span>
              <span>⭐ Avaliação média {avgRating}</span>
              <span>💰 A partir de R$ {minPrice}/noite</span>
            </div>
          </div>
        </div>

        {/* Filters summary */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Array.from(new Set(hotels.map(h => h.type))).map(t => (
            <span key={t} className="bg-white border border-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full">
              {t === "hotel" ? "🏨 Hotéis" : "🏡 Pousadas"}
            </span>
          ))}
          <span className="bg-white border border-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full">
            📍 {city}, {state}
          </span>
        </div>

        {/* Hotel list */}
        <div className="flex flex-col gap-4 pb-16">
          {hotels.map((hotel, i) => (
            <div key={hotel.id} className={`fade-in-up fade-in-up-${Math.min(i + 1, 6)}`}>
              <HotelCard hotel={hotel} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
