import { Hotel } from "@/lib/hotels-data";

const REGION_BY_STATE: Record<string, string> = {
  AC:"Norte",AM:"Norte",AP:"Norte",PA:"Norte",RO:"Norte",RR:"Norte",TO:"Norte",
  AL:"Nordeste",BA:"Nordeste",CE:"Nordeste",MA:"Nordeste",PB:"Nordeste",
  PE:"Nordeste",PI:"Nordeste",RN:"Nordeste",SE:"Nordeste",
  DF:"Centro-Oeste",GO:"Centro-Oeste",MS:"Centro-Oeste",MT:"Centro-Oeste",
  ES:"Sudeste",MG:"Sudeste",RJ:"Sudeste",SP:"Sudeste",
  PR:"Sul",RS:"Sul",SC:"Sul",
};

function priceFromStars(stars: number): [number, number] {
  const map: Record<number, [number, number]> = {
    1:[60,120], 2:[100,220], 3:[180,380], 4:[320,650], 5:[550,1400]
  };
  return map[stars] ?? [180,380];
}

function pickImage(state: string): string {
  if (/BA|CE|PE|RN|PB|PI|MA|AL|SE/.test(state))
    return "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&q=80";
  if (/RJ|ES|SC|RS/.test(state))
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";
  if (/AM|PA|AC|RO|RR|AP|TO/.test(state))
    return "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80";
  if (/MG|SP|PR/.test(state))
    return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80";
  return "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80";
}

function osmTypeToHotelType(tourism: string): Hotel["type"] {
  if (tourism === "guest_house") return "pousada";
  return "hotel";
}

function normalizeForDedup(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
}

export function normalizeNameForDedup(name: string): string {
  return normalizeForDedup(name);
}

export async function fetchOSMHotels(
  city: string,
  state: string,
  existingNames: Set<string>
): Promise<Hotel[]> {
  try {
    // 1. Geocode city with Nominatim
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ", " + state + ", Brasil")}&format=json&limit=1&countrycodes=br`;
    const geoRes = await fetch(geoUrl, {
      headers: { "User-Agent": "encontrar-hoteis-pousadas/1.0 (educational)" },
      next: { revalidate: 86400 },
    });
    if (!geoRes.ok) return [];
    const geoData = await geoRes.json();
    if (!geoData[0]?.boundingbox) return [];

    const [south, north, west, east] = geoData[0].boundingbox as string[];
    const s = parseFloat(south) - 0.05;
    const n = parseFloat(north) + 0.05;
    const w = parseFloat(west) - 0.05;
    const e = parseFloat(east) + 0.05;

    // 2. Overpass query
    const query = `[out:json][timeout:12];
(
  node["tourism"~"hotel|guest_house|hostel"](${s},${w},${n},${e});
  way["tourism"~"hotel|guest_house|hostel"](${s},${w},${n},${e});
  relation["tourism"~"hotel|guest_house|hostel"](${s},${w},${n},${e});
);
out center tags;`;

    const osmRes = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
      { next: { revalidate: 3600 } }
    );
    if (!osmRes.ok) return [];
    const osmData = await osmRes.json();
    const elements: Array<{ id: number; tags?: Record<string, string> }> = osmData.elements ?? [];

    const region = REGION_BY_STATE[state] ?? "Sudeste";
    const results: Hotel[] = [];

    for (const el of elements) {
      const tags = el.tags ?? {};
      const name: string = tags.name ?? "";
      if (!name) continue;
      if (existingNames.has(normalizeForDedup(name))) continue;

      const tourism = tags.tourism ?? "hotel";
      const type = osmTypeToHotelType(tourism);
      const starsRaw = parseInt(tags.stars ?? tags["stars:official"] ?? "3");
      const stars = Math.min(5, Math.max(1, isNaN(starsRaw) ? 3 : starsRaw));
      const [priceFrom, priceTo] = priceFromStars(stars);
      const rating = Math.round((7.2 + (stars - 1) * 0.45) * 10) / 10;

      const amenities: string[] = ["Wi-Fi"];
      if (tags.swimming_pool === "yes") amenities.push("Piscina");
      if (tags.breakfast === "yes") amenities.push("Café da manhã");
      if (tags.parking === "yes") amenities.push("Estacionamento");
      if (tags.air_conditioning === "yes") amenities.push("Ar-condicionado");
      if (tags.restaurant === "yes") amenities.push("Restaurante");
      if (tags.pets === "yes") amenities.push("Pet-friendly");

      const hotelTags: string[] = [city];
      if (/praia|beach/i.test(name)) hotelTags.push("Praia");
      if (stars >= 4) hotelTags.push("Luxo");
      if (tags.rooms && parseInt(tags.rooms) < 20) hotelTags.push("Boutique");

      // Real photo from OSM tags
      let realImage: string | undefined;
      if (tags.image && tags.image.startsWith("http")) {
        realImage = tags.image;
      } else if (tags.wikimedia_commons) {
        const fileName = tags.wikimedia_commons.replace(/^(File:|Category:)/i, "");
        realImage = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=800`;
      }

      // Website for og:image fetching on detail page
      const website: string | undefined =
        tags.website || tags["contact:website"] || tags["contact:url"] || undefined;

      results.push({
        id: `osm-${el.id}`,
        name,
        type,
        city,
        state,
        region,
        stars,
        rating,
        reviews: 10 + Math.floor(Math.random() * 300),
        priceFrom,
        priceTo,
        image: realImage ?? pickImage(state),
        tags: hotelTags.slice(0, 5),
        amenities: Array.from(new Set(amenities)).slice(0, 7),
        description: tags.description
          ? tags.description.slice(0, 200)
          : `${type === "pousada" ? "Pousada" : "Hotel"} localizado em ${city}, ${state}.`,
        featured: false,
        seasonal: [],
        packageFor: type === "pousada" ? ["Casal"] : ["Negócios"],
        aliases: [],
        website,
      });
    }

    return results;
  } catch (e) {
    console.error("OSM fetch error:", e);
    return [];
  }
}
