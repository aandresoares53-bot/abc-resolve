export interface TripAdvisorPhoto {
  url: string;
  caption: string;
}

const BASE = "https://api.content.tripadvisor.com/api/v1";

export async function fetchTripAdvisorPhotos(
  hotelName: string,
  city: string
): Promise<TripAdvisorPhoto[]> {
  const key = process.env.TRIPADVISOR_API_KEY;
  if (!key) return [];

  try {
    const searchUrl = `${BASE}/location/search?searchQuery=${encodeURIComponent(hotelName + " " + city)}&category=hotels&language=pt&key=${key}`;
    const searchRes = await fetch(searchUrl, { next: { revalidate: 86400 } });
    if (!searchRes.ok) return [];
    const searchData = await searchRes.json();

    const locations: any[] = searchData.data ?? [];
    if (!locations.length) return [];

    const normHotel = hotelName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const best = locations.find(l => {
      const normName = (l.name ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
      return normName.includes(normHotel.slice(0, 8)) || normHotel.includes(normName.slice(0, 8));
    }) ?? locations[0];

    if (!best?.location_id) return [];

    const photoUrl = `${BASE}/location/${best.location_id}/photos?language=pt&limit=8&key=${key}`;
    const photoRes = await fetch(photoUrl, { next: { revalidate: 86400 } });
    if (!photoRes.ok) return [];
    const photoData = await photoRes.json();

    return (photoData.data ?? [])
      .filter((p: any) => p.images?.large?.url || p.images?.medium?.url)
      .map((p: any) => ({
        url: (p.images.large?.url ?? p.images.medium?.url) as string,
        caption: p.caption ?? hotelName,
      }))
      .slice(0, 8);
  } catch {
    return [];
  }
}
