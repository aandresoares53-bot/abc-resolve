import { MetadataRoute } from 'next'
import { hotelsData } from '@/lib/hotels-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://encontrar-hoteis-pousadas.vercel.app'

  const hotelUrls = hotelsData.map(h => ({
    url: `${base}/hotel/${h.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/favoritos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${base}/mapa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    ...hotelUrls,
  ]
}
