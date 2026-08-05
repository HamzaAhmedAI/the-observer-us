/* ============================================================
   The Observer US — Push Notification Dispatcher
   Batches push notifications to subscribers by category.
   ============================================================ */

import { getPushSubscriptionsByCategory } from '@/lib/db'
import { buildBreakingNewsPush, buildArticlePush } from './templates'
import type { PushPayload } from './templates'

// web-push is optional — only loaded when VAPID keys are configured
let webpush: typeof import('web-push') | null = null

function ensureWebPush() {
  if (webpush) return true

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY

  if (!publicKey || !privateKey) {
    console.warn('[PushDispatcher] VAPID keys not configured — push notifications disabled.')
    return false
  }

  try {
    // Dynamic import — web-push is Node-only
    webpush = require('web-push')
    webpush!.setVapidDetails(
      'mailto:push@theObserver.com',
      publicKey,
      privateKey
    )
    return true
  } catch {
    console.warn('[PushDispatcher] web-push package not installed — push disabled.')
    return false
  }
}

export type { PushPayload }

/**
 * Dispatch a breaking news push alert to all subscribers of a category.
 */
export async function dispatchBreakingNewsPush(
  category: string,
  headline: string,
  articleUrl: string,
  thumbnailUrl?: string
): Promise<{ sent: number; failed: number }> {
  const payload = buildBreakingNewsPush(headline, articleUrl, thumbnailUrl)
  return dispatchToCategory(category, payload)
}

/**
 * Dispatch a regular article push alert to a category's subscribers.
 */
export async function dispatchArticlePush(
  category: string,
  categoryName: string,
  headline: string,
  articleUrl: string,
  thumbnailUrl?: string
): Promise<{ sent: number; failed: number }> {
  const payload = buildArticlePush(headline, categoryName, articleUrl, thumbnailUrl)
  return dispatchToCategory(category, payload)
}

/**
 * Send a push notification to all subscribers of a given category.
 */
async function dispatchToCategory(
  category: string,
  payload: PushPayload
): Promise<{ sent: number; failed: number }> {
  // Get subscribers for this category
  const { data: subscriptions, error } = await getPushSubscriptionsByCategory(category)

  if (error) {
    console.error('[PushDispatcher] Failed to fetch subscriptions:', error)
    return { sent: 0, failed: 0 }
  }

  if (!subscriptions || subscriptions.length === 0) {
    console.log(`[PushDispatcher] No push subscribers for category: ${category}`)
    return { sent: 0, failed: 0 }
  }

  // Check if web-push is available
  if (!ensureWebPush()) {
    // Log the notification instead
    console.log('[PushDispatcher] Push log:', {
      category,
      subscribers: subscriptions.length,
      payload,
    })
    return { sent: subscriptions.length, failed: 0 }
  }

  // Send in batches of 50 to avoid overwhelming the push service
  const BATCH_SIZE = 50
  let sent = 0
  let failed = 0
  const wp = webpush // narrowed local reference

  for (let i = 0; i < subscriptions.length; i += BATCH_SIZE) {
    const batch = subscriptions.slice(i, i + BATCH_SIZE)

    const results = await Promise.allSettled(
      batch.map((sub) =>
        wp!.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify({
            title: payload.title,
            body: payload.body,
            url: payload.url,
            icon: payload.icon ?? '/icon-192.png',
            image: payload.image,
            badge: payload.badge ?? '/badge-72.png',
          })
        )
      )
    )

    for (const result of results) {
      if (result.status === 'fulfilled') {
        sent++
      } else {
        failed++
        console.warn('[PushDispatcher] Send failed:', result.reason)
      }
    }
  }

  console.log(`[PushDispatcher] Sent ${sent}, failed ${failed} to category: ${category}`)
  return { sent, failed }
}
