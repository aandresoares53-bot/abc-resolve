type HotelLike = {
  type: string;
  tags: string[];
  region: string;
  amenities: string[];
  name: string;
  city: string;
  image: string;
};

export type PhotoSet = { url: string; caption: string }[];

// --- Fallback: static Unsplash sets (used when Pixabay returns < 3 results) ---
const U = (id: string, w = 800) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

const BEACH: PhotoSet = [
  { url: U("photo-1507525428034-b723cf961d3e"), caption: "Vista da praia" },
  { url: U("photo-1519046904884-53103b34b206"), caption: "Orla e mar azul" },
  { url: U("photo-1473116763249-2faaef81ccda"), caption: "Praia paradisíaca" },
  { url: U("photo-1544551763-46a013bb70d5"), caption: "Mar cristalino" },
  { url: U("photo-1530053969600-caed2596d242"), caption: "Pôr do sol na praia" },
];
const MOUNTAIN: PhotoSet = [
  { url: U("photo-1464822759023-fed622ff2c3b"), caption: "Vista das montanhas" },
  { url: U("photo-1501854140801-50d01698950b"), caption: "Paisagem serrana" },
  { url: U("photo-1506905925346-21bda4d32df4"), caption: "Montanhas e neblina" },
  { url: U("photo-1486870591958-9b9d0d1dda99"), caption: "Serra ao amanhecer" },
];
const JUNGLE: PhotoSet = [
  { url: U("photo-1516026672322-bc52d61a55d5"), caption: "Floresta tropical" },
  { url: U("photo-1448375240586-882707db888b"), caption: "Mata nativa" },
  { url: U("photo-1518895312237-a9e23508077d"), caption: "Ecoturismo" },
];
const CITY: PhotoSet = [
  { url: U("photo-1542314831-068cd1dbfeeb"), caption: "Hotel urbano" },
  { url: U("photo-1571896349842-33c89424de2d"), caption: "Centro histórico" },
  { url: U("photo-1455587734955-081b22074882"), caption: "Skyline urbano" },
];
const ROOMS: PhotoSet = [
  { url: U("photo-1631049307264-da0ec9d70304"), caption: "Quarto luxuoso" },
  { url: U("photo-1590490360182-c33d57733427"), caption: "Quarto standard" },
  { url: U("photo-1618773928121-c32242e63f39"), caption: "Suíte master" },
];

function getHotelPhotosFallback(hotel: HotelLike): PhotoSet {
  const tags = hotel.tags.map(t => t.toLowerCase());
  const isBeach = tags.some(t => ["praia", "mar", "litoral"].some(k => t.includes(k)));
  const isMountain = tags.some(t => ["serra", "montanha", "gramado", "chapada"].some(k => t.includes(k)));
  const isJungle = tags.some(t => ["amazônia", "floresta", "pantanal", "eco"].some(k => t.includes(k)));

  const photos: PhotoSet = [{ url: hotel.image, caption: hotel.name }];
  if (isBeach) photos.push(...BEACH.slice(0, 3));
  else if (isJungle) photos.push(...JUNGLE.slice(0, 3));
  else if (isMountain) photos.push(...MOUNTAIN.slice(0, 3));
  else photos.push(...CITY.slice(0, 3));
  photos.push(...ROOMS.slice(0, 2));
  return photos.slice(0, 8);
}

// Build smart search queries for this hotel
function buildQueries(hotel: HotelLike): string[] {
  const tags = hotel.tags.map(t => t.toLowerCase());
  const isBeach = tags.some(t => ["praia", "mar", "litoral", "costa"].some(k => t.includes(k)));
  const isMountain = tags.some(t => ["serra", "montanha", "chapada"].some(k => t.includes(k)));
  const isJungle = tags.some(t => ["amazônia", "floresta", "pantanal"].some(k => t.includes(k)));
  const hasPool = hotel.amenities.some(a => a.toLowerCase().includes("piscina"));

  const type = hotel.type === "pousada" ? "pousada" : "hotel";
  const queries: string[] = [
    // Most specific first
    `${hotel.name} ${hotel.city}`,
    `${type} ${hotel.city}`,
  ];

  if (isBeach) queries.push(`praia ${hotel.city}`, `beach ${hotel.city}`);
  else if (isMountain) queries.push(`serra ${hotel.city}`, `montanha ${hotel.city}`);
  else if (isJungle) queries.push(`floresta ${hotel.city}`, `natureza ${hotel.city}`);
  else queries.push(`${hotel.city} turismo`);

  if (hasPool) queries.push(`piscina hotel resort`);
  queries.push(`${type} quarto luxo`);

  return queries;
}

export async function fetchPixabayPhotos(hotel: HotelLike): Promise<PhotoSet> {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) return getHotelPhotosFallback(hotel);

  const queries = buildQueries(hotel);
  const seen = new Set<string>();
  const photos: PhotoSet = [{ url: hotel.image, caption: hotel.name }];

  for (const q of queries) {
    if (photos.length >= 10) break;
    try {
      const url = `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(q)}&image_type=photo&per_page=6&safesearch=true&orientation=horizontal&min_width=800`;
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) continue;
      const data = await res.json();
      if (!data.hits?.length) continue;
      for (const hit of data.hits) {
        const imgUrl: string = hit.webformatURL || hit.largeImageURL;
        if (!imgUrl || seen.has(imgUrl)) continue;
        seen.add(imgUrl);
        photos.push({ url: imgUrl, caption: hit.tags?.split(",")[0]?.trim() || q });
        if (photos.length >= 10) break;
      }
    } catch {}
  }

  return photos.length >= 3 ? photos.slice(0, 12) : getHotelPhotosFallback(hotel);
}

// Keep sync export for backwards compatibility
export function getHotelPhotos(hotel: HotelLike): PhotoSet {
  return getHotelPhotosFallback(hotel);
}
