/* ============================================================
   The Observer US — Article Detail Page
   100% RSC — zero client JS overhead for reading articles.
   ============================================================ */

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleBySlug, getRelatedArticles } from '@/lib/cms'
import { CategorySidebar } from '@/components/reader/CategorySidebar'
import { JsonLd } from '@/components/analytics/JsonLd'
import { BookmarkButton } from '@/components/reader/BookmarkButton'
import { ShareTools } from '@/components/reader/ShareTools'
import { LiveBadge } from '@/components/reader/LiveBadge'
import { RelatedArticles } from '@/components/reader/RelatedArticles'
import { MostRead } from '@/components/reader/MostRead'
import { RelativeTime } from '@/components/reader/RelativeTime'
import { ViewBeacon } from '@/components/analytics/ViewBeacon'
import { SITE_NAME, SITE_URL } from '@/lib/seo'
import { isArchived } from '@/lib/revalidate'
import { isLive } from '@/lib/relative-time'
import type { Metadata } from 'next'

export const revalidate = 3600

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const article = await getArticleBySlug(category, slug)

  if (!article) {
    return { title: 'Article Not Found' }
  }

  return {
    title: article.seo.title,
    description: article.seo.description,
    openGraph: {
      title: article.seo.title,
      description: article.seo.description,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      images: [
        {
          url: article.featuredImage.url,
          width: article.featuredImage.width,
          height: article.featuredImage.height,
          alt: article.featuredImage.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seo.title,
      description: article.seo.description,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params
  const article = await getArticleBySlug(category, slug)

  if (!article) {
    notFound()
  }

  return (
    <>
      {/* Fire one page-view per article render */}
      <ViewBeacon category={article.category.slug} slug={article.slug} />

      {/* JSON-LD Structured Data */}
      <JsonLd
        title={article.title}
        description={article.excerpt}
        url={`${SITE_URL}/${article.category.slug}/${article.slug}`}
        imageUrl={article.featuredImage.url}
        imageWidth={article.featuredImage.width}
        imageHeight={article.featuredImage.height}
        datePublished={article.publishedAt}
        dateModified={article.updatedAt}
        authorName={article.author.name}
        authorUrl={`${SITE_URL}/authors/${article.author.slug}`}
        publisherName={SITE_NAME}
      />

      <article className="container-news py-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:justify-center">
          <div className="min-w-0">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-[var(--color-text-tertiary)]" aria-label="Breadcrumb">
            <Link
              href="/"
              className="hover:text-[var(--color-text-primary)]"
            >
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/${article.category.slug}`}
              className="hover:text-[var(--color-text-primary)]"
              style={{ color: `var(--color-${article.category.slug})` }}
            >
              {article.category.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--color-text-secondary)]">{article.title.slice(0, 50)}...</span>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            {article.isBreaking && (
              <span className="mb-4 inline-block rounded bg-[var(--color-brand)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--color-text-on-brand)]">
                Breaking News
              </span>
            )}

            <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            <p className="mb-6 text-lg text-[var(--color-text-secondary)]">
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-tertiary)]">
              <div className="flex items-center gap-2">
                <Link
                  href={`/author/${article.author.slug}`}
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[var(--color-surface-alt)]"
                  aria-label={`Author profile: ${article.author.name}`}
                >
                  {article.author.avatar?.url ? (
                    <Image
                      src={article.author.avatar.url}
                      alt={article.author.name}
                      width={article.author.avatar.width || 40}
                      height={article.author.avatar.height || 40}
                      className="h-10 w-10 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M128,128a48,48,0,1,0-48-48A48,48,0,0,0,128,128Zm0-80a32,32,0,1,1-32,32A32,32,0,0,1,128,48ZM128,152c-43.4,0-80,17.6-80,40v16a8,8,0,0,0,8,8H200a8,8,0,0,0,8-8V192C208,169.6,171.4,152,128,152Zm64,48H64V192c0-14.4,29.6-24,64-24s64,9.6,64,24v8Z"/></svg>
                  )}
                </Link>
                <div>
                  <Link
                    href={`/author/${article.author.slug}`}
                    className="block font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] hover:underline"
                  >
                    {article.author.name}
                  </Link>
                  <span className="text-xs">{article.author.role}</span>
                </div>
              </div>
              <span aria-hidden="true">&middot;</span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M208,32H192V24a8,8,0,0,0-16,0v8H80V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM48,48H64v8a8,8,0,0,0,16,0V48h96v8a8,8,0,0,0,16,0V48h16V80H48V208ZM208,208H48V96H208V208Z"/></svg>
                <RelativeTime date={article.publishedAt} />
                {isLive(article.publishedAt) && <LiveBadge />}
              </span>
              <span aria-hidden="true">&middot;</span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm8-136V128a8,8,0,0,1-4.68,7.23l-40,20A8,8,0,0,1,80,148a8,8,0,0,1-3.23-15.32L112,115.06V80a8,8,0,0,1,16,0Z"/></svg>
                {article.readTime} min read
              </span>
            </div>

            {/* Bookmark & Share */}
            <div className="mt-4 flex items-center gap-1 border-t border-[var(--color-border)] pt-4">
              <BookmarkButton slug={article.slug} title={article.title} />
              <span className="text-[var(--color-border)]">|</span>
              <ShareTools
                url={`${SITE_URL}/${article.category.slug}/${article.slug}`}
                title={article.title}
              />
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src={article.featuredImage.url}
              alt={article.featuredImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>

          {/* Article Body */}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Author Bio */}
          <div className="mt-12 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6">
            <Link href={`/author/${article.author.slug}`} className="flex items-start gap-4 group">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[var(--color-surface-hover)]">
                {article.author.avatar?.url ? (
                  <Image
                    src={article.author.avatar.url}
                    alt={article.author.name}
                    width={article.author.avatar.width || 48}
                    height={article.author.avatar.height || 48}
                    className="h-12 w-12 rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M128,128a48,48,0,1,0-48-48A48,48,0,0,0,128,128Zm0-80a32,32,0,1,1-32,32A32,32,0,0,1,128,48ZM128,152c-43.4,0-80,17.6-80,40v16a8,8,0,0,0,8,8H200a8,8,0,0,0,8-8V192C208,169.6,171.4,152,128,152Zm64,48H64V192c0-14.4,29.6-24,64-24s64,9.6,64,24v8Z"/></svg>
                )}
              </div>
              <div>
                <p className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] group-hover:underline">
                  {article.author.name}
                </p>
                <p className="text-sm text-[var(--color-text-tertiary)]">{article.author.role}</p>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  {article.author.bio}
                </p>
              </div>
            </Link>
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-8">
            <CategorySidebar currentCategory={article.category.slug} />
            <MostRead category={article.category.slug} excludeId={article.id} />
          </div>
        </aside>
      </div>
      </article>

      {/* Related articles (full width, below main + sidebar grid) */}
      <RelatedArticles category={article.category.slug} excludeId={article.id} />
    </>
  )
}
