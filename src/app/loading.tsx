/* ============================================================
   The Observer US — Homepage Loading Skeleton
   ============================================================ */

export default function HomeLoading() {
  return (
    <div className="container-news py-8 md:py-12">
      {/* Featured Hero Skeleton */}
      <div className="mb-12 h-[400px] animate-pulse rounded-lg bg-[var(--color-surface-alt)] md:h-[500px]" />

      {/* Latest Stories Grid Skeleton */}
      <section className="mb-16" aria-label="Loading latest stories">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-[var(--color-surface-alt)]" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-lg bg-[var(--color-surface-alt)]" />
          ))}
        </div>
      </section>

      {/* Category Sections Skeleton */}
      <div className="mb-16 space-y-16">
        {Array.from({ length: 3 }).map((_, s) => (
          <section key={s} aria-label="Loading category">
            <div className="mb-4 h-7 w-36 animate-pulse rounded bg-[var(--color-surface-alt)]" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-lg bg-[var(--color-surface-alt)]" />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Subscribe Skeleton */}
      <div className="mb-16 h-48 animate-pulse rounded-lg bg-[var(--color-surface-alt)]" />
    </div>
  )
}
