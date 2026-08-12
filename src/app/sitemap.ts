import { MetadataRoute } from 'next'
import { services } from '@/lib/services'
import { work } from '@/lib/work'
import { insights } from '@/lib/insights'

const BASE = 'https://haymanah.sa'

function parseDate(d: string): Date {
  const arabic: Record<string, string> = { '٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9' }
  const iso = d.split('').map(c => arabic[c] ?? c).join('')
  return new Date(iso)
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,         lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/services`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/work`,     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/about`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/approach`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/insights`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/contact`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms`,   lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const serviceRoutes: MetadataRoute.Sitemap = services.map(s => ({
    url: `${BASE}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  const workRoutes: MetadataRoute.Sitemap = work.map(c => ({
    url: `${BASE}/work/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const insightRoutes: MetadataRoute.Sitemap = insights.map(i => ({
    url: `${BASE}/insights/${i.slug}`,
    lastModified: parseDate(i.date),
    changeFrequency: 'monthly',
    priority: 0.65,
  }))

  return [...staticRoutes, ...serviceRoutes, ...workRoutes, ...insightRoutes]
}
