/* ============================================================
   ViewBeacon — client component that fires one page-view
   per article mount. Lightweight fetch with sendBeacon fallback.
   ============================================================ */

'use client'

import { useEffect } from 'react'

interface ViewBeaconProps {
  category: string
  slug: string
}

export function ViewBeacon({ category, slug }: ViewBeaconProps) {
  useEffect(() => {
    const body = JSON.stringify({ category, slug })
    let cancelled = false

    if ('sendBeacon' in navigator) {
      try {
        const blob = new Blob([body], { type: 'application/json' })
        navigator.sendBeacon('/api/track/view', blob)
        return
      } catch {}
    }

    fetch('/api/track/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {
      if (cancelled) return
    })

    return () => {
      cancelled = true
    }
  }, [category, slug])

  return null
}
