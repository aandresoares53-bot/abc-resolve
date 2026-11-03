"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Hotel } from "@/lib/hotels-data";

function getExtraImages(hotel: Hotel): string[] {
  const seed = hotel.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const collections: Record<string, string[]> = {
    hotel: [
      `https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80`,
      `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80`,
      `https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80`,
      `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80`,
      `https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80`,
    ],
    pousada: [
      `https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80`,
      `https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80`,
      `https://images.unsplash.com/photo-1501117716987-c8c394bb29df?w=800&q=80`,
      `https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80`,
      `https://images.unsplash.com/photo-1521782462922-9318be7a97b1?w=800&q=80`,
    ],
  };
  const pool = collections[hotel.type] || collections.hotel;
  const start = seed % pool.length;
  return [hotel.image, pool[start], pool[(start + 1) % pool.length], pool[(start + 2) % pool.length]];
}

function getPriceOptions(hotel: Hotel, adults: number, children: number, checkIn: string, checkOut: string) {
  const seed = hotel.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = hotel.priceFrom;
  const rooms = getRooms(adults, children);
  const name = hotel.name;
  const city = hotel.city;
  const state = hotel.state;
  // "Nome do Hotel, Cidade, Estado" — busca o mais específica possível
  const nameEnc       = encodeURIComponent(name);
  const nameCityState = encodeURIComponent(`${name}, ${city}, ${state}`);
  const nameCity      = encodeURIComponent(`${name} ${city}`);
  const cityStateEnc  = encodeURIComponent(`${city}, ${state}`);
  const cityEnc       = encodeURIComponent(city);

  // Booking.com: ss = "Nome, Cidade" + dest_type=hotel força busca de propriedade exata
  const bookingUrl = `https://www.booking.com/searchresults.pt-br.html?ss=${nameCityState}&dest_type=hotel&checkin=${checkIn}&checkout=${checkOut}&group_adults=${adults}&group_children=${children}&no_rooms=${rooms}&lang=pt-br&sb_travel_purpose=leisure`;

  // Hotels.com: q-query com nome + cidade aumenta precisão
  const hotelsUrl = `https://www.hotels.com/search.do?q-query=${nameCity}&q-check-in=${checkIn}&q-check-out=${checkOut}&q-rooms=${rooms}&q-room-0-adults=${adults}&q-room-0-children=${children}&sort-order=BEST_SELLER`;

  // Expedia: destination = "Nome, Cidade, Estado" + type=hotel
  const expediaUrl = `https://www.expedia.com.br/Hotel-Search?destination=${nameCityState}&startDate=${checkIn}&endDate=${checkOut}&adults=${adults}&children=${children}&rooms=${rooms}&sort=RECOMMENDED`;

  // Decolar: rota com cidade + query = nome exato
  const decolarUrl = `https://www.decolar.com/hospedagens/busca/${cityEnc}/${checkIn}/${checkOut}/${adults}/${children}?q=${nameEnc}&sortBy=PRICE`;

  // Kayak: busca por nome + cidade como destino
  const kayakUrl = `https://www.kayak.com.br/hotels/${nameCity}/${checkIn}/${checkOut}/${adults}adults?sort=price_a`;

  // TripAdvisor: q = "Nome, Cidade" — aparece como primeira sugestão de propriedade
  const tripUrl = `https://www.tripadvisor.com.br/Search?q=${nameCity}&searchSessionId=&date=${checkIn}&enddate=${checkOut}&adult=${adults}&child=${children}&geo=&searchNearby=false`;

  // Airbnb: query = "Nome" dentro da cidade exata
  const airbnbUrl = `https://www.airbnb.com.br/s/${cityStateEnc}/homes?query=${nameEnc}&checkin=${checkIn}&checkout=${checkOut}&adults=${adults}&children=${children}&refinement_paths[]=%2Fhomes`;

  // Hurb: q = "Nome Cidade"
  const hurbUrl = `https://www.hurb.com/search?q=${nameCity}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}&type=hotel`;

  // CVC: busca com nome do hotel em destaque
  const cvcUrl = `https://www.cvc.com.br/hoteis/busca?q=${nameCityState}&dataIda=${checkIn}&dataVolta=${checkOut}&adultos=${adults}&criancas=${children}`;

  // Submarino Viagens
  const submarinoUrl = `https://www.submarinoviagens.com.br/hoteis/?q=${nameCity}&checkin=${checkIn}&checkout=${checkOut}&adults=${adults}&children=${children}`;

  // Google Hotels: pesquisa "Nome Hotel Cidade" → aparece como ficha do estabelecimento
  const googleUrl = `https://www.google.com/travel/hotels?q=${nameCityState}&dates=${checkIn},${checkOut}&adults=${adults}&ved=0`;

  // Trivago: query = "Nome, Cidade" para máxima precisão
  const trivagoUrl = `https://www.trivago.com.br/pt-BR/lm/hotel-search?search%5Bquery%5D=${nameCity}&search%5BcheckIn%5D=${checkIn}&search%5BcheckOut%5D=${checkOut}&search%5BnumAdults%5D=${adults}&search%5BnumChildren%5D=${children}`;

  // Conditions shown as badges — cashback/cancelamento grátis/parcelamento/fidelidade
  // dealScore = preço efetivo após benefícios (menor = melhor negócio)
  const allOptions = [
    {
      platform: "Booking.com",       logo: "https://cf.bstatic.com/static/img/favicon/favicon-32x32.ico",
      url: bookingUrl,   price: Math.round(base * (1.00 + ((seed % 9) * 0.01))),
      badges: ["Cancelamento grátis", "Pague no hotel"],
      note: "Cancelamento grátis disponível",
      cashbackPct: 0, dealBonus: 5,
    },
    {
      platform: "Hotels.com",        logo: "https://www.hotels.com/favicon.ico",
      url: hotelsUrl,    price: Math.round(base * (0.88 + ((seed % 8) * 0.01))),
      badges: ["1 noite grátis a cada 10", "Membro: -10%"],
      note: "Programa One Key — acumule noites grátis",
      cashbackPct: 0, dealBonus: 12,
    },
    {
      platform: "Expedia",           logo: "https://www.expedia.com.br/favicon.ico",
      url: expediaUrl,   price: Math.round(base * (0.94 + ((seed % 9) * 0.01))),
      badges: ["Pacote hotel+voo", "One Key Rewards"],
      note: "Economize até 20% combinando voo + hotel",
      cashbackPct: 0, dealBonus: 8,
    },
    {
      platform: "Decolar",           logo: "https://www.decolar.com/favicon.ico",
      url: decolarUrl,   price: Math.round(base * (0.91 + ((seed % 7) * 0.01))),
      badges: ["Parcelado s/ juros", "Desconto à vista"],
      note: "Parcelamento em até 12x sem juros",
      cashbackPct: 0, dealBonus: 7,
    },
    {
      platform: "Kayak",             logo: "https://www.kayak.com.br/favicon.ico",
      url: kayakUrl,     price: Math.round(base * (0.93 + ((seed % 6) * 0.01))),
      badges: ["Price Alert", "Hacker Fares"],
      note: "Alerta de preço — avisa quando cair",
      cashbackPct: 0, dealBonus: 4,
    },
    {
      platform: "TripAdvisor",       logo: "https://static.tacdn.com/img2/favicon.ico",
      url: tripUrl,      price: Math.round(base * (0.96 + ((seed % 8) * 0.01))),
      badges: ["Avaliação verificada"],
      note: "Baseado em avaliações reais de hóspedes",
      cashbackPct: 0, dealBonus: 3,
    },
    {
      platform: "Airbnb",            logo: "https://a0.muscache.com/airbnb/static/icons/android-icon-192x192-c0465f9f0380893768972a31a614aaed.png",
      url: airbnbUrl,    price: Math.round(base * (0.85 + ((seed % 9) * 0.01))),
      badges: ["Cozinha inclusa", "Espaço privativo"],
      note: "Casas e apartamentos completos",
      cashbackPct: 0, dealBonus: 6,
    },
    {
      platform: "Hurb",              logo: "https://www.hurb.com/favicon.ico",
      url: hurbUrl,      price: Math.round(base * (0.89 + ((seed % 7) * 0.01))),
      badges: ["Pacote completo", "Parcelado"],
      note: "Pacotes exclusivos com café da manhã",
      cashbackPct: 0, dealBonus: 9,
    },
    {
      platform: "CVC",               logo: "https://www.cvc.com.br/favicon.ico",
      url: cvcUrl,       price: Math.round(base * (0.92 + ((seed % 8) * 0.01))),
      badges: ["Agência física", "Parcelado 12x"],
      note: "Suporte presencial em toda a América Latina",
      cashbackPct: 0, dealBonus: 6,
    },
    {
      platform: "Submarino Viagens", logo: "https://www.submarinoviagens.com.br/favicon.ico",
      url: submarinoUrl, price: Math.round(base * (0.90 + ((seed % 6) * 0.01))),
      badges: ["Cashback 5%", "Parcelado 10x"],
      note: "5% de cashback para clientes Submarino",
      cashbackPct: 5, dealBonus: 11,
    },
    {
      platform: "Google Hotels",     logo: "https://www.google.com/favicon.ico",
      url: googleUrl,    price: Math.round(base * (0.87 + ((seed % 9) * 0.01))),
      badges: ["Menor preço garantido", "Direto do hotel"],
      note: "Compara todos os sites em tempo real",
      cashbackPct: 0, dealBonus: 10,
    },
    {
      platform: "Trivago",           logo: "https://www.trivago.com.br/favicon.ico",
      url: trivagoUrl,   price: Math.round(base * (0.95 + ((seed % 7) * 0.01))),
      badges: ["Comparador de preços"],
      note: "Compara 5 milhões de hotéis mundialmente",
      cashbackPct: 0, dealBonus: 5,
    },
  ];

  const ownSite = {
    platform: "encontrarhoteis.com.br",
    logo: "/favicon.ico",
    url: `/hotel/${hotel.id}?adults=${adults}&children=${children}&checkIn=${checkIn}&checkOut=${checkOut}&nights=${Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))}`,
    price: base,
    badges: ["🏆 Resultado exato", "Ver detalhes completos"],
    note: "Veja fotos, comodidades e compare todos os preços aqui",
    cashbackPct: 0,
    dealBonus: 0,
    dealScore: -Infinity, // sempre primeiro
    isOwn: true,
  };

  const ranked = allOptions
    .map(o => ({ ...o, dealScore: o.price * (1 - o.cashbackPct / 100) - o.dealBonus, isOwn: false }))
    .sort((a, b) => a.dealScore - b.dealScore);

  return [ownSite, ...ranked];
}

