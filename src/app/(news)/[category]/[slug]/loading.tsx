/* ============================================================
   The Observer US — Article Detail Loading Skeleton
   ============================================================ */

export default function ArticleLoading() {
  return (
    <div className="container-news py-8 md:py-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:justify-center">
        <div className="min-w-0">
          {/* Breadcrumb Skeleton */}
          <div className="mb-6 flex items-center gap-2">
            <div className="h-4 w-12 animate-pulse rounded bg-[var(--color-surface-alt)]" />
            <div className="h-4 w-4 animate-pulse rounded bg-[var(--color-surface-alt)]" />
            <div className="h-4 w-20 animate-pulse rounded bg-[var(--color-surface-alt)]" />
            <div className="h-4 w-4 animate-pulse rounded bg-[var(--color-surface-alt)]" />
            <div className="h-4 w-32 animate-pulse rounded bg-[var(--color-surface-alt)]" />
          </div>

          {/* Article Header Skeleton */}
          <div className="mb-8">
            <div className="mb-4 h-4 w-28 animate-pulse rounded bg-[var(--color-surface-alt)]" />
            <div className="mb-3 h-10 w-full animate-pulse rounded bg-[var(--color-surface-alt)]" />
            <div className="mb-3 h-10 w-3/4 animate-pulse rounded bg-[var(--color-surface-alt)]" />
            <div className="mb-6 h-5 w-full animate-pulse rounded bg-[var(--color-surface-alt)]" />
            <div className="mb-6 h-5 w-2/3 animate-pulse rounded bg-[var(--color-surface-alt)]" />

            {/* Meta Skeleton */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--color-surface-alt)]" />
                <div>
                  <div className="mb-1 h-4 w-28 animate-pulse rounded bg-[var(--color-surface-alt)]" />
                  <div className="h-3 w-20 animate-pulse rounded bg-[var(--color-surface-alt)]" />
                </div>
              </div>
              <div className="h-4 w-4 animate-pulse rounded bg-[var(--color-surface-alt)]" />
              <div className="h-4 w-36 animate-pulse rounded bg-[var(--color-surface-alt)]" />
              <div className="h-4 w-4 animate-pulse rounded bg-[var(--color-surface-alt)]" />
              <div className="h-4 w-24 animate-pulse rounded bg-[var(--color-surface-alt)]" />
            </div>
          </div>

          {/* Featured Image Skeleton */}
          <div className="mb-10 aspect-[16/9] animate-pulse rounded-lg bg-[var(--color-surface-alt)]" />

          {/* Article Body Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-[var(--color-surface-alt)]"
                style={{ width: `${65 + Math.random() * 35}%` }}
              />
            ))}
          </div>

          {/* Author Bio Skeleton */}
          <div className="mt-12 h-28 animate-pulse rounded-lg bg-[var(--color-surface-alt)]" />
        </div>

        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block" aria-label="Loading sidebar">
          <div className="sticky top-24 space-y-8">
            <div>
              <div className="mb-4 h-6 w-24 animate-pulse rounded bg-[var(--color-surface-alt)]" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mb-3 h-12 animate-pulse rounded bg-[var(--color-surface-alt)]" />
              ))}
            </div>
            <div>
              <div className="mb-4 h-6 w-28 animate-pulse rounded bg-[var(--color-surface-alt)]" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="mb-2 h-5 w-32 animate-pulse rounded bg-[var(--color-surface-alt)]" />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
