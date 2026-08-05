/* ============================================================
   The Observer US — Publish Event Dispatcher
   Triggered when a new article is published.
   Sends push notifications and email alerts to subscribers.
   ============================================================ */

import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/seo'
import { dispatchBreakingNewsPush } from '@/lib/notifications/push'
import { dispatchBreakingNewsEmail } from '@/lib/notifications/email'
import { recordNotificationEvent } from '@/lib/notifications/analytics'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { article, secret } = body

    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    if (!article?.slug || !article?.category) {
      return NextResponse.json(
        { error: 'Article slug and category required.' },
        { status: 400 }
      )
    }

    const articleUrl = `${SITE_URL}/${article.category}/${article.slug}`
    const dispatchResults: Record<string, unknown> = {}

    // 1. Google Indexing API ping
    try {
      await fetch(`https://www.google.com/ping?sitemap=${SITE_URL}/news-sitemap.xml`)
      dispatchResults.google = 'pinged'
    } catch {
      console.warn('[Notify] Google ping failed — skipping.')
      dispatchResults.google = 'skipped'
    }

    // 2. IndexNow ping
    try {
      await fetch('https://api.indexnow.org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: new URL(SITE_URL).hostname,
          key: process.env.INDEXNOW_KEY ?? '',
          urlList: [articleUrl],
        }),
      })
      dispatchResults.indexnow = 'pinged'
    } catch {
      console.warn('[Notify] IndexNow ping failed — skipping.')
      dispatchResults.indexnow = 'skipped'
    }

    // 3. Push notifications to category subscribers
    if (article.isBreaking) {
      const pushResult = await dispatchBreakingNewsPush(
        article.category,
        article.title,
        articleUrl,
        article.thumbnailUrl
      )
      dispatchResults.push = pushResult
      recordNotificationEvent({
        type: 'push_sent',
        category: article.category,
        articleSlug: article.slug,
        metadata: pushResult,
      })
    } else {
      dispatchResults.push = 'skipped — not breaking'
    }

    // 4. Email alerts to category subscribers
    if (article.isBreaking) {
      const emailResult = await dispatchBreakingNewsEmail(
        article.category,
        article.title,
        article.excerpt ?? '',
        articleUrl,
        article.categoryName ?? article.category,
        article.authorName ?? 'The Observer Staff',
        article.thumbnailUrl
      )
      dispatchResults.email = emailResult
      recordNotificationEvent({
        type: 'email_sent',
        category: article.category,
        articleSlug: article.slug,
        metadata: emailResult,
      })
    } else {
      dispatchResults.email = 'skipped — not breaking'
    }

    return NextResponse.json({
      success: true,
      notified: dispatchResults,
    })
  } catch (error) {
    console.error('Notify error:', error)
    return NextResponse.json({ error: 'Notification dispatch failed.' }, { status: 500 })
  }
}
