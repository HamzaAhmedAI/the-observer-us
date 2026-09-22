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

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    // Additional security: reject common XSS patterns in email
    const xssPatterns = [
      /<script\b/gi,
      /javascript:/gi,
      /onerror\s*=\s*['\"]?/gi,
      /onload\s*=\s*['\"]?/gi,
      /alert\s*\(/gi,
    ]

    for (const pattern of xssPatterns) {
      if (pattern.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format.' },
          { status: 400 }
        )
      }
    }

    // Validate categories (whitelist approach - only known categories)
    const KNOWN_CATEGORIES = ['politics', 'technology', 'business', 'sports', 'entertainment', 'health', 'science', 'world'] as const
    type KnownCategory = typeof KNOWN_CATEGORIES[number]

    const validCategories = Array.isArray(categories)
      ? categories
          .filter((c): c is string => typeof c === 'string')
          .map((s) => s.toLowerCase().trim())
          .filter((s): s is KnownCategory => KNOWN_CATEGORIES.includes(s as KnownCategory))
      : []

    // Sanitize categories: reject path traversal, injection attempts
    for (const cat of validCategories) {
      if (cat.includes('../') || cat.includes('/../') || cat.includes('..\\')) {
        return NextResponse.json(
          { error: 'Invalid category format.' },
          { status: 400 }
        )
      }

      // Reject SQL injection-like patterns
      if (cat.includes(' OR ') || cat.includes('SELECT ') || cat.includes('INSERT ')) {
        return NextResponse.json(
          { error: 'Invalid category format.' },
          { status: 400 }
        )
      }
    }

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
