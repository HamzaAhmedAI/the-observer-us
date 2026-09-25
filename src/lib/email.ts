/* ============================================================
   The Observer US — Email Client (Resend)
   ============================================================ */

import { Resend } from 'resend'
import { logger } from './logger'

let resendInstance: Resend | null = null

function getResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured')
    }
    resendInstance = new Resend(apiKey)
  }
  return resendInstance
}

export interface EmailPayload {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

/**
 * Send an email via Resend.
 */
export async function sendEmail(payload: EmailPayload): Promise<void> {
  const { to, subject, html, from = 'The Observer US <newsletter@theObserver.com>' } = payload
  const resend = getResend()

  try {
    const response = await resend.emails.send({ from, to, subject, html })
    logger.info('Email sent', { to, subject, responseId: (response as { id?: string }).id })
  } catch (error) {
    logger.error('Failed to send email', { to, subject, error })
    throw error
  }
}

/**
 * Send breaking news alert to subscribers.
 */
export async function sendBreakingNewsAlert(
  subscriberEmails: string[],
  articleTitle: string,
  articleUrl: string
): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #dc2626;">BREAKING NEWS</h1>
        <h2>${articleTitle}</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #475569;">
          Click below to read the full story on The Observer US.
        </p>
        <a href="${articleUrl}"
           style="display: inline-block; background: #dc2626; color: white;
                  padding: 12px 24px; border-radius: 8px; text-decoration: none;
                  font-weight: 600; margin-top: 16px;">
          Read Full Story
        </a>
        <hr style="margin-top: 32px; border: none; border-top: 1px solid #e2e8f0;" />
        <p style="font-size: 12px; color: #94a3b8;">
          You received this because you subscribed to breaking news alerts.
          <a href="{{unsubscribe_url}}">Unsubscribe</a>
        </p>
      </body>
    </html>
  `

  await sendEmail({
    to: subscriberEmails,
    subject: `BREAKING: ${articleTitle}`,
    html,
  })
}
