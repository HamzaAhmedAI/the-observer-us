/* ============================================================
   The Observer US — Dynamic News Sitemap (Google News)
   Serves articles published within the last 48 hours.
   ============================================================ */

import { getArticles } from '@/lib/cms'
import { SITE_URL } from '@/lib/seo'

export async function GET() {
  const articles = await getArticles({ limit: 50 })
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)

  const newsUrls = articles.data
    .filter((article) => new Date(article.publishedAt) > fortyEightHoursAgo)
    .map(
      (article) => `
    <url>
      <loc>${SITE_URL}/${article.category.slug}/${article.slug}</loc>
      <news:news>
        <news:publication>
          <news:name>The Observer US</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${article.publishedAt}</news:publication_date>
        <news:title>${escapeXml(article.title)}</news:title>
      </news:news>
    </url>`
    )
    .join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${newsUrls}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=600, s-maxage=600',
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
