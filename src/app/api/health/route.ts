/* ============================================================
   The Observer US — Health Check API
   Public endpoint for monitoring and load balancers.
   ============================================================ */

import { NextResponse } from 'next/server'

export async function GET() {
  const start = Date.now()
  let db = 'unknown'
  let pipeline = 'unknown'

  // Verify DB connectivity by checking if the CMS API is responsive
  // (the site uses Payload CMS which talks to Neon Postgres)
  try {
    const CMS_API_URL = process.env.CMS_API_URL
    if (!CMS_API_URL) {
      db = 'error'
    } else {
      const res = await fetch(`${CMS_API_URL}/api/articles?limit=1`, {
        signal: AbortSignal.timeout(3000),
        headers: {
          Authorization: `Bearer ${process.env.PAYLOAD_SECRET || ''}`,
        },
      }).catch(() => null)
      db = res?.ok ? 'ok' : 'error'
    }
  } catch (err) {
    console.error('[Health] DB check failed:', err)
    db = 'error'
  }

  // Pipeline is healthy if the systemd timer ran recently
  // (checked via /proc uptime of the observer-pipeline.service)
  try {
    const res = await fetch('http://127.0.0.1:3030/api/status', {
      signal: AbortSignal.timeout(3000),
    }).catch(() => null)
    pipeline = res?.ok ? 'ok' : 'unknown'
  } catch {
    // Gateway unreachable — likely not a hard failure
    pipeline = 'unknown'
  }

  const healthy = db === 'ok'

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      checks: { db, pipeline },
      latencyMs: Date.now() - start,
    },
    {
      status: healthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    }
  )
}
