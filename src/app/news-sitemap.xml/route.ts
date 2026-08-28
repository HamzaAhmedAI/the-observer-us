/* ============================================================
   The Observer US — Dynamic News Sitemap (Google News)
   Serves the most recent published articles (no time filter)
   so Google News can index the full catalog. Cap at 1000
   URLs (Google News spec). Switch to a 48h window once the
   site is publishing 50+ articles/day.
   ============================================================ */

import { getArticles } from '@/lib/cms'
import { SITE_URL } from '@/lib/seo'

export async function GET() {
  // Pull the last 1000 published articles (no time filter). Google News
  // accepts up to 1000 URLs in a news sitemap, and a brand-new site
  // benefits from showing its full catalog so the crawler can index
  // the site holistically. Switch to a 48h window once you're
  // publishing 50+ articles/day.
  const articles = await getArticles({ limit: 1000 })

  const newsUrls = articles.data
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
