/* ============================================================
   The Observer US — Web Push Notification Dispatcher
   ============================================================ */

// import webpush from 'web-push'

// TODO: Set VAPID keys
// webpush.setVapidDetails(
//   'mailto:push@theObserver.com',
//   process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
//   process.env.VAPID_PRIVATE_KEY!
// )

export interface PushSubscriptionData {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export interface PushPayload {
  title: string
  body: string
  url: string
  icon?: string
  image?: string
  badge?: string
}

/**
 * Send a web push notification to a single subscriber.
 */
export async function sendPushNotification(
  subscription: PushSubscriptionData,
  payload: PushPayload
): Promise<void> {
  // TODO: Send push via web-push
  // await webpush.sendNotification(
  //   subscription as any,
  //   JSON.stringify({
  //     title: payload.title,
  //     body: payload.body,
  //     url: payload.url,
  //     icon: payload.icon ?? '/icon-192.png',
  //     image: payload.image,
  //     badge: payload.badge ?? '/badge-72.png',
  //   })
  // )

  console.log('[Push] Would send:', { subscription: subscription.endpoint, payload })
}

/**
 * Send breaking news push alert to all subscribed devices.
 */
export async function sendBreakingNewsPush(
  subscriptions: PushSubscriptionData[],
  articleTitle: string,
  articleUrl: string,
  thumbnailUrl?: string
): Promise<void> {
  const payload: PushPayload = {
    title: 'BREAKING NEWS',
    body: articleTitle,
    url: articleUrl,
    image: thumbnailUrl,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
  }

  await Promise.allSettled(
    subscriptions.map((sub) => sendPushNotification(sub, payload))
  )
}
