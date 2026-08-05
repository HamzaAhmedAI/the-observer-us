/* ============================================================
   The Observer US — Email Notification Dispatcher
   Sends breaking news alerts, daily digest, and confirmation
   emails via Resend (or logs in dev).
   ============================================================ */

import { getActiveSubscribers } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import {
  buildBreakingNewsEmail,
  buildDigestEmail,
  buildConfirmationEmail,
  buildUnsubscribeConfirmationEmail,
} from './templates'

/**
 * Dispatch a breaking news email alert to all active subscribers
 * who follow the given category.
 */
export async function dispatchBreakingNewsEmail(
  category: string,
  headline: string,
  excerpt: string,
  articleUrl: string,
  categoryName: string,
  authorName: string,
  thumbnailUrl?: string
): Promise<{ sent: number; failed: number }> {
  const { data: subscribers, error } = await getActiveSubscribers()

  if (error) {
    console.error('[EmailDispatcher] Failed to fetch subscribers:', error)
    return { sent: 0, failed: 0 }
  }

  if (!subscribers || subscribers.length === 0) {
    console.log('[EmailDispatcher] No active subscribers.')
    return { sent: 0, failed: 0 }
  }

  // Filter by category preference
  const matching = subscribers.filter(
    (sub) => !sub.categories.length || sub.categories.includes(category)
  )

  if (matching.length === 0) {
    console.log(`[EmailDispatcher] No subscribers for category: ${category}`)
    return { sent: 0, failed: 0 }
  }

  const html = buildBreakingNewsEmail(
    headline, excerpt, articleUrl, categoryName, authorName, thumbnailUrl
  )

  const emailAddresses = matching.map((s) => s.email)
  const substitutedHtml = html.replace(
    /{{unsubscribe_url}}/g,
    `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theObserver.com'}/unsubscribe`
  )

  try {
    await sendEmail({
      to: emailAddresses,
      subject: `BREAKING: ${headline.slice(0, 80)}`,
      html: substitutedHtml,
    })
    console.log(`[EmailDispatcher] Breaking news sent to ${emailAddresses.length} subscribers`)
    return { sent: emailAddresses.length, failed: 0 }
  } catch (err) {
    console.error('[EmailDispatcher] Send failed:', err)
    return { sent: 0, failed: emailAddresses.length }
  }
}

/**
 * Dispatch the daily digest email to all active subscribers.
 */
export async function dispatchDailyDigest(
  articles: Array<{
    headline: string
    excerpt: string
    url: string
    categoryName: string
    thumbnailUrl?: string
  }>
): Promise<{ sent: number; failed: number }> {
  const { data: subscribers, error } = await getActiveSubscribers()

  if (error) {
    console.error('[EmailDispatcher] Failed to fetch subscribers:', error)
    return { sent: 0, failed: 0 }
  }

  if (!subscribers || subscribers.length === 0) {
    console.log('[EmailDispatcher] No active subscribers for digest.')
    return { sent: 0, failed: 0 }
  }

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const html = buildDigestEmail(date, articles)
  const substitutedHtml = html.replace(
    /{{unsubscribe_url}}/g,
    `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theObserver.com'}/unsubscribe`
  )

  const emailAddresses = subscribers.map((s) => s.email)

  try {
    await sendEmail({
      to: emailAddresses,
      subject: `Your Daily Digest — ${date}`,
      html: substitutedHtml,
    })
    console.log(`[EmailDispatcher] Digest sent to ${emailAddresses.length} subscribers`)
    return { sent: emailAddresses.length, failed: 0 }
  } catch (err) {
    console.error('[EmailDispatcher] Digest send failed:', err)
    return { sent: 0, failed: emailAddresses.length }
  }
}

/**
 * Send a welcome/confirmation email to a new subscriber.
 */
export async function sendConfirmationEmail(email: string): Promise<void> {
  const html = buildConfirmationEmail(email)
  await sendEmail({ to: email, subject: 'Welcome to The Observer US', html })
}

/**
 * Send an unsubscribe confirmation email.
 */
export async function sendUnsubscribeConfirmation(email: string): Promise<void> {
  const html = buildUnsubscribeConfirmationEmail(email)
  await sendEmail({ to: email, subject: 'Unsubscribed — The Observer US', html })
}
