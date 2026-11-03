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

// Using Unsplash with referrer-policy friendly URLs
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
  { url: U("photo-1418985991508-e47386d96a71"), caption: "Trilha na serra" },
];

const JUNGLE: PhotoSet = [
  { url: U("photo-1516026672322-bc52d61a55d5"), caption: "Floresta tropical" },
  { url: U("photo-1448375240586-882707db888b"), caption: "Mata nativa" },
  { url: U("photo-1518895312237-a9e23508077d"), caption: "Ecoturismo" },
  { url: U("photo-1551632811-561732d1e306"), caption: "Rio na floresta" },
  { url: U("photo-1543164939-3f8e8c56d09b"), caption: "Natureza exuberante" },
];

const CITY: PhotoSet = [
  { url: U("photo-1542314831-068cd1dbfeeb"), caption: "Hotel urbano" },
  { url: U("photo-1571896349842-33c89424de2d"), caption: "Centro histórico" },
  { url: U("photo-1455587734955-081b22074882"), caption: "Skyline urbano" },
  { url: U("photo-1551882547-ff40c63fe5fa"), caption: "Vista noturna" },
  { url: U("photo-1590164649852-eb98702aeee7"), caption: "Vista da cidade" },
];

const ROOMS: PhotoSet = [
  { url: U("photo-1631049307264-da0ec9d70304"), caption: "Quarto luxuoso" },
  { url: U("photo-1590490360182-c33d57733427"), caption: "Quarto standard" },
  { url: U("photo-1618773928121-c32242e63f39"), caption: "Suíte master" },
  { url: U("photo-1596394516093-501ba68a0ba6"), caption: "Cama king size" },
  { url: U("photo-1611892440504-42a792e24d32"), caption: "Banheiro privativo" },
];

const POOL: PhotoSet = [
  { url: U("photo-1575429198097-0414ec08e8cd"), caption: "Piscina" },
  { url: U("photo-1520250497591-112f2f40a3f4"), caption: "Área de lazer" },
  { url: U("photo-1571003123894-1f0594d2b5d9"), caption: "Piscina com vista" },
];

const RESTAURANT: PhotoSet = [
  { url: U("photo-1414235077428-338989a2e8c0"), caption: "Restaurante" },
  { url: U("photo-1504674900247-0877df9cc836"), caption: "Café da manhã" },
];

const CHALE: PhotoSet = [
  { url: U("photo-1568605114967-8130f3a36994"), caption: "Chalé aconchegante" },
  { url: U("photo-1510798831971-661eb04b3739"), caption: "Interior do chalé" },
  { url: U("photo-1482192505345-5852ba2d0afa"), caption: "Chalé na natureza" },
];

const SPA: PhotoSet = [
  { url: U("photo-1544161515-4ab6ce6db874"), caption: "Spa e bem-estar" },
  { url: U("photo-1540555700478-4be289fbecef"), caption: "Relaxamento total" },
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
