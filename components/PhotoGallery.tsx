"use client";
import { useState } from "react";

interface Props {
  photos: { url: string; caption: string }[];
  hotelName: string;
}

export default function PhotoGallery({ photos, hotelName }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!photos.length) return null;

  const shown = photos.slice(0, 6);

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-1.5 rounded-2xl overflow-hidden h-72 sm:h-[420px]">
        {/* Large first photo */}
        <div className="col-span-2 row-span-2 relative cursor-zoom-in group" onClick={() => setLightbox(0)}>
          <img src={shown[0].url} alt={shown[0].caption} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white text-sm font-bold px-4 py-2 rounded-full transition-all">🔍 Ver foto</span>
          </div>
        </div>
        {/* Right grid: 4 smaller photos */}
        {shown.slice(1, 5).map((photo, i) => (
          <div key={i} className="relative cursor-zoom-in group" onClick={() => setLightbox(i + 1)}>
            <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold transition-all">🔍</span>
            </div>
            {i === 3 && photos.length > 5 && (
              <div className="pointer-events-none absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">+{photos.length - 5} fotos</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Thumbnails strip */}
      <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
        {photos.map((photo, i) => (
          <button key={i} onClick={() => setLightbox(i)}
            className="shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all hover:border-blue-500 border-transparent">
            <img src={photo.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 z-10" onClick={() => setLightbox(null)}>✕</button>
          <button className="absolute left-4 text-white text-4xl font-bold hover:text-gray-300 z-10 px-4 py-2"
            onClick={e => { e.stopPropagation(); setLightbox(l => l !== null && l > 0 ? l - 1 : photos.length - 1); }}>‹</button>
          <div className="max-w-5xl max-h-screen p-8 text-center" onClick={e => e.stopPropagation()}>
            <img src={photos[lightbox].url.replace("w=800", "w=1400")} alt={photos[lightbox].caption}
              className="max-w-full max-h-[80vh] object-contain rounded-xl mx-auto" referrerPolicy="no-referrer" />
            <p className="text-white/80 text-sm mt-3">{photos[lightbox].caption}</p>
            <p className="text-white/50 text-xs mt-1">{lightbox + 1} / {photos.length}</p>
          </div>
          <button className="absolute right-4 text-white text-4xl font-bold hover:text-gray-300 z-10 px-4 py-2"
            onClick={e => { e.stopPropagation(); setLightbox(l => l !== null && l < photos.length - 1 ? l + 1 : 0); }}>›</button>
        </div>
      )}
    </>
  );
}
