/* ============================================================
   The Observer US — Pagination
   Numbered pagination with responsive page trimming.
   RSC — renders static links, zero client JS.
   ============================================================ */

import Link from 'next/link'

interface PaginationProps {
  /** Base path for page links, e.g. `/politics` */
  basePath: string
  /** Current active page (1-indexed) */
  currentPage: number
  /** Total number of pages */
  totalPages: number
  /** URL search param name for page, defaults to 'page' */
  pageParam?: string
}

/**
 * Builds an array of page items to render.
 * Always shows first, last, and pages around current with ellipsis.
 * Returns a flat array: numbers for clickable pages, 'ellipsis' for gaps.
 */
function buildPageList(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | 'ellipsis')[] = []

  // Always include first page
  pages.push(1)

  if (current > 3) {
    pages.push('ellipsis')
  }

  // Pages around current
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('ellipsis')
  }

  // Always include last page
  if (total > 1) {
    pages.push(total)
  }

  return pages
}

function href(basePath: string, page: number, pageParam: string): string {
  if (page <= 1) return basePath
  return `${basePath}?${pageParam}=${page}`
}

export function Pagination({
  basePath,
  currentPage,
  totalPages,
  pageParam = 'page',
}: PaginationProps) {
  // Single page or less — nothing to paginate
  if (totalPages <= 1) return null

  const pages = buildPageList(currentPage, totalPages)

  return (
    <nav
      className="flex items-center justify-center gap-1.5"
      aria-label="Pagination"
    >
      {/* Previous */}
      <Link
        href={href(basePath, currentPage - 1, pageParam)}
        className={`flex h-9 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border-light)] px-3 text-sm font-medium no-underline transition-all duration-[var(--duration-fast)] ${
          currentPage <= 1
            ? 'pointer-events-none text-[var(--color-text-tertiary)] opacity-30'
            : 'text-[var(--color-text-secondary)] hover:border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
        }`}
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
      >
        <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
          <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"/>
        </svg>
        <span className="ml-1.5 hidden sm:inline">Previous</span>
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, i) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-9 w-9 items-center justify-center text-sm text-[var(--color-text-tertiary)]"
              aria-hidden="true"
            >
              &hellip;
            </span>
          ) : (
            <Link
              key={page}
              href={href(basePath, page, pageParam)}
              className={`flex h-9 min-w-[36px] items-center justify-center rounded-[var(--radius-sm)] px-2 text-sm font-medium no-underline transition-all duration-[var(--duration-fast)] ${
                page === currentPage
                  ? 'bg-[var(--color-brand)] text-[var(--color-text-on-brand)] shadow-sm'
                  : 'border border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
              }`}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next */}
      <Link
        href={href(basePath, currentPage + 1, pageParam)}
        className={`flex h-9 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border-light)] px-3 text-sm font-medium no-underline transition-all duration-[var(--duration-fast)] ${
          currentPage >= totalPages
            ? 'pointer-events-none text-[var(--color-text-tertiary)] opacity-30'
            : 'text-[var(--color-text-secondary)] hover:border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
        }`}
        aria-disabled={currentPage >= totalPages}
        tabIndex={currentPage >= totalPages ? -1 : undefined}
      >
        <span className="mr-1.5 hidden sm:inline">Next</span>
        <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
          <path d="M90.34,202.34a8,8,0,0,0,11.32,11.32l80-80a8,8,0,0,0,0-11.32l-80-80a8,8,0,0,0-11.32,11.32L164.69,128Z"/>
        </svg>
      </Link>
    </nav>
  )
}

/** Skeleton placeholder for pagination (used during loading) */
export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden="true">
      <div className="h-9 w-20 animate-pulse rounded-[var(--radius-sm)] bg-[var(--color-surface-alt)]" />
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-9 animate-pulse rounded-[var(--radius-sm)] bg-[var(--color-surface-alt)]" />
        ))}
      </div>
      <div className="h-9 w-16 animate-pulse rounded-[var(--radius-sm)] bg-[var(--color-surface-alt)]" />
    </div>
  )
}
