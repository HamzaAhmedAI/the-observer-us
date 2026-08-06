/* ============================================================
   The Observer US — llms.txt
   Machine-readable site index for LLMs (llmstxt.org format).
   Built from live categories so it stays in sync with the CMS.
   ============================================================ */

import { getCategories } from '@/lib/cms'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/seo'

export const revalidate = 3600

const ORIGIN = SITE_URL.replace(/\/+$/, '')

export async function GET() {
  const categories = await getCategories().catch(() => [])

  const lines: string[] = []
  lines.push(`# ${SITE_NAME}`)
  lines.push('')
  lines.push(`> ${SITE_DESCRIPTION}`)
  lines.push('')
  lines.push('The Observer US is a news publication covering politics, technology, business,')
  lines.push('sports, entertainment, health, science, and world news. Each category page')
  lines.push('lists its latest articles; individual articles are available at /{category}/{slug}.')
  lines.push('')
  lines.push('## News')
  lines.push(`- [Home](${ORIGIN}/): Latest breaking news and top stories across all coverage.`)
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
