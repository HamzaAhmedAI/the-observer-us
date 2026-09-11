/* ============================================================
   Page-view tracking — increments viewCount on a published article.
   POST /api/track/view  { category, slug }
   Fire-and-forget; best-effort, never throws to the caller.
   ============================================================ */

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { category?: string; slug?: string }
    if (!body.category || !body.slug) {
      return NextResponse.json({ ok: false, error: 'category+slug required' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const found = await payload.find({
      collection: 'articles',
      where: {
        slug: { equals: body.slug },
        'category.slug': { equals: body.category },
        _status: { equals: 'published' },
      } as import('payload').Where,
      depth: 0,
      limit: 1,
      overrideAccess: true,
    })
    const doc = found.docs[0] as { id?: string | number; viewCount?: number } | undefined
    if (!doc?.id) {
      return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 })
    }

    await payload.update({
      collection: 'articles',
      id: doc.id,
      data: { viewCount: (doc.viewCount ?? 0) + 1 },
      overrideAccess: true,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    logger.warn('[track/view] failed', { error: (err as Error).message })
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
