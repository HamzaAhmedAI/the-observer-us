/* ============================================================
   RelatedArticles — "More from this section" widget at end of article.
   Server Component — pulls from same category, sorted by recency.
   ============================================================ */

import { getRelatedArticles } from '@/lib/cms'
import { ArticleCard } from './ArticleCard'

interface RelatedArticlesProps {
  category: string
  excludeId: string
}

export async function RelatedArticles({ category, excludeId }: RelatedArticlesProps) {
  const related = await getRelatedArticles({ category, excludeId, limit: 3 })

  if (related.length === 0) return null

  return (
    <section
      aria-labelledby="related-heading"
      className="container-news mt-16 border-t border-[var(--color-border-light)] pt-12"
    >
      <div className="mb-6 flex items-center gap-3">
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{ backgroundColor: `var(--color-${category})` }}
          aria-hidden="true"
        />
        <h2 id="related-heading" className="text-xl font-bold tracking-tight">
          More from {related[0].category.name}
        </h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}
