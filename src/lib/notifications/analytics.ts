/* ============================================================
   The Observer US — Notification Analytics
   Basic tracking for push and email notification delivery.
   ============================================================ */

export interface NotificationEvent {
  id: string
  type: 'push_sent' | 'push_delivered' | 'push_clicked' | 'push_failed'
       | 'email_sent' | 'email_opened' | 'email_clicked' | 'email_failed'
       | 'email_unsubscribed'
  category?: string
  recipient?: string
  articleSlug?: string
  timestamp: string
  metadata?: Record<string, unknown>
}

// In-memory event log (dev fallback)
const eventLog: NotificationEvent[] = []

/**
 * Record a notification event.
 * In production, this would write to a database or analytics pipeline.
 */
export function recordNotificationEvent(event: Omit<NotificationEvent, 'id' | 'timestamp'>): void {
  const fullEvent: NotificationEvent = {
    ...event,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  }

  // Store in memory
  eventLog.push(fullEvent)

  // Keep log from growing unbounded
  if (eventLog.length > 10_000) {
    eventLog.splice(0, eventLog.length - 10_000)
  }

  // Log to console in dev
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${fullEvent.type}:`, {
      category: fullEvent.category,
      recipient: fullEvent.recipient && `${fullEvent.recipient.slice(0, 3)}…`,
      articleSlug: fullEvent.articleSlug,
    })
  }
}

/**
 * Get delivery stats for a given time window.
 */
export function getDeliveryStats(windowMs = 86400_000): {
  pushSent: number
  pushDelivered: number
  pushClicked: number
  pushFailed: number
  emailSent: number
  emailOpened: number
  emailClicked: number
  emailFailed: number
  emailUnsubscribed: number
} {
  const cutoff = Date.now() - windowMs

  const events = eventLog.filter(
    (e) => new Date(e.timestamp).getTime() > cutoff
  )

  return {
    pushSent: events.filter((e) => e.type === 'push_sent').length,
    pushDelivered: events.filter((e) => e.type === 'push_delivered').length,
    pushClicked: events.filter((e) => e.type === 'push_clicked').length,
    pushFailed: events.filter((e) => e.type === 'push_failed').length,
    emailSent: events.filter((e) => e.type === 'email_sent').length,
    emailOpened: events.filter((e) => e.type === 'email_opened').length,
    emailClicked: events.filter((e) => e.type === 'email_clicked').length,
    emailFailed: events.filter((e) => e.type === 'email_failed').length,
    emailUnsubscribed: events.filter((e) => e.type === 'email_unsubscribed').length,
  }
}

/**
 * Build a tracking pixel URL for email open tracking.
 */
export function buildTrackingPixel(
  eventType: 'email_opened' | 'email_clicked',
  category?: string,
  articleSlug?: string
): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theObserver.com'
  const params = new URLSearchParams({
    type: eventType,
    ...(category && { category }),
    ...(articleSlug && { slug: articleSlug }),
  })
  return `${siteUrl}/api/track?${params.toString()}`
}
