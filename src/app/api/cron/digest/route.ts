/* ============================================================
   The Observer US — Daily Digest Cron
   Triggered at 8:00 AM daily to send email digests.
   Fetches top articles and dispatches via email.
   ============================================================ */

import { NextResponse } from 'next/server'
import { getArticles } from '@/lib/cms'
import { dispatchDailyDigest } from '@/lib/notifications/email'
import { recordNotificationEvent } from '@/lib/notifications/analytics'

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    // Fetch top trending articles
    const { data: articles } = await getArticles({ page: 1, limit: 5 })

    if (!articles || articles.length === 0) {
      console.log('[Digest] No articles found — skipping.')
      return NextResponse.json({
        success: true,
        message: 'No articles to digest.',
      })
    }

    const digestArticles = articles.map((a) => ({
      headline: a.title,
      excerpt: a.excerpt,
      url: `/${a.category.slug}/${a.slug}`,
      categoryName: a.category.name,
      thumbnailUrl: a.featuredImage.url,
    }))

    // Dispatch digest
    const { sent, failed } = await dispatchDailyDigest(digestArticles)

    recordNotificationEvent({
      type: 'email_sent',
      metadata: { digest: true, articleCount: digestArticles.length, sent, failed },
    })

    return NextResponse.json({
      success: true,
      message: 'Daily digest dispatched.',
      articles: digestArticles.length,
      sent,
      failed,
      sentAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Digest error:', error)
    return NextResponse.json({ error: 'Digest dispatch failed.' }, { status: 500 })
  }
}
