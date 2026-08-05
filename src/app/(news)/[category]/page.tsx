/* ============================================================
   The Observer US — Category Feed Page
   ============================================================ */

import { ArticleCard } from '@/components/reader/ArticleCard'
import { CategorySidebar } from '@/components/reader/CategorySidebar'
import { Pagination } from '@/components/reader/Pagination'
import { getArticles, getCategories } from '@/lib/cms'
// REVALIDATE_CATEGORY = 600 (inlined for Next.js 16 compatibility)
import type { Metadata } from 'next'

export const revalidate = 600

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const categories = await getCategories()
  const cat = categories.find((c) => c.slug === category)

  return {
    title: `${cat?.name ?? category} News`,
    description: `Latest ${cat?.name ?? category} news, analysis, and breaking stories.`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const { page: pageStr } = await searchParams
  const page = Number(pageStr) || 1

  const [articles, categories] = await Promise.all([
    getArticles({ category, limit: 12, page }),
    getCategories(),
  ])

  const cat = categories.find((c) => c.slug === category)

  return (
    <div className="container-news py-8 md:py-12">
      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: `var(--color-${category})` }}
          />
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {cat?.name ?? category}
          </h1>
        </div>
        {cat?.description && (
          <p className="mt-2 text-[var(--color-text-secondary)]">{cat.description}</p>
        )}
      </div>

      {articles.data.length > 0 ? (
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div>
            <div className="grid gap-6 sm:grid-cols-2">
              {articles.data.map((article, i) => (
                <ArticleCard key={article.id} article={article} priority={i < 3} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-10">
              <Pagination
                basePath={`/${category}`}
                currentPage={page}
                totalPages={Math.ceil(articles.total / 12)}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <CategorySidebar currentCategory={category} />
            </div>
          </aside>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-[var(--color-text-secondary)]">
            No articles found
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">
            Check back later for new stories in this category.
          </p>
        </div>
      )}
    </div>
  )
}
