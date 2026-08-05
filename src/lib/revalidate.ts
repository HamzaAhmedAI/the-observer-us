/* ============================================================
   The Observer US — ISR Revalidation Strategy
   Centralized revalidation constants for all page types.
   Tune these values based on publishing frequency & traffic.
   ============================================================ */

/** Homepage — refreshed every 5 minutes */
export const REVALIDATE_HOMEPAGE = 300

/** Category feed — refreshed every 10 minutes */
export const REVALIDATE_CATEGORY = 600

/** Article detail — refreshed every 60 minutes */
export const REVALIDATE_ARTICLE = 3600

/** Static pages (about, preferences, etc.) — refreshed daily */
export const REVALIDATE_STATIC = 86400

/**
 * Max age for an article before it is considered "archived".
 * Articles older than this use SSR (no ISR cache) to avoid
 * storing stale content for rarely-visited pages.
 * Default: 30 days in seconds.
 */
export const ARCHIVE_THRESHOLD = 30 * 86400

/**
 * Check whether an article's publish date is past the archive
 * threshold and should fall back to dynamic SSR.
 */
export function isArchived(publishedAt: string): boolean {
  const age = Date.now() - new Date(publishedAt).getTime()
  return age > ARCHIVE_THRESHOLD * 1000
}
