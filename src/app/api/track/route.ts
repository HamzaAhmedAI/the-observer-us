/* ============================================================
   The Observer US — Tracking API
   GET: 1×1 transparent GIF for email open/click tracking.
   POST: Web Vitals reports, error boundary reports.
   ============================================================ */

import { NextResponse } from 'next/server'
import { recordNotificationEvent } from '@/lib/notifications/analytics'
import { logger } from '@/lib/logger'

// Minimal 1×1 transparent GIF
const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const category = searchParams.get('category')
  const slug = searchParams.get('slug')

  if (type === 'email_opened' || type === 'email_clicked') {
    recordNotificationEvent({
      type,
      category: category ?? undefined,
      articleSlug: slug ?? undefined,
    })
  }

  return new NextResponse(TRANSPARENT_GIF, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, max-age=0',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Web Vitals report
    if (body.name && body.value !== undefined) {
      logger.info('[WebVitals] Metric reported', {
        name: body.name,
        value: body.value,
        rating: body.rating,
        url: body.url,
      })
    }

    // Error boundary report
    if (body.type === 'error_boundary') {
      logger.error('[ErrorBoundary] Client error caught', {
        message: body.message,
        digest: body.digest,
        url: body.url,
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}
