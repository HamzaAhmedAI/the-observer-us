/* ============================================================
   The Observer US — Edge Middleware
   Security headers, CSP, HSTS, and geolocation hints.
   Runs on every request at the edge.
   ============================================================ */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // ─── Security Headers ────────────────────────────────
  const isDev = process.env.NODE_ENV === 'development'

  // CSP: strict in production, relaxed in dev for React hot-reload.
  // script-src carries 'unsafe-inline' in BOTH environments — this is
  // deliberate, not an oversight. Next.js App Router emits inline
  // <script> tags on every page (RSC flight data + the hydration
  // bootstrap), and without them React never hydrates: buttons,
  // calculators and checklists render as dead HTML. That is exactly
  // what happened on 2026-11-13 — the 72-hour kit tool loaded but
  // nothing on it responded, because production CSP had no inline
  // allowance and no nonce. The alternative (a per-request nonce)
  // would force the whole site dynamic (headers() in the root layout
  // kills ISR/static rendering), which costs more than it saves on a
  // site with no user-generated content and no browser auth flows.
  // Everything else stays strict: no eval, no objects, no frames.
  const scriptSrc = isDev
    ? "'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com" // React dev needs eval + inline
    : "'self' 'unsafe-inline' https://www.googletagmanager.com" // Production: inline allowed for Next.js hydration; GTM for GA4 (gated by NEXT_PUBLIC_GA_ID)

  const csp = [
    `default-src 'self'`,
    `script-src ${scriptSrc} https://static.cloudflareinsights.com`,
    "style-src 'self' 'unsafe-inline'",       // 'unsafe-inline' needed for React inline styles
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https: https://static.cloudflareinsights.com",
    "frame-src 'none'",
    "object-src 'none'",
    'base-uri \'self\'',
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  // Immortal caching for uploaded media (static binaries, content-addressed
  // by filename). Long TTL removes the Lighthouse 'cache lifetime' penalty.
  if (request.nextUrl.pathname.startsWith('/api/media')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    )
  }

  // ─── Additional Security Headers ─────────────────────
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )

  // Block content-type sniffing for API responses
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('X-Content-Type-Options', 'nosniff')
  }

  return response
}

// Only run middleware on page routes and API routes
// (excluding the Payload admin UI, which manages its own security)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|admin).*)',
  ],
}