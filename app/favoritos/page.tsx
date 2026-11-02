"use client";
import { useState, useEffect } from "react";
import { hotelsData } from "@/lib/hotels-data";
import HotelCard from "@/components/HotelCard";
import Link from "next/link";
import Header from "@/components/Header";

export default function FavoritosPage() {
  const [favIds, setFavIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      setFavIds(JSON.parse(localStorage.getItem("favs") || "[]"));
    } catch {}
  }, []);

  const favHotels = hotelsData.filter(h => favIds.includes(h.id));

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link href="/" className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors">← Voltar</Link>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-4 mb-2">❤️ Meus Favoritos</h1>
          <p className="text-gray-500">
            {favHotels.length === 0
              ? "Você ainda não salvou nenhum hotel."
              : `${favHotels.length} hotel${favHotels.length !== 1 ? "s" : ""} salvos`}
          </p>
        </div>

        {favHotels.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤍</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Nenhum favorito ainda</h2>
            <p className="text-gray-400 mb-6">Clique no coração ❤️ nos cards dos hotéis para salvá-los aqui.</p>
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-lg transition-all"
            >
              Buscar Hotéis
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favHotels.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)}
          </div>
        )}
      </div>
    </main>
  );
}
