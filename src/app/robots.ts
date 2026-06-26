import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/styleguide'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/insights/', '/services/', '/about', '/work/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/insights/', '/services/', '/about', '/work/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/insights/', '/services/', '/about', '/work/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: ['/insights/', '/services/', '/about', '/work/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
    ],
    sitemap: 'https://haymanah.sa/sitemap.xml',
    host: 'https://haymanah.sa',
  }
}
