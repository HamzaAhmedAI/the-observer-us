/* ============================================================
   The Observer US — Pages Sitemap (/sitemap.xml)
   Static pages + category feeds. Articles live in
   /news-sitemap.xml (Google News format). Both are listed
   in robots.txt so crawlers find the full site.
   ============================================================ */

import { SITE_URL } from '@/lib/seo'
import { NAV_CATEGORIES } from '@/lib/nav'

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
]

export async function GET() {
  const now = new Date().toISOString()

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
