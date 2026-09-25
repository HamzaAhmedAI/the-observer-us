/* ============================================================
   The Observer US — Search Page
   Full-text article search. RSC — zero client JS.
   ============================================================ */

import { ArticleCard } from '@/components/reader/ArticleCard'
import { CategorySidebar } from '@/components/reader/CategorySidebar'
import { getArticles } from '@/lib/cms'
import type { Metadata } from 'next'

export const revalidate = 300

interface Props {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  // Strip HTML/script tags from query before using in metadata to prevent XSS
  const safeQuery = (q || '').replace(/<[^>]*>/g, '').trim() || ''

  return {
    title: safeQuery ? `Search: ${safeQuery}` : 'Search',
    description: safeQuery
      ? `Search results for "${safeQuery}" on The Observer US.`
      : 'Search all articles on The Observer US.',
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  // Strip HTML/script tags from query for defense-in-depth
  const query = (q || '').replace(/<[^>]*>/g, '').trim() || ''

  let results: Awaited<ReturnType<typeof getArticles>> = { data: [], total: 0, page: 1, pageSize: 12, hasMore: false }

  try {
    const [articlesData] = await Promise.all([
      getArticles({ limit: 24 }),
    ])
    results = articlesData
  } catch (error) {
    console.error('SearchPage: fetch failed', error)
  }

  // Filter client-side for now (Payload 3.87 local API lacks robust text search).
  // For a larger catalog, replace this with a Postgres full-text search
  // via a dedicated /api/search route.
  const filtered = query
    ? results.data.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          a.author.name.toLowerCase().includes(query.toLowerCase()) ||
          (a.tags || []).some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : results.data

  return (
    <div className="container-news py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {query ? `Search: "${query}"` : 'Search'}
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)]">
          {query
            ? `${filtered.length} ${filtered.length === 1 ? 'result' : 'results'} found`
            : 'Browse all articles'}
        </p>
      </div>

      {/* Search form */}
      <form action="/search" method="get" className="mb-8">
        <div className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search articles, authors, topics..."
            className="flex-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20"
            aria-label="Search articles"
          />
          <button
            type="submit"
            className="rounded-[var(--radius-sm)] bg-[var(--color-brand)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-hover)]"
          >
            Search
          </button>
        </div>
      </form>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article, i) => (
            <ArticleCard key={article.id} article={article} priority={i < 3} />
          ))}
        </div>
      ) : query ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-[var(--color-text-secondary)]">
            No articles found for &ldquo;{query}&rdquo;
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">
            Try different keywords or browse our categories.
          </p>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)]">
              All Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {results.data.map((article, i) => (
                <ArticleCard key={article.id} article={article} priority={i < 3} />
              ))}
            </div>
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <CategorySidebar />
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}