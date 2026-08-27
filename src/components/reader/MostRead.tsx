/* ============================================================
   MostRead — "Most Read" sidebar widget
   Server Component — reads top N articles by viewCount.
   ============================================================ */

import Link from 'next/link'
import { getMostRead } from '@/lib/cms'
import { RelativeTime } from './RelativeTime'

interface MostReadProps {
  category?: string
  excludeId?: string
  limit?: number
}

export async function MostRead({ category, excludeId, limit = 5 }: MostReadProps) {
  const articles = await getMostRead({ category, excludeId, limit })
  if (articles.length === 0) return null

  return (
    <section aria-labelledby="most-read-heading" className="rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-card)]">
      <h2 id="most-read-heading" className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)]">
        Most Read
      </h2>
      <ol className="space-y-4">
        {articles.map((article, i) => (
          <li key={article.id} className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-[11px] font-bold text-[var(--color-text-on-brand)]">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <Link
                href={`/${article.category.slug}/${article.slug}`}
                className="block text-sm font-semibold leading-snug text-[var(--color-text-primary)] no-underline transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-brand)]"
              >
                {article.title}
              </Link>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-[var(--color-text-tertiary)]">
                <span className="truncate max-w-[100px]">{article.author.name}</span>
                <span aria-hidden="true">&middot;</span>
                <RelativeTime date={article.publishedAt} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
