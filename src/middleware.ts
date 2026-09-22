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
  // NOTE: 'unsafe-inline' is required for React's style injection in dev.
  // Remove it in production once styles are extracted to CSS files or
  // a CSS-in-JS solution with nonce support is adopted.
  const scriptSrc = isDev
    ? "'self' 'unsafe-inline' 'unsafe-eval'"  // React dev needs eval + inline
    : "'self'"                                 // Production: no inline/eval

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