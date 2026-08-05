/* ============================================================
   The Observer US — Dynamic RSS Feed
   ============================================================ */

import { getArticles } from '@/lib/cms'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/seo'

export async function GET() {
  const articles = await getArticles({ limit: 20 })

  const items = articles.data
    .map(
      (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${SITE_URL}/${article.category.slug}/${article.slug}</link>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <guid>${SITE_URL}/${article.category.slug}/${article.slug}</guid>
      <category>${escapeXml(article.category.name)}</category>
      <author>${escapeXml(article.author.name)}</author>
      <enclosure url="${escapeXml(article.featuredImage.url)}" type="image/jpeg" length="0" />
    </item>`
    )
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
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
