import { Hotel } from "@/lib/hotels-data";

export default function HotelCard({ hotel }: { hotel: Hotel }) {
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
          <a
            href={hotel.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-md hover:shadow-blue-200 transition-all active:scale-95 inline-block"
          >
            Ver oferta
          </a>
        </div>
      </div>
    </div>
  );
}
