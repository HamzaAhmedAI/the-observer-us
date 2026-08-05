/* ============================================================
   The Observer US — Cache Revalidation Webhook
   Called by the CMS when an article is published or updated.
   Secret-authenticated to prevent cache poisoning.
   ============================================================ */

import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET ?? ''

export async function POST(request: Request) {
  try {
    // Authenticate the webhook
    const authHeader = request.headers.get('authorization')
    const body = await request.json()

    // Check secret
    const token = authHeader?.replace('Bearer ', '') ?? body.secret
    if (!token || token !== REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid or missing secret.' },
        { status: 401 }
      )
    }

    const { category, slug } = body

    if (!category || !slug) {
      return NextResponse.json(
        { error: 'category and slug are required.' },
        { status: 400 }
      )
    }

    // Revalidate the article page
    const articlePath = `/${category}/${slug}`
    revalidatePath(articlePath)

    // Also revalidate the category feed and homepage
    revalidatePath(`/${category}`)
    revalidatePath('/')

    return NextResponse.json({
      success: true,
      revalidated: [articlePath, `/${category}`, '/'],
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Revalidation failed.' },
      { status: 500 }
    )
  }
}
