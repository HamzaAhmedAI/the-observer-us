/* ============================================================
   The Observer US — Homepage
   Premium editorial layout with warm surfaces and
   refined category sections.
   ============================================================ */

import Link from 'next/link'
import { ArticleCard } from '@/components/reader/ArticleCard'
import { FeaturedHero } from '@/components/reader/FeaturedHero'
import { EmailSubscribe } from '@/components/reader/EmailSubscribe'
import { getArticles, getCategories } from '@/lib/cms'
// REVALIDATE_HOMEPAGE = 300 (inlined for Next.js 16 compatibility)
import type { Article, Category } from '@/types/article'

export const revalidate = 300

async function getCategoryArticles(category: Category) {
  const articles = await getArticles({ category: category.slug, limit: 3 }).catch(
    () => ({ data: [] as Article[], total: 0, page: 1, pageSize: 3, hasMore: false })
  )
  return { category, articles: articles.data }
}

export default async function HomePage() {
  let featuredArticle: Article | null = null
  let latestArticles: Article[] = []
  let categories: Category[] = []

  try {
    const articles = await getArticles({ limit: 10 })
    featuredArticle = articles.data[0] ?? null
    latestArticles = articles.data.slice(1, 7)
    categories = await getCategories()
  } catch (error) {
    console.error('Failed to load homepage data:', error)
  }

  // Fetch articles for first 4 categories in parallel
  const categorySections = await Promise.all(
    categories.slice(0, 4).map((cat) => getCategoryArticles(cat))
  )

  return (
    <div className="container-news py-8 md:py-12">
      {/* Featured Hero */}
      {featuredArticle ? (
        <FeaturedHero article={featuredArticle} />
      ) : (
        <div className="mb-12 h-[400px] animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-alt)] md:h-[500px]" />
      )}

      {/* Latest Stories Grid */}
      <section className="mb-16" aria-labelledby="latest-heading">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h2 id="latest-heading" className="text-2xl font-bold tracking-tight md:text-3xl">
              Latest Stories
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
              Top stories from across our coverage
            </p>
          </div>
        </div>

        {latestArticles.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article, i) => (
              <ArticleCard key={article.id} article={article} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-alt)]" />
            ))}
          </div>
        )}
      </section>

      {/* Category Sections */}
      {categorySections.length > 0 && (
        <div className="mb-16 space-y-16">
          {categorySections.map(({ category, articles }) => {
            const catColor = `var(--color-${category.slug})`
            return (
              <section key={category.id} aria-labelledby={`cat-${category.slug}`}>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: catColor }}
                    />
                    <h3
                      id={`cat-${category.slug}`}
                      className="text-xl font-bold tracking-tight"
                    >
                      {category.name}
                    </h3>
                  </div>
                  <Link
                    href={`/${category.slug}`}
                    className="group flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] no-underline transition-colors duration-[var(--duration-fast)] hover:text-[var(--color-text-primary)]"
                  >
                    View all
                    <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className="transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5">
                      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/>
                    </svg>
                  </Link>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {articles.length > 0 ? (
                    articles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))
                  ) : (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-72 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-surface-alt)]" />
                    ))
                  )}
                </div>
              </section>
            )
          })}
        </div>
      )}

      {/* Newsletter Subscribe Section */}
      <section
        id="subscribe"
        className="mb-16 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-[var(--color-surface-elevated)] p-8 shadow-[var(--shadow-card)] md:p-12"
        aria-labelledby="subscribe-heading"
      >
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand-light)]">
            <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" className="text-[var(--color-brand)]">
              <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,127.72,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"/>
            </svg>
          </div>
          <h2 id="subscribe-heading" className="mb-2 text-2xl font-bold tracking-tight">
            Stay Informed
          </h2>
          <p className="mb-7 text-sm text-[var(--color-text-secondary)]">
            Get the latest breaking news, in-depth analysis, and exclusive stories delivered
            straight to your inbox. Free, always.
          </p>
          <EmailSubscribe />
        </div>
      </section>
    </div>
  )
}
