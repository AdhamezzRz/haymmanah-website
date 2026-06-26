import { MetadataRoute } from 'next'
import { services } from '@/lib/services'
import { work } from '@/lib/work'
import { insights } from '@/lib/insights'

const BASE = 'https://haymanah.sa'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['/', '/services', '/work', '/about', '/approach', '/insights', '/contact'].map(r => ({
    url: `${BASE}${r}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: r === '/' ? 1 : 0.8,
  }))

  const serviceRoutes = services.map(s => ({
    url: `${BASE}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const workRoutes = work.map(c => ({
    url: `${BASE}/work/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const insightRoutes = insights.map(i => ({
    url: `${BASE}/insights/${i.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...serviceRoutes, ...workRoutes, ...insightRoutes]
}
