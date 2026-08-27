/* ============================================================
   The Observer US — Article Card
   Premium editorial card with refined depth, subtle borders,
   and intentional hover states. Server Component.
   ============================================================ */

import Link from 'next/link'
import Image from 'next/image'
import { ReadingTime } from './ReadingTime'
import { RelativeTime } from './RelativeTime'
import { LiveBadge } from './LiveBadge'
import { isLive } from '@/lib/relative-time'
import type { ArticleCardProps } from '@/types/article'

export function ArticleCard({
  article,
  variant = 'standard',
  priority = false,
}: ArticleCardProps) {
  const isHero = variant === 'hero'
  const isFeatured = variant === 'featured'
  const isCompact = variant === 'compact'

  return (
    <Link
      href={`/${article.category.slug}/${article.slug}`}
      className={`group block no-underline transition-all duration-[var(--duration-normal)] ${
        isHero
          ? 'md:grid md:grid-cols-2 md:gap-10'
          : 'rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-[var(--color-surface-elevated)] p-0 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5'
      }`}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden ${
          isHero
            ? 'mb-4 aspect-[16/9] rounded-[var(--radius-md)] md:mb-0'
            : isCompact
              ? 'mb-2 aspect-[16/9] rounded-t-[var(--radius-md)]'
              : 'mb-0 aspect-[16/9] rounded-t-[var(--radius-md)]'
        } ${isHero ? '' : ''}`}
      >
        <Image
          src={article.featuredImage.url}
          alt={article.featuredImage.alt}
          fill
          sizes={
            isHero
              ? '(max-width: 768px) 100vw, 50vw'
              : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          }
          className="object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.05]"
          priority={priority}
          fetchPriority={priority ? 'high' : undefined}
          loading={priority ? undefined : 'lazy'}
        />
        {/* Subtle image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-[var(--duration-normal)] group-hover:opacity-100" />

        {article.isBreaking && (
          <span className="absolute left-3 top-3 rounded-[var(--radius-sm)] bg-[var(--color-brand)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-on-brand)] shadow-sm">
            Breaking
          </span>
        )}
      </div>

      {/* Content */}
      <div className={isHero ? 'flex flex-col justify-center' : 'px-[1px] pb-[1px]'}>
        <div className={!isHero && !isCompact ? 'p-4' : isCompact ? 'px-0' : ''}>
          {/* Category Badge */}
          <span
            className="mb-2.5 inline-block text-[10px] font-semibold uppercase tracking-[0.15em]"
            style={{ color: `var(--color-${article.category.slug})` }}
          >
            {article.category.name}
          </span>

          {/* Title */}
          <h3
            className={`font-bold tracking-tight text-[var(--color-text-primary)] transition-colors duration-[var(--duration-fast)] ${
              isHero
                ? 'mb-3 text-2xl leading-[1.1] md:text-3xl lg:text-4xl'
                : isFeatured
                  ? 'mb-2 text-xl leading-[1.2] md:text-2xl'
                  : isCompact
                    ? 'mb-1 text-sm leading-snug'
                    : 'mb-2 text-[17px] leading-snug md:text-lg'
            } ${
              !isHero ? 'group-hover:text-[var(--color-brand)]' : ''
            }`}
          >
            {isCompact ? (
              article.title.length > 60
                ? article.title.slice(0, 60) + '...'
                : article.title
            ) : (
              article.title
            )}
          </h3>

          {/* Excerpt (hero + featured only) */}
          {(isHero || isFeatured) && (
            <p className={`line-clamp-2 text-[var(--color-text-secondary)] ${
              isHero ? 'mb-5 text-base leading-relaxed' : 'mb-3 text-sm'
            }`}>
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Meta — separated visually for card variants */}
        <div className={`flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-tertiary)] ${
          !isHero && !isCompact ? 'border-t border-[var(--color-border-light)] px-4 py-3' : isCompact ? 'px-0' : ''
        }`}>
          <span className="truncate max-w-[120px]" title={article.author.name}>{article.author.name}</span>
          <span aria-hidden="true" className="text-[var(--color-border-heavy)]">&middot;</span>
          <RelativeTime date={article.publishedAt} />
          {isLive(article.publishedAt) && (
            <>
              <span aria-hidden="true" className="text-[var(--color-border-heavy)]">&middot;</span>
              <LiveBadge />
            </>
          )}
          <span aria-hidden="true" className="text-[var(--color-border-heavy)]">&middot;</span>
          <ReadingTime minutes={article.readTime} />
        </div>
      </div>
    </Link>
  )
}
