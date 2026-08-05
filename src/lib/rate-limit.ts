/* ============================================================
   The Observer US — Rate Limiter
   Simple in-memory sliding-window rate limiter for API routes.
   ============================================================ */

interface WindowEntry {
  count: number
  resetAt: number
}

const store = new Map<string, WindowEntry>()

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (entry.resetAt < now) store.delete(key)
    }
  }, 300_000).unref?.()
}

export interface RateLimitOptions {
  /** Max requests in the window (default: 30) */
  max?: number
  /** Window duration in ms (default: 60000 = 1 minute) */
  windowMs?: number
}

/**
 * Simple in-memory rate limiter.
 * Returns true if the request should be allowed, false if rate-limited.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetAt: number } {
  const { max = 30, windowMs = 60_000 } = options
  const now = Date.now()

  const entry = store.get(identifier)

  if (!entry || entry.resetAt < now) {
    // Start a new window
    store.set(identifier, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs }
  }

  entry.count++

  if (entry.count > max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt }
}

/**
 * Rate limit by IP from the request.
 */
export function checkRateLimitByIP(
  request: Request,
  options?: RateLimitOptions
) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'
  return checkRateLimit(`ip:${ip}`, options)
}
