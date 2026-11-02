"use client";
import { useState, useRef, useEffect } from "react";
import { Hotel } from "@/lib/hotels-data";

function getBookingOptions(hotel: Hotel) {
  const q = encodeURIComponent(`${hotel.name} ${hotel.city}`);
  return [
    {
      platform: "Booking.com",
      logo: "https://cf.bstatic.com/static/img/favicon/favicon-32x32.ico",
      url: hotel.bookingUrl,
      badge: "Mais reservas",
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      platform: "Hotels.com",
      logo: "https://www.hotels.com/favicon.ico",
      url: `https://www.hotels.com/search.do?q-query=${q}`,
      badge: "Membros com desconto",
      badgeColor: "bg-orange-100 text-orange-700",
    },
    {
      platform: "Expedia",
      logo: "https://www.expedia.com.br/favicon.ico",
      url: `https://www.expedia.com.br/Hotel-Search?destination=${q}`,
      badge: "Pacotes exclusivos",
      badgeColor: "bg-yellow-100 text-yellow-700",
    },
  ];
}

export default function HotelCard({ hotel }: { hotel: Hotel }) {
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

  const options = getBookingOptions(hotel);

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

        {/* Badges */}
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

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-xs ${i < hotel.stars ? "text-amber-400" : "text-gray-200"}`}>★</span>
          ))}
          <span className="text-gray-400 text-xs ml-1">{hotel.stars} estrelas</span>
        </div>

        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{hotel.description}</p>

        {/* Tags */}
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
            {hotel.discount && (
              <p className="text-gray-400 text-xs line-through">
                R$ {Math.round(hotel.priceFrom / (1 - hotel.discount / 100))}/noite
              </p>
            )}
            <p className="text-gray-900">
              <span className="text-xs text-gray-500">A partir de </span>
              <span className="font-bold text-xl text-blue-600">R$ {hotel.priceFrom}</span>
              <span className="text-gray-400 text-xs">/noite</span>
            </p>
          </div>

          {/* Button + Dropdown */}
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
              <div className="absolute right-0 bottom-full mb-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Comparar preços</p>
                </div>
                {options.map((opt) => (
                  <a
                    key={opt.platform}
                    href={opt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    onClick={() => setOpen(false)}
                  >
                    <img
                      src={opt.logo}
                      alt={opt.platform}
                      className="w-5 h-5 rounded object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{opt.platform}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${opt.badgeColor}`}>
                        {opt.badge}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
