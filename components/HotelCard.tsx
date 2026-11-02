"use client";
import { useState, useRef, useEffect } from "react";
import { Hotel } from "@/lib/hotels-data";

function getPriceOptions(hotel: Hotel, adults: number, children: number, checkIn: string, checkOut: string) {
  const seed = hotel.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = hotel.priceFrom;
  const q = encodeURIComponent(`${hotel.name} ${hotel.city}`);

  // Parse dates for each platform's format
  const [ciY, ciM, ciD] = checkIn.split("-");
  const [coY, coM, coD] = checkOut.split("-");

  // Booking.com: checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&group_adults=N&group_children=N&no_rooms=N
  const rooms = getRooms(adults, children);
  const bookingBase = hotel.bookingUrl.includes("booking.com")
    ? hotel.bookingUrl.split("?")[0]
    : `https://www.booking.com/searchresults.pt-br.html`;
  const bookingParams = new URLSearchParams({
    ss: `${hotel.name} ${hotel.city}`,
    checkin: checkIn,
    checkout: checkOut,
    group_adults: String(adults),
    group_children: String(children),
    no_rooms: String(rooms),
    lang: "pt-br",
  });
  const bookingUrl = `${bookingBase}?${bookingParams}`;

  // Hotels.com: q-check-in=YYYY-MM-DD&q-check-out=YYYY-MM-DD&q-rooms=N&q-room-0-adults=N&q-room-0-children=N
  const hotelsParams = new URLSearchParams({
    "q-query": `${hotel.name} ${hotel.city}`,
    "q-check-in": `${ciM}/${ciD}/${ciY}`,
    "q-check-out": `${coM}/${coD}/${coY}`,
    "q-rooms": String(rooms),
    "q-room-0-adults": String(adults),
    "q-room-0-children": String(children),
  });
  const hotelsUrl = `https://www.hotels.com/search.do?${hotelsParams}`;

  // Expedia: startDate=MM/DD/YYYY&endDate=MM/DD/YYYY&rooms=N&adults=N&children=N
  const expediaParams = new URLSearchParams({
    destination: `${hotel.name}, ${hotel.city}`,
    startDate: `${ciM}/${ciD}/${ciY}`,
    endDate: `${coM}/${coD}/${coY}`,
    rooms: String(rooms),
    adults: String(adults),
    children: String(children),
  });
  const expediaUrl = `https://www.expedia.com.br/Hotel-Search?${expediaParams}`;

  const platforms = [
    {
      platform: "Booking.com",
      logo: "https://cf.bstatic.com/static/img/favicon/favicon-32x32.ico",
      url: bookingUrl,
      note: "Mais reservas",
      price: Math.round(base * (1 + ((seed % 9) * 0.01))),
    },
    {
      platform: "Hotels.com",
      logo: "https://www.hotels.com/favicon.ico",
      url: hotelsUrl,
      note: "Desconto para membros",
      price: Math.round(base * (0.88 + ((seed % 8) * 0.01))),
    },
    {
      platform: "Expedia",
      logo: "https://www.expedia.com.br/favicon.ico",
      url: expediaUrl,
      note: "Pacote hotel + voo",
      price: Math.round(base * (0.94 + ((seed % 9) * 0.01))),
    },
  ].sort((a, b) => a.price - b.price);
  return platforms;
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

export default function HotelCard({
  hotel, adults = 2, children = 0,
  checkIn, checkOut, nights,
}: {
  hotel: Hotel; adults?: number; children?: number;
  checkIn?: string; checkOut?: string; nights?: number;
}) {
  const ci = checkIn || todayPlusStr(1);
  const co = checkOut || todayPlusStr(2);
  const n = nights ?? 1;

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const options = getPriceOptions(hotel, adults, children, ci, co);
  const cheapest = options[0].price;
  const rooms = getRooms(adults, children);
  const totalNightly = cheapest * rooms;
  const totalStay = totalNightly * n;
  const guestLabel = `${adults} adulto${adults !== 1 ? "s" : ""}${children > 0 ? ` + ${children} criança${children !== 1 ? "s" : ""}` : ""}`;

  function fmtDate(s: string) {
    const d = new Date(s + "T12:00:00");
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          {hotel.discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
              -{hotel.discount}%
            </span>
          )}
          {hotel.featured && (
            <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-lg">
              ⭐ Destaque
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 text-gray-700 text-xs font-semibold px-2 py-1 rounded-lg capitalize">
            {hotel.type === "hotel" ? "🏨 Hotel" : "🏡 Pousada"}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="text-white text-sm font-medium bg-black/30 px-2 py-1 rounded-lg">
            📍 {hotel.city}, {hotel.state}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 text-base leading-tight flex-1 mr-2">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-amber-400 text-sm">★</span>
            <span className="font-bold text-gray-900 text-sm">{hotel.rating}</span>
            <span className="text-gray-400 text-xs">({hotel.reviews.toLocaleString("pt-BR")})</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-xs ${i < hotel.stars ? "text-amber-400" : "text-gray-200"}`}>★</span>
          ))}
          <span className="text-gray-400 text-xs ml-1">{hotel.stars} estrelas</span>
        </div>

        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{hotel.description}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {hotel.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-gray-400 text-xs mb-0.5">👥 {guestLabel}</p>
            <p className="text-gray-400 text-xs mb-0.5">📅 {fmtDate(ci)} → {fmtDate(co)} · {n} noite{n !== 1 ? "s" : ""}</p>
            {hotel.discount && (
              <p className="text-gray-400 text-xs line-through">
                R$ {Math.round((hotel.priceFrom / (1 - hotel.discount / 100)) * rooms * n)}
              </p>
            )}
            <p className="text-gray-900">
              <span className="text-xs text-gray-500">Total estimado </span>
              <span className="font-bold text-xl text-blue-600">R$ {totalStay}</span>
            </p>
            <p className="text-xs text-gray-400">R$ {totalNightly}/noite{rooms > 1 ? ` · ${rooms} quartos` : ""}</p>
          </div>

          {/* Button + Price Comparison Dropdown */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen(v => !v)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-md hover:shadow-blue-200 transition-all active:scale-95 flex items-center gap-1"
            >
              Ver oferta
              <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 bottom-full mb-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Comparar preços</p>
                  <p className="text-xs text-gray-400">📅 {fmtDate(ci)} → {fmtDate(co)} · {n} noite{n !== 1 ? "s" : ""}</p>
                  <p className="text-xs text-gray-400">👥 {guestLabel} · {rooms} qto{rooms !== 1 ? "s" : ""}</p>
                </div>

                {options.map((opt, idx) => {
                  const isCheapest = idx === 0;
                  const optNightly = opt.price * rooms;
                  const optTotal = optNightly * n;
                  const cheapestTotal = cheapest * rooms * n;
                  return (
                    <a
                      key={opt.platform}
                      href={opt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-50 last:border-0 ${isCheapest ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-50"}`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isCheapest ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                        {idx + 1}
                      </div>
                      <img
                        src={opt.logo}
                        alt={opt.platform}
                        className="w-5 h-5 rounded object-contain shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800">{opt.platform}</p>
                        <p className="text-xs text-gray-500">{opt.note}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-base font-black ${isCheapest ? "text-green-600" : "text-gray-700"}`}>
                          R$ {optTotal}
                        </p>
                        <p className="text-xs text-gray-400">R$ {optNightly}/noite</p>
                        {isCheapest ? (
                          <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full font-semibold">
                            Menor preço
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            +R$ {optTotal - cheapestTotal}
                          </span>
                        )}
                      </div>
                      <svg className="w-3.5 h-3.5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  );
                })}

                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center">Abre já com datas e hóspedes preenchidos ✓</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
