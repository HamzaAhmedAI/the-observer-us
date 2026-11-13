/* ============================================================
   The Observer US — Dynamic News Sitemap (Google News)
   Google News spec: only articles from the last 48 hours,
   max 1000 URLs. Older articles stay in the regular sitemap
   and RSS — they do not belong here.
   ============================================================ */

import { getArticles } from '@/lib/cms'
import { SITE_URL } from '@/lib/seo'

const NEWS_WINDOW_MS = 48 * 60 * 60 * 1000 // 48 hours

export async function GET() {
  // Pull the last 1000 published articles, then keep only the ones
  // published in the last 48 hours (Google News spec).
  const articles = await getArticles({ limit: 1000 })
  const cutoff = Date.now() - NEWS_WINDOW_MS

  const newsUrls = articles.data
    .filter((article) => new Date(article.publishedAt).getTime() >= cutoff)
    .map(
      (article) => `
    <url>
      <loc>${SITE_URL}/${article.category.slug}/${article.slug}</loc>
      <news:news>
        <news:publication>
          <news:name>The Observer US</news:name>
          <news:language>en-us</news:language>
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
