/* ============================================================
   The Observer US — Core Web Vitals Reporter
   Measures LCP, CLS, INP, FCP, TTFB and reports them.
   Client component — mounts once per session.
   ============================================================ */

'use client'

import { useReportWebVitals } from 'next/web-vitals'

const METRIC_LABELS: Record<string, string> = {
  LCP: 'LCP',
  CLS: 'CLS',
  INP: 'INP',
  FCP: 'FCP',
  TTFB: 'TTFB',
}

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[WebVitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`)
      return
    }

    // In production, send to analytics endpoint
    try {
      const body = {
        name: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
        url: window.location.pathname,
      }

      // Use sendBeacon for reliability — it won't be dropped on page unload
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track', JSON.stringify(body))
      } else {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          keepalive: true,
        })
      }

      // Log warning for poor ratings
      if (metric.rating === 'poor') {
        console.warn(
          `[WebVitals] Poor ${metric.name}: ${metric.value.toFixed(2)} — investigate ${METRIC_LABELS[metric.name] ?? metric.name} optimization`
        )
      }
    } catch {
      // Analytics must never crash the app
    }
  })

  // This component renders nothing
  return null
}
