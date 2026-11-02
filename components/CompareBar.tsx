"use client";
import Link from "next/link";
import { Hotel } from "@/lib/hotels-data";

export default function CompareBar({
  hotels,
  onRemove,
  onClear,
}: {
  hotels: Hotel[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  if (hotels.length === 0) return null;

  const compareUrl = `/comparar?ids=${hotels.map(h => h.id).join(",")}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-blue-500 shadow-2xl px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          <span className="text-sm font-bold text-gray-700">Comparar ({hotels.length}/3):</span>
          {hotels.map(h => (
            <div key={h.id} className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-xl px-3 py-1.5">
              <span className="text-xs font-semibold text-blue-800 max-w-32 truncate">{h.name}</span>
              <button onClick={() => onRemove(h.id)} className="text-blue-400 hover:text-red-500 ml-1 text-sm font-bold">×</button>
            </div>
          ))}
          {Array.from({ length: 3 - hotels.length }).map((_, i) => (
            <div key={i} className="flex items-center gap-1 border border-dashed border-gray-300 rounded-xl px-3 py-1.5">
              <span className="text-xs text-gray-400">+ Adicionar hotel</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClear} className="text-sm text-gray-400 hover:text-gray-600 px-3 py-2">Limpar</button>
          <Link
            href={hotels.length >= 2 ? compareUrl : "#"}
            className={`px-5 py-2 font-bold text-sm rounded-xl transition-all ${hotels.length >= 2 ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          >
            Comparar agora →
          </Link>
        </div>
      </div>
    </div>
  );
}
