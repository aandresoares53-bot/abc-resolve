import { MetadataRoute } from 'next'
import { hotelsData } from '@/lib/hotels-data'

function citySlug(city: string): string {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://encontrar-hoteis-pousadas.vercel.app'

  const hotelUrls = hotelsData.map(h => ({
    url: `${base}/hotel/${h.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const cities = Array.from(new Set(hotelsData.map(h => h.city)));
  const cityUrls = cities.map(city => ({
    url: `${base}/hoteis/${citySlug(city)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/mapa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/favoritos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    ...cityUrls,
    ...hotelUrls,
  ]
}