function getRooms(adults: number, children: number): number {
  const adultRooms = Math.ceil(adults / 2);
  const childRooms = Math.ceil(Math.max(0, children - adults) / 2);
  return Math.max(1, adultRooms + childRooms);
}

function todayPlusStr(n: number) {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function RatingBadge({ rating }: { rating: number }) {
  const score = rating * 10;
  const color = score >= 85 ? "#4caf50" : score >= 70 ? "#ff9800" : "#f44336";
  const label = score >= 85 ? "Excelente" : score >= 70 ? "Muito bom" : "Bom";
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0"
        style={{ backgroundColor: color }}
      >
        {rating.toFixed(1)}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-700 leading-none">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{(rating * 10 * 10).toFixed(0)} avaliações</p>
      </div>
    </div>
  );
}

export default function HotelCard({
  hotel, adults = 2, children = 0,
  checkIn, checkOut, nights,
  compareList, onToggleCompare,
  variant = "horizontal",
  preferredPlatform = "",
}: {
  hotel: Hotel; adults?: number; children?: number;
  checkIn?: string; checkOut?: string; nights?: number;
  compareList?: Hotel[]; onToggleCompare?: (hotel: Hotel) => void;
  variant?: "horizontal" | "vertical";
  preferredPlatform?: string;
}) {
  const ci = checkIn || todayPlusStr(1);
  const co = checkOut || todayPlusStr(2);
  const n = nights ?? 1;

  const [open, setOpen] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [fav, setFav] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertPrice, setAlertPrice] = useState("");
  const [hasAlert, setHasAlert] = useState(false);

  useEffect(() => {
    try {
      const f = JSON.parse(localStorage.getItem("favs") || "[]");
      setFav(f.includes(hotel.id));
      const alerts = JSON.parse(localStorage.getItem("priceAlerts") || "[]");
      setHasAlert(alerts.some((a: { hotelId: string }) => a.hotelId === hotel.id));
    } catch {}
  }, [hotel.id]);

  const ref = useRef<HTMLDivElement>(null);
  const images = getExtraImages(hotel);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function toggleFav(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const f: string[] = JSON.parse(localStorage.getItem("favs") || "[]");
      const next = fav ? f.filter((x: string) => x !== hotel.id) : [...f, hotel.id];
      localStorage.setItem("favs", JSON.stringify(next));
      setFav(!fav);
    } catch {}
  }

  function shareWhatsApp(e: React.MouseEvent) {
    e.stopPropagation();
    const url = `${window.location.origin}/hotel/${hotel.id}`;
    const text = `Confira este hotel: ${hotel.name} em ${hotel.city} - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  function saveAlert() {
    try {
      const max = parseInt(alertPrice);
      if (!max || max <= 0) return;
      const alerts = JSON.parse(localStorage.getItem("priceAlerts") || "[]")
        .filter((a: { hotelId: string }) => a.hotelId !== hotel.id);
      alerts.push({ hotelId: hotel.id, hotelName: hotel.name, maxPrice: max, createdAt: new Date().toISOString() });
      localStorage.setItem("priceAlerts", JSON.stringify(alerts));
      setHasAlert(true);
      setAlertOpen(false);
      setAlertPrice("");
    } catch {}
  }

  function removeAlert(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const alerts = JSON.parse(localStorage.getItem("priceAlerts") || "[]")
        .filter((a: { hotelId: string }) => a.hotelId !== hotel.id);
      localStorage.setItem("priceAlerts", JSON.stringify(alerts));
      setHasAlert(false);
    } catch {}
  }

  const rawOptions = getPriceOptions(hotel, adults, children, ci, co);
  const options = preferredPlatform
    ? [...rawOptions].sort((a, b) => a.platform === preferredPlatform ? -1 : b.platform === preferredPlatform ? 1 : 0)
    : rawOptions;
  const cheapest = options[0].price;
  const rooms = getRooms(adults, children);
  const totalNightly = cheapest * rooms;
  const totalStay = totalNightly * n;

  function fmtDate(s: string) {
    const d = new Date(s + "T12:00:00");
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className={variant === "vertical" ? "flex flex-col" : "flex flex-col sm:flex-row"}>
        {/* Image column */}
        <div className={`relative shrink-0 ${variant === "vertical" ? "w-full" : "w-full sm:w-56 md:w-64"}`} style={{ minHeight: "200px" }}>
          <div className={`relative group/img overflow-hidden ${variant === "vertical" ? "h-52" : "h-48 sm:h-full"}`} style={{ minHeight: "200px" }}>
            <img
              src={images[imgIdx]}
              alt={hotel.name}
              className="w-full h-full object-cover"
              style={{ minHeight: "200px" }}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + images.length) % images.length); }}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-xs"
                >‹</button>
                <button
                  onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % images.length); }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-xs"
                >›</button>
              </>
            )}

            {/* Badges top-left */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {hotel.discount && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  -{hotel.discount}%
                </span>
              )}
              {hotel.featured && (
                <span className="bg-amber-400 text-amber-900 text-xs font-bold px-1.5 py-0.5 rounded">
                  Destaque
                </span>
              )}
            </div>

            {/* Fav top-right */}
            <button
              onClick={toggleFav}
              className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            >
              <span style={{ fontSize: "12px" }}>{fav ? "❤️" : "🤍"}</span>
            </button>

            {/* Image dots bottom */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                    className={`h-1 rounded-full transition-all ${i === imgIdx ? "bg-white w-3" : "bg-white/50 w-1.5"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content column */}
        <div className="flex-1 p-4 flex flex-col min-w-0">
          {/* Top row: name + rating badge */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs text-gray-400 font-medium capitalize">
                  {hotel.type === "hotel" ? "Hotel" : "Pousada"}
                </span>
                <span className="text-gray-200">·</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-xs">★</span>
                  ))}
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-base leading-tight">{hotel.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">📍 {hotel.city}, {hotel.state}</p>
            </div>
            <RatingBadge rating={hotel.rating} />
          </div>

          {/* Description */}
          <p className="text-gray-500 text-sm line-clamp-2 mb-2">{hotel.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2">
            {hotel.amenities.slice(0, 4).map(a => (
              <span key={a} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{a}</span>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {hotel.tags.slice(0, 3).map(tag => (
              <span key={tag} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>

          {/* Bottom row: price + buttons */}
          <div className={`flex ${variant === "vertical" ? "flex-col" : "flex-col sm:flex-row sm:items-end"} justify-between mt-auto gap-3`}>
            {/* Price */}
            <div>
              {hotel.discount && (
                <p className="text-gray-400 text-xs line-through">
                  R$ {Math.round(hotel.priceFrom / (1 - hotel.discount / 100))}/noite
                </p>
              )}
              <p className="text-gray-400 text-xs">a partir de</p>
              <p className="text-2xl font-black text-gray-900">R$ {cheapest}</p>
              <p className="text-xs text-gray-400">/noite · {fmtDate(ci)} – {fmtDate(co)}</p>
              <p className="text-xs text-gray-500 mt-0.5">Total estimado: <span className="font-semibold">R$ {totalStay}</span></p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 w-full">
              {/* Row 1: main CTA + icon buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setOpen(v => !v)}
                  className="flex-1 min-w-0 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  Ver oferta
                  <svg className={`w-3.5 h-3.5 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <button onClick={shareWhatsApp} title="Compartilhar no WhatsApp"
                  className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </button>

                {!hasAlert ? (
                  <button onClick={() => setAlertOpen(v => !v)} title="Alerta de preço"
                    className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center hover:bg-amber-200 transition-colors text-amber-600 text-base shrink-0">🔔</button>
                ) : (
                  <button onClick={removeAlert} title="Remover alerta"
                    className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors text-green-600 text-base shrink-0">✓</button>
                )}
              </div>

              {/* Row 2: secondary links */}
              <div className="flex items-center gap-3">
                <Link href={`/hotel/${hotel.id}?adults=${adults}&children=${children}&checkIn=${ci}&checkOut=${co}&nights=${n}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  Ver detalhes →
                </Link>
                {onToggleCompare && (
                  <button onClick={() => onToggleCompare(hotel)}
                    className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all ${
                      compareList?.find(h => h.id === hotel.id)
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600"
                    }`}>
                    {compareList?.find(h => h.id === hotel.id) ? "✓ Comparar" : "+ Comparar"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Alert input inline */}
          {alertOpen && !hasAlert && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">Alerta de preço — máximo por noite</p>
              <div className="flex gap-2">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden flex-1">
                  <span className="px-2 text-gray-500 text-xs bg-gray-50 border-r border-gray-200 py-2">R$</span>
                  <input type="number" value={alertPrice} onChange={e => setAlertPrice(e.target.value)}
                    placeholder="400" className="flex-1 px-2 py-2 text-sm focus:outline-none bg-transparent"
                    autoFocus onKeyDown={e => e.key === "Enter" && saveAlert()} />
                </div>
                <button onClick={saveAlert} className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600">Salvar</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Price comparison panel — full-width accordion below card */}
      {open && (
        <div className="border-t border-gray-100" ref={ref}>
          <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Comparar preços</p>
              <p className="text-xs text-gray-400 mt-0.5">📅 {fmtDate(ci)} → {fmtDate(co)} · {n} noite{n !== 1 ? "s" : ""} · {rooms} quarto{rooms !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
          </div>
          <div className="divide-y divide-gray-50">
            {options.map((opt, idx) => {
              const isOwn = (opt as any).isOwn === true;
              const isBest = !isOwn && idx === 1; // idx 0 = próprio site, idx 1 = melhor parceiro
              const optTotal = isOwn ? opt.price : opt.price * rooms * n;
              const partnerBestTotal = options[1] ? options[1].price * rooms * n : optTotal;
              const isPreferred = !isOwn && opt.platform === preferredPlatform;
              const hasCashback = !isOwn && (opt as any).cashbackPct > 0;
              const effectiveTotal = hasCashback
                ? Math.round(optTotal * (1 - (opt as any).cashbackPct / 100))
                : optTotal;

              if (isOwn) {
                return (
                  <Link key="own" href={opt.url} onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-blue-700 font-black text-xs shrink-0">★</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-black text-white">{hotel.name}</p>
                        <span className="text-xs bg-white text-blue-700 px-2 py-0.5 rounded-full font-bold leading-none">Resultado exato</span>
                      </div>
                      <p className="text-xs text-blue-200 mt-0.5">Ver fotos, comodidades e todos os preços comparados</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-black text-white">R$ {opt.price}</p>
                      <p className="text-xs text-blue-200">Ver detalhes →</p>
                    </div>
                  </Link>
                );
              }

              const extIdx = idx; // mantém posição real na lista
              return (
                <a key={opt.platform} href={opt.url} target="_blank" rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${isPreferred ? "bg-orange-50 hover:bg-orange-100" : isBest ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-50"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${isBest ? "bg-green-500 text-white" : isPreferred ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {extIdx}
                  </div>
                  <img src={opt.logo} alt={opt.platform} className="w-5 h-5 rounded object-contain shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-bold text-gray-800">{opt.platform}</p>
                      {isBest && <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full font-semibold leading-none">Melhor negócio</span>}
                      {isPreferred && !isBest && <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-semibold leading-none">Preferida</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{opt.note}</p>
                    {(opt as any).badges?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(opt as any).badges.map((b: string) => (
                          <span key={b} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium leading-none">{b}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {hasCashback ? (
                      <>
                        <p className="text-xs text-gray-400 line-through">R$ {optTotal}</p>
                        <p className="text-base font-black text-green-600">R$ {effectiveTotal}</p>
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">-{(opt as any).cashbackPct}% cashback</span>
                      </>
                    ) : (
                      <>
                        <p className={`text-base font-black ${isBest ? "text-green-600" : "text-gray-700"}`}>R$ {optTotal}</p>
                        {isBest
                          ? <span className="text-xs text-green-600 font-semibold">Menor preço</span>
                          : <span className="text-xs text-gray-400">+R$ {optTotal - partnerBestTotal}</span>}
                      </>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">Abre com datas e hóspedes preenchidos ✓</p>
          </div>
        </div>
      )}
    </div>
  );
}
