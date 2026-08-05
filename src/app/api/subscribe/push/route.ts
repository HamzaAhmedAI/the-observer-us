/* ============================================================
   The Observer US — Push Subscribe API
   Registers a web push subscription for browser notifications.
   ============================================================ */

import { NextResponse } from 'next/server'
import { createPushSubscription } from '@/lib/db'
import { checkRateLimitByIP } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    // Rate limit: 10 push subscription attempts per minute per IP
    const { allowed } = checkRateLimitByIP(request, { max: 10, windowMs: 60_000 })
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { subscription, categories } = body

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Valid push subscription is required.' },
        { status: 400 }
      )
    }

    // Store push subscription in database
    const { error } = await createPushSubscription({
      endpoint: subscription.endpoint,
      p256dh: subscription.keys?.p256dh ?? '',
      auth: subscription.keys?.auth ?? '',
      categories: categories ?? [],
    })
    if (error) throw new Error(error)

    return NextResponse.json({
      success: true,
      message: 'Push subscription registered.',
    })
  } catch (error) {
    console.error('Push subscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to register push subscription.' },
      { status: 500 }
    )
  }
}
