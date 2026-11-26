export interface PexelsPhoto {
  url: string;
  caption: string;
}

function buildPexelsQuery(hotelName: string, city: string, state: string, tags: string[]): string[] {
  const t = tags.join(" ").toLowerCase();
  const isBeach = /praia|mar|litoral|costa/.test(t);
  const isMountain = /serra|montanha|chapada|chalé/.test(t);
  const isJungle = /amazônia|floresta|pantanal|eco/.test(t);

  const queries: string[] = [];

  // Try hotel name + city first (may find the actual hotel)
  queries.push(`${hotelName} ${city}`);

  // Environment-specific queries in Portuguese and English
  if (isBeach) {
    queries.push(`praia ${city} hotel`, `${city} beach hotel`, "hotel piscina praia brasil");
  } else if (isMountain) {
    queries.push(`${city} pousada montanha`, `${city} hotel serra`, "hotel montanha brasil chalé");
  } else if (isJungle) {
    queries.push(`${city} hotel amazônia`, "eco lodge amazônia brasil", "floresta tropical hotel");
  } else {
    queries.push(`${city} hotel`, "pousada brasil quarto");
  }

  queries.push("hotel quarto luxo brasil", "pousada aconchegante interior");
  return queries;
}

export async function fetchPexelsPhotos(
  hotelName: string,
  city: string,
  state: string,
  tags: string[]
): Promise<PexelsPhoto[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];

  const queries = buildPexelsQuery(hotelName, city, state, tags);
  const seen = new Set<string>();
  const photos: PexelsPhoto[] = [];

  for (const q of queries) {
    if (photos.length >= 8) break;
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=5&orientation=landscape`,
        {
          headers: { Authorization: key },
          next: { revalidate: 86400 },
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      for (const photo of data.photos ?? []) {
        const url: string = photo.src?.large ?? photo.src?.medium;
        if (!url || seen.has(url)) continue;
        seen.add(url);
        photos.push({ url, caption: photo.alt ?? q });
        if (photos.length >= 8) break;
      }
    } catch {}
  }

  return photos;
}
