/* ============================================================
   The Observer US — Email Client (Resend / Mailchimp)
   ============================================================ */

// TODO: Initialize your preferred email client
// import { Resend } from 'resend'
// const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailPayload {
  to: string | string[]
  subject: string
  html: string
  from?: string
}

/**
 * Send an email via the configured provider.
 */
export async function sendEmail(payload: EmailPayload): Promise<void> {
  const { to, subject, html, from = 'The Observer US <newsletter@theObserver.com>' } = payload

  // TODO: Implement with Resend
  // await resend.emails.send({ from, to, subject, html })

  // Dev fallback — log instead of sending
  console.log('[Email] Would send:', { to, subject, htmlLength: html.length })
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
