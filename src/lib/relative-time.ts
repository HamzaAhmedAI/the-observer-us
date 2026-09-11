/* ============================================================
   Relative time helper
   Formats a date as a human-readable relative timestamp
   (e.g. "Just now", "5m ago", "3h ago", "2d ago", "Aug 12").
   Stable across server/client renders (no time-zone drift).
   ============================================================ */

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

/**
 * Returns a relative time string.
 * - < 60s  → "Just now"
 * - < 60m  → "Nm ago"
 * - < 24h  → "Nh ago"
 * - < 7d   → "Nd ago"
 * - same year → "Mon D"  (e.g. "Aug 27")
 * - older → "Mon D, YYYY"
 */
export function relativeTime(input: string | number | Date): string {
  const date = input instanceof Date ? input : new Date(input)
  const now = Date.now()
  const ts = date.getTime()
  const diffMs = now - ts

  // Future / clock skew safety net
  if (diffMs < 0) return 'Just now'

  const seconds = Math.floor(diffMs / 1000)
  if (seconds < 60) return 'Just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  const sameYear = date.getFullYear() === new Date(now).getFullYear()
  const month = MONTHS[date.getMonth()]
  const day = date.getDate()
  return sameYear ? `${month} ${day}` : `${month} ${day}, ${date.getFullYear()}`
}

/**
 * Returns true if the given date is within the last `windowMinutes` minutes.
 * Used for the "Live" badge.
 */
export function isLive(input: string | number | Date, windowMinutes = 120): boolean {
  const date = input instanceof Date ? input : new Date(input)
  return Date.now() - date.getTime() < windowMinutes * 60 * 1000
}
