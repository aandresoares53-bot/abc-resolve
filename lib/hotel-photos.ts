type HotelLike = {
  type: string;
  tags: string[];
  region: string;
  amenities: string[];
  name: string;
  city: string;
  state: string;
  image: string;
};

export type PhotoSet = { url: string; caption: string }[];

const U = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

// ---- Curated photo banks by environment ----

const NORDESTE_PRAIA: PhotoSet = [
  { url: U("photo-1559494007-9f5847c49d94"), caption: "Praia nordestina" },
  { url: U("photo-1507525428034-b723cf961d3e"), caption: "Mar azul do Nordeste" },
  { url: U("photo-1544551763-46a013bb70d5"), caption: "Orla paradisíaca" },
  { url: U("photo-1519046904884-53103b34b206"), caption: "Praia deserta" },
  { url: U("photo-1455156218388-5e61b526818b"), caption: "Litoral do Nordeste" },
  { url: U("photo-1510414842594-a61c69b5ae57"), caption: "Pôr do sol na praia" },
];

const SUL_PRAIA: PhotoSet = [
  { url: U("photo-1507525428034-b723cf961d3e"), caption: "Praia do Sul do Brasil" },
  { url: U("photo-1473116763249-2faaef81ccda"), caption: "Litoral catarinense" },
  { url: U("photo-1559494007-9f5847c49d94"), caption: "Mar do Sul" },
  { url: U("photo-1550989460-0adf9ea622e2"), caption: "Orla gaúcha" },
  { url: U("photo-1519046904884-53103b34b206"), caption: "Praia limpa" },
];

const SUDESTE_PRAIA: PhotoSet = [
  { url: U("photo-1544551763-46a013bb70d5"), caption: "Praia do Rio de Janeiro" },
  { url: U("photo-1507525428034-b723cf961d3e"), caption: "Litoral sudeste" },
  { url: U("photo-1519046904884-53103b34b206"), caption: "Mar tropical" },
  { url: U("photo-1510414842594-a61c69b5ae57"), caption: "Pôr do sol na orla" },
  { url: U("photo-1455156218388-5e61b526818b"), caption: "Costa verde" },
];

const SERRA_MONTANHA: PhotoSet = [
  { url: U("photo-1464822759023-fed622ff2c3b"), caption: "Vista das montanhas" },
  { url: U("photo-1501854140801-50d01698950b"), caption: "Paisagem serrana" },
  { url: U("photo-1506905925346-21bda4d32df4"), caption: "Serra com neblina" },
  { url: U("photo-1486870591958-9b9d0d1dda99"), caption: "Montanhas ao amanhecer" },
  { url: U("photo-1510915228340-29c85a43dcfe"), caption: "Vale da serra" },
  { url: U("photo-1548345680-f5475ea5df84"), caption: "Chalé na serra" },
];

const SERRA_GAUCHA: PhotoSet = [
  { url: U("photo-1510915228340-29c85a43dcfe"), caption: "Serra Gaúcha" },
  { url: U("photo-1464822759023-fed622ff2c3b"), caption: "Vindima na serra" },
  { url: U("photo-1501854140801-50d01698950b"), caption: "Colinas com vinhedos" },
  { url: U("photo-1548345680-f5475ea5df84"), caption: "Chalé europeu" },
  { url: U("photo-1506905925346-21bda4d32df4"), caption: "Gramado e neblina" },
];

const CHAPADA: PhotoSet = [
  { url: U("photo-1516026672322-bc52d61a55d5"), caption: "Chapada Diamantina" },
  { url: U("photo-1501854140801-50d01698950b"), caption: "Cachoeira na chapada" },
  { url: U("photo-1464822759023-fed622ff2c3b"), caption: "Vista da chapada" },
  { url: U("photo-1448375240586-882707db888b"), caption: "Natureza exuberante" },
  { url: U("photo-1518895312237-a9e23508077d"), caption: "Trilha ecológica" },
];

const AMAZONIA: PhotoSet = [
  { url: U("photo-1516026672322-bc52d61a55d5"), caption: "Floresta amazônica" },
  { url: U("photo-1448375240586-882707db888b"), caption: "Mata nativa" },
  { url: U("photo-1518895312237-a9e23508077d"), caption: "Ecoturismo" },
  { url: U("photo-1497436072909-60f360e1d4b1"), caption: "Rio na floresta" },
  { url: U("photo-1559827260-dc66d52bef19"), caption: "Natureza selvagem" },
];

