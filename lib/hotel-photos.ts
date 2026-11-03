type HotelLike = {
  type: string;
  tags: string[];
  region: string;
  amenities: string[];
  name: string;
  city: string;
  image: string;
};

type PhotoSet = { url: string; caption: string }[];

const BEACH: PhotoSet = [
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", caption: "Vista da praia" },
  { url: "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800&q=80", caption: "Pôr do sol na praia" },
  { url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80", caption: "Orla e mar azul" },
  { url: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80", caption: "Praia paradisíaca" },
  { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80", caption: "Mar cristalino" },
];

const MOUNTAIN: PhotoSet = [
  { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", caption: "Vista das montanhas" },
  { url: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80", caption: "Serra ao amanhecer" },
  { url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80", caption: "Paisagem serrana" },
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", caption: "Montanhas e neblina" },
  { url: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80", caption: "Trilha na serra" },
];

const JUNGLE: PhotoSet = [
  { url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80", caption: "Floresta tropical" },
  { url: "https://images.unsplash.com/photo-1543164939-3f8e8c56d09b?w=800&q=80", caption: "Natureza exuberante" },
  { url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80", caption: "Mata nativa" },
  { url: "https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=800&q=80", caption: "Ecoturismo" },
  { url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80", caption: "Rio na floresta" },
];

const CITY: PhotoSet = [
  { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80", caption: "Hotel urbano" },
  { url: "https://images.unsplash.com/photo-1590164649852-eb98702aeee7?w=800&q=80", caption: "Vista da cidade" },
  { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", caption: "Centro histórico" },
  { url: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80", caption: "Skyline urbano" },
  { url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80", caption: "Vista noturna" },
];

const ROOMS: PhotoSet = [
  { url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", caption: "Quarto luxuoso" },
  { url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80", caption: "Suíte master" },
  { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80", caption: "Quarto standard" },
  { url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80", caption: "Cama king size" },
  { url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80", caption: "Banheiro privativo" },
];

const POOL: PhotoSet = [
  { url: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80", caption: "Piscina" },
  { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80", caption: "Área de lazer" },
  { url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80", caption: "Piscina com vista" },
];

const RESTAURANT: PhotoSet = [
  { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", caption: "Restaurante" },
  { url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", caption: "Café da manhã" },
];

const CHALE: PhotoSet = [
  { url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80", caption: "Chalé aconchegante" },
  { url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80", caption: "Interior do chalé" },
  { url: "https://images.unsplash.com/photo-1482192505345-5852ba2d0afa?w=800&q=80", caption: "Chalé na natureza" },
];

const SPA: PhotoSet = [
  { url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80", caption: "Spa e bem-estar" },
  { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80", caption: "Relaxamento total" },
];

export function getHotelPhotos(hotel: HotelLike): PhotoSet {
  const tags = hotel.tags.map(t => t.toLowerCase());
  const amenities = hotel.amenities.map(a => a.toLowerCase());
  const name = hotel.name.toLowerCase();

  const isBeach = tags.some(t => ["praia", "mar", "litoral", "maresias", "costa"].some(k => t.includes(k)));
  const isMountain = tags.some(t => ["serra", "montanha", "gramado", "campos", "chapada"].some(k => t.includes(k)))
    || ["Sul", "Centro-Oeste"].includes(hotel.region) && !isBeach;
  const isJungle = tags.some(t => ["amazônia", "floresta", "pantanal", "eco", "natureza"].some(k => t.includes(k)));
  const hasPool = amenities.some(a => a.includes("piscina"));
  const hasRestaurant = amenities.some(a => a.includes("restaurante") || a.includes("café"));
  const hasSpa = amenities.some(a => a.includes("spa") || a.includes("massagem"));
  const isChale = tags.some(t => t.includes("chalé") || t.includes("chale")) || name.includes("chalé");

  const photos: PhotoSet = [{ url: hotel.image, caption: hotel.name }];

  if (isBeach) photos.push(...BEACH.slice(0, 3));
  else if (isJungle) photos.push(...JUNGLE.slice(0, 3));
  else if (isMountain) photos.push(...MOUNTAIN.slice(0, 3));
  else photos.push(...CITY.slice(0, 3));

  if (isChale) photos.push(...CHALE.slice(0, 2));
  else photos.push(...ROOMS.slice(0, 2));

  if (hasPool) photos.push(...POOL.slice(0, 2));
  if (hasRestaurant) photos.push(...RESTAURANT.slice(0, 2));
  if (hasSpa) photos.push(...SPA.slice(0, 1));

  // Fill up to 10 with region-appropriate extras
  if (photos.length < 6) {
    photos.push(...ROOMS.slice(photos.length - 1, 6 - photos.length + 1));
  }

  return photos.slice(0, 12);
}

export type { PhotoSet };
