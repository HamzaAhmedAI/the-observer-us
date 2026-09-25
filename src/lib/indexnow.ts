/* ============================================================
   The Observer US — IndexNow Integration
   Pings search engines when new articles are published.
   ============================================================ */

import { logger } from '@/lib/logger'

const INDEXNOW_URL = 'https://api.indexnow.org'
const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? ''
const SITE_URL = process.env.SITE_URL ?? 'https://theObserver.com'

/**
 * Notify IndexNow and other search engines of a new or updated URL.
 */
export async function notifyIndexNow(urlPath: string): Promise<void> {
  if (!INDEXNOW_KEY) {
    logger.warn('[IndexNow] No key configured — skipping ping.')
    return
  }

  try {
    const response = await fetch(INDEXNOW_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: new URL(SITE_URL).hostname,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: [`${SITE_URL}${urlPath}`],
      }),
    })

    if (!response.ok) {
      logger.error(`[IndexNow] Failed: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    logger.error('[IndexNow] Error:', { error })
  }
}
