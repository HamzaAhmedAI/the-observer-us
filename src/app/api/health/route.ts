/* ============================================================
   The Observer US — Health Check API
   Returns system status for monitoring dashboards.
   ============================================================ */

import { NextResponse } from 'next/server'
import { getArticles, getCategories } from '@/lib/cms'
import { getActiveSubscribers } from '@/lib/db'
import { getDeliveryStats } from '@/lib/notifications/analytics'
import { SITE_NAME } from '@/lib/seo'

export async function GET() {
  const checks: Record<string, 'ok' | 'degraded' | 'failed'> = {}
  const details: Record<string, unknown> = {}

  // 1. CMS connectivity
  try {
    const articles = await getArticles({ limit: 1 })
    checks.cms = articles.data ? 'ok' : 'degraded'
    details.cms = { accessible: true, articleCount: articles.total }
  } catch (error) {
    checks.cms = 'failed'
    details.cms = { error: error instanceof Error ? error.message : 'Unknown' }
  }

  // 2. Categories
  try {
    const categories = await getCategories()
    checks.categories = categories.length > 0 ? 'ok' : 'degraded'
    details.categories = { count: categories.length }
  } catch (error) {
    checks.categories = 'failed'
    details.categories = { error: error instanceof Error ? error.message : 'Unknown' }
  }

  // 3. Database
  const dbConfigured = !!process.env.SUPABASE_URL
  if (dbConfigured) {
    try {
      const { data, error } = await getActiveSubscribers()
      checks.database = error ? 'failed' : 'ok'
      details.database = { subscriberCount: data?.length ?? 0 }
    } catch (error) {
      checks.database = 'failed'
      details.database = { error: error instanceof Error ? error.message : 'Unknown' }
    }
  } else {
    checks.database = 'degraded'
    details.database = { note: 'Not configured — using mock data' }
  }

  // 4. VAPID keys for push
  const vapidConfigured = !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  checks.push = vapidConfigured ? 'ok' : 'degraded'
  details.push = vapidConfigured
    ? { configured: true }
    : { note: 'VAPID keys not configured — push disabled' }

  // 5. Analytics (24h delivery stats)
  const stats = getDeliveryStats(86400_000)
  checks.analytics = 'ok'
  details.analytics = stats

  // Overall status
  const statusValues = Object.values(checks)
  const overall =
    statusValues.every((s) => s === 'ok')
      ? 'healthy'
      : statusValues.some((s) => s === 'failed')
        ? 'unhealthy'
        : 'degraded'

  const statusCode = overall === 'healthy' ? 200 : overall === 'degraded' ? 200 : 503

  return NextResponse.json(
    {
      service: SITE_NAME,
      status: overall,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
      details,
    },
    {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  )
}
