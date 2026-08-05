/* ============================================================
   The Observer US — IndexNow Integration
   Pings search engines when new articles are published.
   ============================================================ */

const INDEXNOW_URL = 'https://api.indexnow.org'
const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? ''
const SITE_URL = process.env.SITE_URL ?? 'https://theObserver.com'

/**
 * Notify IndexNow and other search engines of a new or updated URL.
 */
export async function notifyIndexNow(urlPath: string): Promise<void> {
  if (!INDEXNOW_KEY) {
    console.warn('[IndexNow] No key configured — skipping ping.')
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
      console.error(`[IndexNow] Failed: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error('[IndexNow] Error:', error)
  }
}
