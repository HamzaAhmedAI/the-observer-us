/* ============================================================
   The Observer US — Notification Templates
   Push payload builders and email HTML templates.
   ============================================================ */

import { SITE_NAME, SITE_URL } from '@/lib/seo'

// ─── Push Notification Payload ─────────────────────────────

export interface PushPayload {
  title: string
  body: string
  url: string
  icon?: string
  image?: string
  badge?: string
}

/**
 * Build a push notification payload for a breaking news alert.
 */
export function buildBreakingNewsPush(
  headline: string,
  articleUrl: string,
  thumbnailUrl?: string
): PushPayload {
  return {
    title: `🚨 BREAKING: ${headline.slice(0, 60)}`,
    body: headline.length > 60 ? `${headline.slice(0, 100)}…` : 'Tap to read the full story.',
    url: articleUrl,
    icon: '/icon-192.png',
    image: thumbnailUrl,
    badge: '/badge-72.png',
  }
}

/**
 * Build a push notification payload for a regular article alert.
 */
export function buildArticlePush(
  headline: string,
  categoryName: string,
  articleUrl: string,
  thumbnailUrl?: string
): PushPayload {
  return {
    title: `${categoryName}: ${headline.slice(0, 70)}`,
    body: 'New article from The Observer US',
    url: articleUrl,
    icon: '/icon-192.png',
    image: thumbnailUrl,
    badge: '/badge-72.png',
  }
}

// ─── Email HTML Templates ─────────────────────────────────

const BRAND_COLOR = '#dc2626'
const BG_LIGHT = '#f8fafc'
const TEXT_PRIMARY = '#0f172a'
const TEXT_SECONDARY = '#475569'
const TEXT_TERTIARY = '#94a3b8'
const BORDER_COLOR = '#e2e8f0'

/**
 * Wraps content in a shared email layout.
 */
function emailLayout(body: string, title: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theObserver.com'
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${BG_LIGHT};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:${BRAND_COLOR};padding:24px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">
                ${SITE_NAME}
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid ${BORDER_COLOR};">
              <p style="margin:0 0 8px;font-size:12px;color:${TEXT_TERTIARY};">
                You received this because you subscribed to <strong style="color:${TEXT_PRIMARY};">${SITE_NAME}</strong>.
              </p>
              <p style="margin:0;font-size:12px;color:${TEXT_TERTIARY};">
                <a href="{{unsubscribe_url}}" style="color:${BRAND_COLOR};text-decoration:underline;">Unsubscribe</a>
                 ·
                <a href="${SITE_URL}/account/preferences" style="color:${BRAND_COLOR};text-decoration:underline;">Manage preferences</a>
              </p>
            </td>
          </tr>
        </table>
        <!-- Tracking pixel -->
        <img src="${siteUrl}/api/track?type=email_opened" alt=""
             width="1" height="1" style="display:none;" />
      </td>
    </tr>
  </table>
</body>
</html>`
}

/**
 * Build a breaking-news alert email.
 */
export function buildBreakingNewsEmail(
  headline: string,
  excerpt: string,
  articleUrl: string,
  categoryName: string,
  authorName: string,
  thumbnailUrl?: string
): string {
  const body = `
    <div style="margin-bottom:24px;">
      <span style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;font-size:11px;font-weight:700;padding:4px 10px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px;">
        BREAKING NEWS
      </span>
    </div>
    <h2 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:${TEXT_PRIMARY};">
      ${headline}
    </h2>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      ${excerpt}
    </p>
    ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="" style="width:100%;height:auto;border-radius:6px;margin-bottom:16px;" />` : ''}
    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="background:${BRAND_COLOR};border-radius:6px;">
          <a href="${articleUrl}" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">
            Read Full Story
          </a>
        </td>
      </tr>
    </table>
    <p style="margin-top:16px;font-size:12px;color:${TEXT_TERTIARY};">
      By ${authorName} · ${categoryName}
    </p>
  `
  return emailLayout(body, `BREAKING: ${headline.slice(0, 50)}`)
}

/**
 * Build a daily digest email with top articles.
 */
export function buildDigestEmail(
  date: string,
  articles: Array<{
    headline: string
    excerpt: string
    url: string
    categoryName: string
    thumbnailUrl?: string
  }>
): string {
  const articlesHtml = articles
    .map(
      (a, i) => `
    <tr>
      <td style="padding:${i > 0 ? '20px 0 0' : '0 0 0'};${i < articles.length - 1 ? `border-bottom:1px solid ${BORDER_COLOR};padding-bottom:20px;` : ''}">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            ${a.thumbnailUrl ? `
            <td style="width:96px;padding-right:16px;vertical-align:top;">
              <img src="${a.thumbnailUrl}" alt="" style="width:96px;height:64px;object-fit:cover;border-radius:4px;" />
            </td>` : ''}
            <td style="vertical-align:top;">
              <span style="font-size:11px;color:${BRAND_COLOR};font-weight:600;text-transform:uppercase;">
                ${a.categoryName}
              </span>
              <h3 style="margin:2px 0 6px;font-size:16px;line-height:1.4;color:${TEXT_PRIMARY};">
                <a href="${a.url}" style="color:${TEXT_PRIMARY};text-decoration:none;">
                  ${a.headline}
                </a>
              </h3>
              <p style="margin:0;font-size:13px;line-height:1.5;color:${TEXT_SECONDARY};">
                ${a.excerpt}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `
    )
    .join('')

  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;color:${TEXT_PRIMARY};">
      Your Daily Digest
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:${TEXT_TERTIARY};">
      ${date} · Top stories curated for you
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      ${articlesHtml}
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
      <tr>
        <td style="background:${BRAND_COLOR};border-radius:6px;">
          <a href="${SITE_URL}" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">
            View Full Site
          </a>
        </td>
      </tr>
    </table>
  `
  return emailLayout(body, `Daily Digest — ${date}`)
}

/**
 * Build a confirmation email for new subscribers.
 */
export function buildConfirmationEmail(email: string): string {
  const body = `
    <h2 style="margin:0 0 12px;font-size:22px;color:${TEXT_PRIMARY};">
      You're subscribed!
    </h2>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      Thanks for subscribing to <strong>${SITE_NAME}</strong> at <strong>${email}</strong>.
    </p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      You'll receive breaking news alerts and our daily digest based on your preferences.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="background:${BRAND_COLOR};border-radius:6px;">
          <a href="${SITE_URL}" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">
            Start Reading
          </a>
        </td>
      </tr>
    </table>
  `
  return emailLayout(body, 'Welcome to The Observer US')
}

/**
 * Build an unsubscribe confirmation email.
 */
export function buildUnsubscribeConfirmationEmail(email: string): string {
  const body = `
    <h2 style="margin:0 0 12px;font-size:22px;color:${TEXT_PRIMARY};">
      You've been unsubscribed
    </h2>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      <strong>${email}</strong> has been removed from our mailing list.
    </p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${TEXT_SECONDARY};">
      If this was a mistake, you can re-subscribe at any time.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="background:${BRAND_COLOR};border-radius:6px;">
          <a href="${SITE_URL}/account/preferences" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">
            Re-subscribe
          </a>
        </td>
      </tr>
    </table>
  `
  return emailLayout(body, 'Unsubscribed — The Observer US')
}
