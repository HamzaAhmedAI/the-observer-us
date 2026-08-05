/* ============================================================
   The Observer US — Dynamic OpenGraph Image Generator
   Generates 1200×630 OG images for article pages with
   title, category badge, and brand styling.
   ============================================================ */

import { ImageResponse } from 'next/og'
import { getArticleBySlug } from '@/lib/cms'
import { SITE_NAME } from '@/lib/seo'

export const alt = 'Article'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Load a Google Font as ArrayBuffer for use with ImageResponse.
 */
async function loadFont(family: string, weight: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`
  const css = await fetch(cssUrl, { cache: 'force-cache' }).then((r) => r.text())
  const srcMatch = css.match(/src:\s*url\(([^)]+)\)/)
  if (!srcMatch) throw new Error(`Failed to resolve font URL for ${family}`)
  return fetch(srcMatch[1], { cache: 'force-cache' }).then((r) => r.arrayBuffer())
}

interface Props {
  params: { category: string; slug: string }
}

export default async function OpenGraphImage({ params }: Props) {
  const { category, slug } = params
  const article = await getArticleBySlug(category, slug)

  const title = article?.title ?? 'Article Not Found'
  const categoryName = article?.category.name ?? category
  const accentColor = '#dc2626'
  const textMuted = '#94a3b8'

  // Load fonts
  const [outfitBold, outfitRegular] = await Promise.all([
    loadFont('Outfit', '700'),
    loadFont('Outfit', '400'),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          fontFamily: 'Outfit',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative top accent bar */}
        <div
          style={{
            height: 6,
            width: '100%',
            background: accentColor,
          }}
        />

        {/* Subtle decorative circle (top-right) */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(220, 38, 38, 0.06)',
          }}
        />

        {/* Subtle decorative circle (bottom-left) */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.03)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: 72,
            paddingRight: 72,
            flex: 1,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Brand name */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: textMuted,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            {SITE_NAME}
          </div>

          {/* Category badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: accentColor,
              }}
            />
            <span
              style={{
                fontSize: 16,
                fontWeight: 400,
                color: accentColor,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {categoryName}
            </span>
          </div>

          {/* Article title */}
          <h1
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: '#f8fafc',
              lineHeight: 1.15,
              margin: 0,
              padding: 0,
              maxWidth: 900,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom bar with URL */}
        <div
          style={{
            height: 48,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 72,
            paddingRight: 72,
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: textMuted,
              letterSpacing: '0.1em',
            }}
          >
            theobserveer.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Outfit', data: outfitBold, weight: 700, style: 'normal' },
        { name: 'Outfit', data: outfitRegular, weight: 400, style: 'normal' },
      ],
    }
  )
}
