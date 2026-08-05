/* ============================================================
   The Observer US — Category Feed Loading Skeleton
   ============================================================ */

export default function CategoryLoading() {
  return (
    <div className="container-news py-8 md:py-12">
      {/* Category Header Skeleton */}
      <div className="mb-8">
        <div className="mb-2 h-9 w-48 animate-pulse rounded bg-[var(--color-surface-alt)]" />
        <div className="h-5 w-72 animate-pulse rounded bg-[var(--color-surface-alt)]" />
      </div>

      {/* Grid with Sidebar Layout */}
      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-lg bg-[var(--color-surface-alt)]" />
          ))}
        </div>

        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block" aria-label="Loading sidebar">
          <div className="space-y-8">
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

      {/* Pagination Skeleton */}
      <div className="mt-10 flex items-center justify-center gap-2">
        <div className="h-9 w-20 animate-pulse rounded-md bg-[var(--color-surface-alt)]" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-9 w-9 animate-pulse rounded-md bg-[var(--color-surface-alt)]" />
        ))}
        <div className="h-9 w-16 animate-pulse rounded-md bg-[var(--color-surface-alt)]" />
      </div>
    </div>
  )
}
