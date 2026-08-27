/* ============================================================
   BreakingBannerClient — dismissable breaking news bar.
   Uses sessionStorage so it doesn't re-appear during the session
   once dismissed.
   ============================================================ */

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface BreakingBannerClientProps {
  href: string
  label: string
}

const DISMISS_KEY = 'breaking-dismissed'

export function BreakingBannerClient({ href, label }: BreakingBannerClientProps) {
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === '1') setDismissed(true)
    } catch {}
  }, [])

  if (!mounted || dismissed) return null

  return (
    <div
      className="w-full bg-[var(--color-brand)] text-[var(--color-text-on-brand)]"
      role="alert"
      aria-live="polite"
    >
      <div className="container-news flex items-center gap-3 py-2 text-sm">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
          <span
            className="relative flex h-2 w-2"
            aria-hidden="true"
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          Breaking
        </span>
        <Link
          href={href}
          className="flex-1 truncate font-medium underline-offset-2 hover:underline"
        >
          {label}
        </Link>
        <button
          type="button"
          onClick={() => {
            setDismissed(true)
            try { sessionStorage.setItem(DISMISS_KEY, '1') } catch {}
          }}
          className="rounded p-1 transition-opacity hover:opacity-80"
          aria-label="Dismiss breaking news banner"
        >
          <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
