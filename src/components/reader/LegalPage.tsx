/* ============================================================
   The Observer US — Legal/Info Page Wrapper
   Shared layout for About, Contact, Privacy, Terms, Advertise, Careers.
   Server Component.
   ============================================================ */

import Link from 'next/link'

export function LegalPage({
  title,
  intro,
  lastUpdated,
  children,
}: {
  title: string
  intro?: string
  lastUpdated: string
  children: React.ReactNode
}) {
  return (
    <main className="container-news py-10 md:py-14">
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-[var(--color-border-light)] pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">{intro}</p>
          )}
          <p className="mt-4 text-xs text-[var(--color-text-tertiary)]">
            Last updated: {lastUpdated}
          </p>
        </header>

        <div className="mt-8 space-y-8 text-[var(--color-text-secondary)]">{children}</div>

        <div className="mt-12 border-t border-[var(--color-border-light)] pt-6 text-sm">
          <Link href="/" className="font-medium text-[var(--color-accent)] hover:underline">
            ← Back to home
          </Link>
        </div>
      </article>
    </main>
  )
}

export function LegalSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
        {title}
      </h2>
      <div className="mt-3 space-y-3 leading-relaxed">{children}</div>
    </section>
  )
}

export function LegalList({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc space-y-2 pl-6">{children}</ul>
}
