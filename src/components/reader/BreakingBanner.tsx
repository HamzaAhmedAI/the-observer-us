/* ============================================================
   BreakingBanner — site-wide red bar for breaking news.
   RSC: pulls latest isBreaking article. Sticky top, dismissable per session.
   ============================================================ */

import Link from 'next/link'
import { getBreakingArticles } from '@/lib/cms'
import { BreakingBannerClient } from './BreakingBannerClient'

export async function BreakingBanner() {
  const breaking = await getBreakingArticles(1)
  if (breaking.length === 0) return null

  const article = breaking[0]
  return (
    <BreakingBannerClient
      href={`/${article.category.slug}/${article.slug}`}
      label={article.title}
    />
  )
}
