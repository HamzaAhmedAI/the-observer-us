/* ============================================================
   The Observer US — Email Subscribe API
   ============================================================ */

import { NextResponse } from 'next/server'
import { createSubscriber, deleteSubscriber } from '@/lib/db'
import { checkRateLimitByIP } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    // Rate limit: 5 subscribe attempts per minute per IP
    const { allowed } = checkRateLimitByIP(request, { max: 5, windowMs: 60_000 })
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, categories } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    // Validate categories (optional)
    const validCategories = Array.isArray(categories)
      ? categories.filter((c): c is string => typeof c === 'string')
      : []

    // Store subscriber in database
    const { error } = await createSubscriber(email, validCategories)
    if (error) throw new Error(error)

    // TODO: Send confirmation email via Resend
    // await resend.emails.send({
    //   from: 'The Observer US <newsletter@theObserver.com>',
    //   to: email,
    //   subject: 'Confirm your subscription',
    //   html: `<p>Thanks for subscribing!</p>`,
    // })

    return NextResponse.json({
      success: true,
      message: 'Subscription successful. Check your inbox for confirmation.',
    })
  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required.' },
        { status: 400 }
      )
    }

    const { error } = await deleteSubscriber(email)
    if (error) throw new Error(error)

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed.',
    })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe. Please try again.' },
      { status: 500 }
    )
  }
}