const PANTANAL: PhotoSet = [
  { url: U("photo-1559559228-67c1be5c5f1a"), caption: "Pantanal" },
  { url: U("photo-1516026672322-bc52d61a55d5"), caption: "Vida selvagem" },
  { url: U("photo-1559827260-dc66d52bef19"), caption: "Fauna do pantanal" },
  { url: U("photo-1448375240586-882707db888b"), caption: "Natureza do Centro-Oeste" },
];

const FAZENDA_RURAL: PhotoSet = [
  { url: U("photo-1500382017468-9049fed747ef"), caption: "Campo aberto" },
  { url: U("photo-1464822759023-fed622ff2c3b"), caption: "Paisagem rural" },
  { url: U("photo-1548345680-f5475ea5df84"), caption: "Propriedade rural" },
  { url: U("photo-1510915228340-29c85a43dcfe"), caption: "Fazenda brasileira" },
  { url: U("photo-1501854140801-50d01698950b"), caption: "Interior do país" },
];

const POUSADA_CHARME: PhotoSet = [
  { url: U("photo-1571896349842-33c89424de2d"), caption: "Pousada charmosa" },
  { url: U("photo-1522771739844-6a9f6d5f14af"), caption: "Área de descanso" },
  { url: U("photo-1455587734955-081b22074882"), caption: "Pousada aconchegante" },
  { url: U("photo-1542314831-068cd1dbfeeb"), caption: "Recepção da pousada" },
];

const HOTEL_URBANO: PhotoSet = [
  { url: U("photo-1542314831-068cd1dbfeeb"), caption: "Hotel urbano" },
  { url: U("photo-1571896349842-33c89424de2d"), caption: "Lobby do hotel" },
  { url: U("photo-1455587734955-081b22074882"), caption: "Hotel moderno" },
  { url: U("photo-1522771739844-6a9f6d5f14af"), caption: "Área comum" },
];

const QUARTOS_LUXO: PhotoSet = [
  { url: U("photo-1631049307264-da0ec9d70304"), caption: "Quarto luxuoso" },
  { url: U("photo-1618773928121-c32242e63f39"), caption: "Suíte master" },
  { url: U("photo-1596701062351-8ac031b6636a"), caption: "Cama king confortável" },
  { url: U("photo-1611892440504-42a792e24d32"), caption: "Suíte com banheiro" },
  { url: U("photo-1582719478250-c89cae4dc85b"), caption: "Quarto deluxe" },
];

const QUARTOS_STANDARD: PhotoSet = [
  { url: U("photo-1590490360182-c33d57733427"), caption: "Quarto standard" },
  { url: U("photo-1631049307264-da0ec9d70304"), caption: "Quarto confortável" },
  { url: U("photo-1484154218962-a197022b5858"), caption: "Quarto aconchegante" },
  { url: U("photo-1595576508898-0ad5c879a061"), caption: "Quarto duplo" },
];

const PISCINA: PhotoSet = [
  { url: U("photo-1575429198097-0414ec08e8cd"), caption: "Piscina do hotel" },
  { url: U("photo-1596386461350-326ccb383e9f"), caption: "Piscina ao ar livre" },
  { url: U("photo-1543489822-c49534f3271f"), caption: "Área da piscina" },
];

const RESTAURANTE: PhotoSet = [
  { url: U("photo-1414235077428-338989a2e8c0"), caption: "Restaurante do hotel" },
  { url: U("photo-1555396273-367ea4eb4db5"), caption: "Café da manhã" },
  { url: U("photo-1565299624946-b28f40a0ae38"), caption: "Gastronomia local" },
];

// ---- Environment detection ----

