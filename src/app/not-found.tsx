/* ============================================================
   The Observer US — 404 Not Found Page
   ============================================================ */

'use client'

import Link from 'next/link'
import { MagnifyingGlass } from '@phosphor-icons/react'

export default function NotFound() {
  return (
    <div className="container-news flex flex-col items-center justify-center py-20 text-center">
      <MagnifyingGlass
        size={48}
        className="mb-6 text-[var(--color-text-tertiary)]"
        weight="light"
      />
      <h1 className="mb-3 text-4xl font-bold tracking-tight">Page Not Found</h1>
      <p className="mb-8 max-w-md text-[var(--color-text-secondary)]">
        The article or page you are looking for does not exist or has been moved.
        Check the URL or browse our latest stories.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-[var(--color-brand)] px-6 py-3 text-sm font-semibold
                   text-[var(--color-text-on-brand)] no-underline transition-colors
                   hover:bg-[var(--color-brand-hover)]"
      >
        Go to Homepage
      </Link>
    </div>
  )
}
