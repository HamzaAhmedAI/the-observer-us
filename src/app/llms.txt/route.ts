/* ============================================================
   The Observer US — llms.txt
   Machine-readable site index for LLMs (llmstxt.org format).
   Built from live categories so it stays in sync with the CMS.
   ============================================================ */

import { getCategories } from '@/lib/cms'
import { NAV_CATEGORIES } from '@/lib/nav'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/seo'

export const revalidate = 3600

const ORIGIN = SITE_URL.replace(/\/+$/, '')

export async function GET() {
  // CMS categories when seeded; the fixed nav definition is the fallback
  // so the file stays complete while the CMS is still empty.
  const cmsCategories = await getCategories().catch(() => [])
  const categories =
    cmsCategories.length > 0
      ? cmsCategories
      : NAV_CATEGORIES.map((c) => ({
          name: c.label,
          slug: c.slug,
          description: c.description,
        }))

  const lines: string[] = []
  lines.push(`# ${SITE_NAME}`)
  lines.push('')
  lines.push(`> ${SITE_DESCRIPTION}`)
  lines.push('')
  lines.push('The Observer US covers Home & Wallet Protection: US home costs, bills and')
  lines.push('insurance, household recalls, home scams, data breaches, and off-grid')
  lines.push('preparedness. Each category page lists its latest articles; individual')
  lines.push('articles are available at /{category}/{slug}.')
  lines.push('')
  lines.push('## News')
  lines.push(`- [Home](${ORIGIN}/): Latest home and wallet protection guides and news.`)
  lines.push(`- [Latest](${ORIGIN}/#latest-heading): The most recent stories from the newsroom.`)
  lines.push(`- [RSS Feed](${ORIGIN}/rss.xml): Full syndicated feed of published articles.`)
  lines.push(`- [News Sitemap](${ORIGIN}/news-sitemap.xml): XML sitemap of all articles.`)
  lines.push('')

  if (categories.length > 0) {
    lines.push('## Categories')
    for (const cat of categories) {
      const desc = cat.description?.trim()
        ? `: ${cat.description.trim()}`
        : ''
      lines.push(
        `- [${cat.name}](${ORIGIN}/${cat.slug}/)${desc} — latest ${cat.name.toLowerCase()} articles.`
      )
    }
    lines.push('')
  }

  lines.push('## Pages')
  lines.push(`- [Account Preferences](${ORIGIN}/account/preferences): Manage newsletter and push notification preferences.`)
  lines.push(`- [Unsubscribe](${ORIGIN}/unsubscribe): Unsubscribe from email digests.`)

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
