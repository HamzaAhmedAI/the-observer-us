/* ============================================================
   The Observer US — Author Profile Page
   Public bio, social links, and list of published articles.
   ============================================================ */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArticleCard } from '@/components/reader/ArticleCard'
import { CategorySidebar } from '@/components/reader/CategorySidebar'
import { getAuthorBySlug, getArticlesByAuthor } from '@/lib/cms'
import type { Article } from '@/types/article'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export const revalidate = 600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) return { title: 'Author Not Found' }

  const title = `${author.name} — ${author.role || 'Author'} | ${SITE_NAME}`
  const description =
    author.bio ||
    `Articles and analysis by ${author.name} on ${SITE_NAME}, a US news publication.`
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/author/${author.slug}` },
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `${SITE_URL}/author/${author.slug}`,
      images: author.avatar?.url
        ? [{ url: author.avatar.url, width: author.avatar.width, height: author.avatar.height, alt: author.name }]
        : undefined,
    },
    robots: { index: true, follow: true },
  }
}

function SocialLink({ href, label }: { href: string; label: string }) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
    >
      {label}
    </a>
  )
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params
  const [author, articles] = await Promise.all([
    getAuthorBySlug(slug),
    getArticlesByAuthor(slug, 50),
  ])

  if (!author) notFound()

  const avatarUrl = author.avatar?.url

  return (
    <div className="container-news py-8 md:py-12">
      {/* Author Header */}
      <header className="mb-10 flex flex-col items-center gap-5 rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-[var(--color-surface-elevated)] p-8 text-center sm:flex-row sm:text-left">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-surface-alt)]">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={author.name}
              width={author.avatar?.width || 112}
              height={author.avatar?.height || 112}
              className="h-28 w-28 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <svg width="48" height="48" viewBox="0 0 256 256" fill="currentColor" className="text-[var(--color-text-tertiary)]">
              <path d="M128,128a48,48,0,1,0-48-48A48,48,0,0,0,128,128Zm0-80a32,32,0,1,1-32,32A32,32,0,0,1,128,48ZM128,152c-43.4,0-80,17.6-80,40v16a8,8,0,0,0,8,8H200a8,8,0,0,0,8-8V192C208,169.6,171.4,152,128,152Zm64,48H64V192c0-14.4,29.6-24,64-24s64,9.6,64,24v8Z" />
            </svg>
          )}
        </div>
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {author.name}
          </h1>
          {author.role && (
            <p className="mt-1 text-sm font-medium uppercase tracking-wide text-[var(--color-accent)]">
              {author.role}
            </p>
          )}
          {author.bio && (
            <p className="mt-3 max-w-2xl text-[var(--color-text-secondary)]">{author.bio}</p>
          )}
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            <SocialLink href={author.linkedin || ''} label="LinkedIn" />
            <SocialLink href={author.twitter || ''} label="X / Twitter" />
            <SocialLink href={author.website || ''} label="Website" />
          </div>
        </div>
      </header>

      {/* Articles */}
      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div>
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
            Articles by {author.name} ({articles.length})
          </h2>
          {articles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {articles.map((article: Article, i: number) => (
                <ArticleCard key={article.id} article={article} priority={i < 3} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)]">
              No published articles yet. Check back soon.
            </p>
          )}
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <CategorySidebar />
          </div>
        </aside>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