function detectEnv(hotel: HotelLike) {
  const tags = hotel.tags.map(t => t.toLowerCase()).join(" ");
  const city = hotel.city.toLowerCase();
  const state = hotel.state.toLowerCase();

  const isBeach = /praia|mar|litoral|costa|ilha|orla/.test(tags);
  const isMountain = /serra|montanha|chapada|chalet|gramo/.test(tags);
  const isJungle = /amazônia|floresta|pantanal|eco|selva|manguezal/.test(tags);
  const isFazenda = /fazenda|rural|sítio|campo|haras|cacau/.test(tags);
  const hasPool = hotel.amenities.some(a => /piscina/.test(a.toLowerCase()));
  const isLuxury = hotel.type === "hotel" && hotel.amenities.length > 6;

  // Beach region detection
  const nordeste = /ba|ce|pe|rn|pb|pi|ma|al|se/.test(state);
  const sul = /sc|rs/.test(state);
  const sudeste = /rj|es/.test(state);

  return { isBeach, isMountain, isJungle, isFazenda, hasPool, isLuxury, nordeste, sul, sudeste, state, tags };
}

function getHotelPhotosFallback(hotel: HotelLike): PhotoSet {
  const env = detectEnv(hotel);
  const photos: PhotoSet = [{ url: hotel.image, caption: hotel.name }];

  // Choose primary environment photos
  if (env.isBeach) {
    if (env.nordeste) photos.push(...NORDESTE_PRAIA.slice(0, 4));
    else if (env.sul) photos.push(...SUL_PRAIA.slice(0, 4));
    else photos.push(...SUDESTE_PRAIA.slice(0, 4));
  } else if (env.isMountain) {
    if (/rs|sc/.test(env.state) || /gramado|canela|bento/.test(hotel.city.toLowerCase()))
      photos.push(...SERRA_GAUCHA.slice(0, 4));
    else if (/chapada/.test(env.tags))
      photos.push(...CHAPADA.slice(0, 4));
    else
      photos.push(...SERRA_MONTANHA.slice(0, 4));
  } else if (env.isJungle) {
    photos.push(...AMAZONIA.slice(0, 4));
  } else if (env.isFazenda) {
    photos.push(...FAZENDA_RURAL.slice(0, 4));
  } else {
    // Urban / generic
    if (hotel.type === "pousada") photos.push(...POUSADA_CHARME.slice(0, 3));
    else photos.push(...HOTEL_URBANO.slice(0, 3));
  }

  // Add pool if exists
  if (env.hasPool) photos.push(PISCINA[0], PISCINA[1]);

  // Add room photos
  if (env.isLuxury) photos.push(...QUARTOS_LUXO.slice(0, 2));
  else photos.push(...QUARTOS_STANDARD.slice(0, 2));

  // Add restaurant
  photos.push(RESTAURANTE[0]);

  return photos.slice(0, 10);
}

// Build smart Pixabay queries — NEVER use hotel name, use environment + location
function buildQueries(hotel: HotelLike): string[] {
  const env = detectEnv(hotel);
  const queries: string[] = [];

  if (env.isBeach) {
    // Use state/city + beach keywords for more accurate results
    queries.push(`praia ${hotel.city}`, `beach ${hotel.city}`, "praia tropical Brasil");
    if (env.nordeste) queries.push("praia nordeste Brasil beach", "litoral baiano beach");
    else if (env.sul) queries.push("praia santa catarina rio grande do sul");
    else queries.push("praia rio de janeiro espirito santo");
  } else if (env.isMountain) {
    if (/rs|sc/.test(env.state)) queries.push("serra gaúcha gramado vinhedos", "chalé serra gaúcha");
    else if (/chapada/.test(env.tags)) queries.push("chapada diamantina bahia", "chapada cachoeira");
    else queries.push(`serra ${hotel.city}`, "montanha brasil natureza");
  } else if (env.isJungle) {
    queries.push(`amazônia ${hotel.state}`, "floresta tropical amazônia", "ecoturismo brasil");
  } else if (env.isFazenda) {
    queries.push(`fazenda ${hotel.city}`, "fazenda turismo rural brasil", "campo interior brasil");
  } else {
    queries.push(`${hotel.city} hotel`, `${hotel.city} turismo`);
  }

  // Always add generic hotel interior queries
  if (env.hasPool) queries.push("hotel pool luxury resort");
  if (env.isLuxury) queries.push("luxury hotel room suite");
  else queries.push("hotel quarto confortável");
  queries.push("hotel breakfast cafe da manha");

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
      const url = `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(q)}&image_type=photo&per_page=5&safesearch=true&orientation=horizontal&min_width=800&editors_choice=false&order=popular`;
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

export function getHotelPhotos(hotel: HotelLike): PhotoSet {
  return getHotelPhotosFallback(hotel);
}
