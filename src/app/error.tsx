/* ============================================================
   The Observer US — Global Error Boundary
   ============================================================ */

'use client'

import { WarningCircle } from '@phosphor-icons/react'
import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  // Report error on mount
  useEffect(() => {
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'error_boundary',
          message: error.message,
          digest: error.digest,
          url: window.location.pathname,
        }),
      })
    } catch {
      // Silently fail — error reporting must never cascade
    }
  }, [error])

  return (
    <div className="container-news flex flex-col items-center justify-center py-20 text-center">
      <WarningCircle
        size={48}
        className="mb-6 text-[var(--color-brand)]"
        weight="light"
      />
      <h1 className="mb-3 text-3xl font-bold tracking-tight">Something Went Wrong</h1>
      <p className="mb-2 max-w-md text-[var(--color-text-secondary)]">
        We encountered an unexpected error. Our team has been notified.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <p className="mb-6 max-w-lg rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
          {error.message}
          {error.digest && <span className="mt-2 block text-xs opacity-60">Digest: {error.digest}</span>}
        </p>
      )}
      <button
        onClick={reset}
        className="rounded-lg bg-[var(--color-brand)] px-6 py-3 text-sm font-semibold
                   text-[var(--color-text-on-brand)] transition-colors
                   hover:bg-[var(--color-brand-hover)]"
      >
        Try Again
      </button>
    </div>
  )
}
