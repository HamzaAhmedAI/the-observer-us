/* ============================================================
   The Observer US — Google Analytics 4 (optional)
   Loads only when NEXT_PUBLIC_GA_ID is set (e.g. G-XXXXXXXXXX).
   Until then this component renders nothing and the site stays
   first-party-analytics-only, as the Privacy/Cookie pages say.
   Implemented with a dynamic script injection (no inline
   <script> content) so the strict CSP in middleware stays intact.
   IP anonymization is enabled by default.
   ============================================================ */

'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  useEffect(() => {
    if (!gaId) return
    if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) return

    window.dataLayer = window.dataLayer || []
    const gtag = (...args: unknown[]) => {
      ;(window.dataLayer as unknown[]).push(args)
    }
    gtag('js', new Date())
    gtag('config', gaId, { anonymize_ip: true })

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script)
  }, [gaId])

  return null
}
