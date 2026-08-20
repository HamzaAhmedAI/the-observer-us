/* ============================================================
   The Observer US — Branded HTML Sitemap
   Lists published articles in a readable, on-brand page
   (the raw XML sitemap remains at /news-sitemap.xml).
   ============================================================ */

import type { Metadata } from 'next'
import Link from 'next/link'
import { getArticles } from '@/lib/cms'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: `Sitemap — ${SITE_NAME}`,
  description: `Browse all published articles on ${SITE_NAME}.`,
  robots: { index: true, follow: true },
}

// Cache the rendered page for 10 minutes at the edge.
export const revalidate = 600

export default async function SitemapPage() {
  const articles = await getArticles({ limit: 100 })
  const sorted = [...articles.data].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <header className="flex items-center gap-4 border-b border-[var(--color-border)] pb-6">
        <img
          src="/logo.png"
          alt={`${SITE_NAME} logo`}
          width={56}
          height={56}
          className="h-14 w-14 rounded-xl object-contain"
        />
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {SITE_NAME}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {SITE_DESCRIPTION}
          </p>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
          Articles ({articles.total})
        </h2>

        {sorted.length === 0 ? (
          <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
            No articles published yet. Check back soon.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--color-border)]">
            {sorted.map((article) => (
              <li key={article.id} className="py-4">
                <Link
                  href={`/${article.category.slug}/${article.slug}`}
                  className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-brand)] hover:underline"
                >
                  {article.title}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-text-secondary)]">
                  <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 font-medium">
                    {article.category.name}
                  </span>
                  <span>{article.author.name}</span>
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-12 border-t border-[var(--color-border)] pt-6 text-sm text-[var(--color-text-secondary)]">
        <p>
          Machine-readable sitemap:{' '}
          <a
            href="/news-sitemap.xml"
            className="text-[var(--color-brand)] hover:underline"
          >
            /news-sitemap.xml
          </a>{' '}
          · RSS feed:{' '}
          <a
            href="/rss.xml"
            className="text-[var(--color-brand)] hover:underline"
          >
            /rss.xml
          </a>
        </p>
      </footer>
    </main>
  )
}
