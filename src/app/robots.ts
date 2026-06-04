import type { MetadataRoute } from 'next'

const BASE_URL = 'https://undangmanah.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/weddings', '/events'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
