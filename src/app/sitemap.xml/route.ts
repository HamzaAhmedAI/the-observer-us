/* ============================================================
   The Observer US — Pages Sitemap (/sitemap.xml)
   Static pages + category feeds + ALL published articles.
   The news sitemap only keeps the last 48 hours, so articles
   must live here too — otherwise anything older than 48h is
   in no sitemap at all and Google has to find it by links alone.
   ============================================================ */

import { SITE_URL } from '@/lib/seo'
import { NAV_CATEGORIES } from '@/lib/nav'
import { getArticles } from '@/lib/cms'

// Render on every request, like the news sitemap: a static build-time
// snapshot goes stale the moment a new article publishes (the cron
// publishes twice a day, no rebuild in between).
export const dynamic = 'force-dynamic'

const STATIC_PAGES: Array<{ path: string; priority: string; changefreq: string }> = [
  { path: '/', priority: '1.0', changefreq: 'hourly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.4', changefreq: 'yearly' },
  { path: '/terms', priority: '0.4', changefreq: 'yearly' },
  { path: '/cookies', priority: '0.3', changefreq: 'yearly' },
  { path: '/affiliate-disclosure', priority: '0.4', changefreq: 'yearly' },
  { path: '/advertise', priority: '0.5', changefreq: 'monthly' },
  { path: '/careers', priority: '0.4', changefreq: 'monthly' },
  { path: '/sitemap', priority: '0.3', changefreq: 'weekly' },
  { path: '/tools', priority: '0.7', changefreq: 'weekly' },
  { path: '/tools/72-hour-kit', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/home-insurance-cost', priority: '0.8', changefreq: 'monthly' },
  { path: '/tools/food-storage-planner', priority: '0.8', changefreq: 'monthly' },
]

export async function GET() {
  const now = new Date().toISOString()
  const articles = await getArticles({ limit: 1000 })

  const urls = [
    ...STATIC_PAGES.map(
      (p) => `
    <url>
      <loc>${SITE_URL}${p.path}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>${p.changefreq}</changefreq>
      <priority>${p.priority}</priority>
    </url>`
    ),
    ...NAV_CATEGORIES.map(
      (c) => `
    <url>
      <loc>${SITE_URL}${c.href}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>hourly</changefreq>
      <priority>0.8</priority>
    </url>`
    ),
    ...articles.data.map(
      (article) => `
    <url>
      <loc>${SITE_URL}/${article.category.slug}/${article.slug}</loc>
      <lastmod>${article.publishedAt}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`
    ),
  ].join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
