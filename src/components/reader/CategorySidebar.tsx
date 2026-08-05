/* ============================================================
   The Observer US — Category Sidebar
   Trending articles + category navigation.
   RSC — fetches its own data, zero client JS.
   ============================================================ */

import Link from 'next/link'
import { getArticles, getCategories } from '@/lib/cms'
import type { Category } from '@/types/article'

interface CategorySidebarProps {
  currentCategory?: string
}

function Skeleton() {
  return (
    <aside className="space-y-8" aria-label="Sidebar">
      {/* Trending skeleton */}
      <div>
        <div className="mb-4 h-6 w-24 animate-pulse rounded bg-[var(--color-surface-alt)]" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-4 w-full animate-pulse rounded bg-[var(--color-surface-alt)]" />
              <div className="h-3 w-20 animate-pulse rounded bg-[var(--color-surface-alt)]" />
            </div>
          ))}
        </div>
      </div>

      {/* Categories skeleton */}
      <div>
        <div className="mb-4 h-6 w-28 animate-pulse rounded bg-[var(--color-surface-alt)]" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-5 w-32 animate-pulse rounded bg-[var(--color-surface-alt)]" />
          ))}
        </div>
      </div>
    </aside>
  )
}

export async function CategorySidebar({ currentCategory }: CategorySidebarProps) {
  let categories: Category[] = []
  let trending: { title: string; slug: string; category: Category; publishedAt: string }[] = []

  try {
    const [categoriesData, articlesData] = await Promise.all([
      getCategories(),
      getArticles({ limit: 5 }),
    ])
    categories = categoriesData
    trending = articlesData.data.map((a) => ({
      title: a.title,
      slug: a.slug,
      category: a.category,
      publishedAt: a.publishedAt,
    }))
  } catch (error) {
    console.error('CategorySidebar: failed to fetch data', error)
  }

  if (categories.length === 0 && trending.length === 0) {
    return <Skeleton />
  }

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <aside className="space-y-10" aria-label="Sidebar">
      {/* Trending */}
      {trending.length > 0 && (
        <section aria-labelledby="sidebar-trending">
          <h3
            id="sidebar-trending"
            className="mb-4 border-b border-[var(--color-border)] pb-2.5 text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)]"
          >
            Trending
          </h3>
          <ol className="space-y-3">
            {trending.map((item, index) => (
              <li key={item.slug}>
                <Link
                  href={`/${item.category.slug}/${item.slug}`}
                  className="group block no-underline"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-[11px] font-bold leading-none shadow-sm"
                      style={{
                        backgroundColor: `var(--color-${item.category.slug})`,
                        color: '#fff',
                      }}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium leading-snug text-[var(--color-text-primary)] transition-colors duration-[var(--duration-fast)] group-hover:text-[var(--color-brand)]">
                        {item.title}
                      </p>
                      <p className="mt-1.5 text-xs text-[var(--color-text-tertiary)]">
                        {item.category.name}
                        <span className="mx-1.5" aria-hidden="true">&middot;</span>
                        {dateFormatter.format(new Date(item.publishedAt))}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section aria-labelledby="sidebar-categories">
          <h3
            id="sidebar-categories"
            className="mb-4 border-b border-[var(--color-border)] pb-2.5 text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-tertiary)]"
          >
            Categories
          </h3>
          <nav aria-label="Category navigation">
            <ul className="space-y-0.5">
              <li>
                <Link
                  href="/"
                  className={`block rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium no-underline transition-all duration-[var(--duration-fast)] ${
                    !currentCategory
                      ? 'bg-[var(--color-brand-subtle)] text-[var(--color-brand)] font-semibold'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  All News
                </Link>
              </li>
              {categories.map((cat) => {
                const isActive = currentCategory === cat.slug
                return (
                  <li key={cat.id}>
                    <Link
                      href={`/${cat.slug}`}
                      className={`flex items-center justify-between rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium no-underline transition-all duration-[var(--duration-fast)] ${
                        isActive
                          ? 'text-[var(--color-text-primary)] font-semibold'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
                      }`}
                      style={
                        isActive
                          ? {
                              backgroundColor: `color-mix(in srgb, var(--color-${cat.slug}) 10%, transparent)`,
                              borderLeft: `3px solid var(--color-${cat.slug})`,
                            }
                          : {}
                      }
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: cat.color }}
                          aria-hidden="true"
                        />
                        {cat.name}
                      </span>
                      {cat.articleCount > 0 && (
                        <span className="rounded-[var(--radius-sm)] bg-[var(--color-surface-alt)] px-2 py-0.5 text-[11px] font-medium tabular-nums text-[var(--color-text-tertiary)]">
                          {cat.articleCount}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </section>
      )}
    </aside>
  )
}
