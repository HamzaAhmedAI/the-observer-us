import { NextRequest } from 'next/server'
import { getArticleBySlug } from '@/lib/cms'
import { SITE_NAME, SITE_URL } from '@/lib/seo'

export const runtime = 'nodejs'
export const revalidate = 3600

const AMP_CSS = `
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a1a;margin:0;padding:0;line-height:1.6;background:#fff}
.amp-header{background:#fff;border-bottom:1px solid #e5e5e5;padding:12px 16px;display:flex;align-items:center;justify-content:space-between}
.amp-logo{font-size:18px;font-weight:700;color:#1a1a1a;text-decoration:none}
.amp-logo span{color:#dc2626}
.amp-article{max-width:800px;margin:0 auto;padding:24px 16px}
.amp-category{display:inline-block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#dc2626;margin-bottom:12px;text-decoration:none}
h1{font-size:28px;line-height:1.25;font-weight:800;margin:0 0 12px;color:#111}
.amp-excerpt{font-size:18px;color:#555;margin:0 0 20px;line-height:1.5}
.amp-meta{display:flex;align-items:center;gap:12px;font-size:13px;color:#666;margin-bottom:20px;flex-wrap:wrap}
.amp-author{font-weight:600;color:#333;text-decoration:none}
.amp-image-wrap{position:relative;width:100%;aspect-ratio:16/9;margin-bottom:24px}
.amp-image-credit{font-size:11px;color:#888;margin-top:4px;text-align:right}
.amp-body{font-size:17px;line-height:1.75;color:#222}
.amp-body h2{font-size:22px;margin:32px 0 12px;color:#111}
.amp-body h3{font-size:18px;margin:24px 0 8px;color:#111}
.amp-body p{margin:0 0 20px}
.amp-body a{color:#2563eb}
.amp-body blockquote{border-left:4px solid #dc2626;margin:24px 0;padding:4px 20px;color:#555;font-style:italic;font-size:19px}
.amp-body ul,.amp-body ol{padding-left:24px;margin:0 0 20px}
.amp-body li{margin-bottom:8px}
.amp-body figure{margin:24px 0}
.amp-body figcaption{font-size:13px;color:#777;margin-top:6px;text-align:center}
.amp-footer{background:#f9f9f9;border-top:1px solid #e5e5e5;padding:24px 16px;text-align:center;font-size:13px;color:#666}
.amp-footer a{color:#dc2626;text-decoration:none;margin:0 8px}
.amp-canonical{font-size:12px;color:#999;margin-top:16px}
.amp-not-found{padding:40px 16px;text-align:center}
.amp-not-found h1{font-size:24px;margin-bottom:12px}
.amp-not-found p{color:#666;margin-bottom:20px}
`

const AMP_BOILERPLATE =
  'body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}' +
  '@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}' +
  '@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}' +
  '@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}' +
  '@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}' +
  '@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function sanitizeAmpHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/<img(\s+([^>]*))?>/gi, (match) => {
      const srcM = match.match(/src=["']([^"']+)["']/)
      const altM = match.match(/alt=["']([^"']*)["']/)
      const wM = match.match(/width=["']?(\d+)["']?/)
      const hM = match.match(/height=["']?(\d+)["']?/)
      const src = srcM ? srcM[1] : ''
      const alt = altM ? altM[1] : ''
      const w = wM ? wM[1] : '800'
      const h = hM ? hM[1] : '450'
      return `<amp-img src="${src}" alt="${alt}" width="${w}" height="${h}" layout="responsive" />`
    })
    .replace(/\s+on\w+="[^"]*"/gi, '')
    .replace(/\s+on\w+='[^']*'/gi, '')
    .replace(/\s+style="[^"]*"/gi, '')
    .replace(/<(\/?)(script|style|link|noscript|iframe|object|embed|form|input|button)[^>]*>/gi, '')
}

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params

  const categoryMatch = slug.match(/^([^/]+)\/(.*)$/)
  if (!categoryMatch) {
    return new Response(
      `<!DOCTYPE html>
<html ⚡>
<head>
<meta charset="utf-8" />
<title>Invalid AMP URL | ${escapeHtml(SITE_NAME)}</title>
<link rel="canonical" href="${SITE_URL}" />
<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
<style amp-boilerplate>${AMP_BOILERPLATE}</style>
<style amp-custom>${AMP_CSS}</style>
<script async src="https://cdn.ampproject.org/v0.js"></script>
</head>
<body>
<div class="amp-not-found">
<h1>Invalid AMP URL</h1>
<p>Please use the pattern: /{category}/amp/{slug}</p>
<p><a href="${SITE_URL}">← Back to ${escapeHtml(SITE_NAME)}</a></p>
</div>
</body>
</html>`,
      {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      }
    )
  }

  const [category, articleSlug] = categoryMatch.slice(1, 3)
  const article = await getArticleBySlug(category, articleSlug)

  if (!article) {
    return new Response(
      `<!DOCTYPE html>
<html ⚡>
<head>
<meta charset="utf-8" />
<title>Article Not Found | ${escapeHtml(SITE_NAME)}</title>
<link rel="canonical" href="${SITE_URL}" />
<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
<style amp-boilerplate>${AMP_BOILERPLATE}</style>
<style amp-custom>${AMP_CSS}</style>
<script async src="https://cdn.ampproject.org/v0.js"></script>
</head>
<body>
<div class="amp-not-found">
<h1>Article Not Found</h1>
<p>The requested article could not be found.</p>
<p><a href="${SITE_URL}">← Back to ${escapeHtml(SITE_NAME)}</a></p>
</div>
</body>
</html>`,
      {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      }
    )
  }

  const canonicalUrl = `${SITE_URL}/${article.category.slug}/${article.slug}`
  const pubDate = new Date(article.publishedAt).toISOString()
  const modDate = new Date(article.updatedAt).toISOString()
  const sanitizedContent = sanitizeAmpHtml(article.content)
  const imageAlt = article.featuredImage.alt || article.title

  return new Response(
    `<!DOCTYPE html>
<html ⚡>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(article.seo.title)} | ${escapeHtml(SITE_NAME)}</title>
<meta name="description" content="${escapeHtml(article.seo.description)}" />
<link rel="canonical" href="${canonicalUrl}" />
<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
<style amp-boilerplate>${AMP_BOILERPLATE}</style>
<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
<style amp-custom>${AMP_CSS}</style>
<script async src="https://cdn.ampproject.org/v0.js"></script>
</head>
<body>
<header class="amp-header">
<a href="${SITE_URL}" class="amp-logo"><span>The</span> Observer<span style="font-size:12px;color:#999;font-weight:400">US</span></a>
<a href="${canonicalUrl}" style="font-size:13px;color:#666;text-decoration:none">Full site →</a>
</header>

<article class="amp-article" itemscope itemtype="http://schema.org/NewsArticle">
<meta itemprop="datePublished" content="${pubDate}" />
<meta itemprop="dateModified" content="${modDate}" />

<a href="/${article.category.slug}" class="amp-category">${escapeHtml(article.category.name)}</a>

<h1 itemprop="headline">${escapeHtml(article.title)}</h1>

<p class="amp-excerpt" itemprop="description">${escapeHtml(article.excerpt)}</p>

<div class="amp-meta">
<span itemprop="author" itemscope itemtype="http://schema.org/Person">
<a href="/author/${escapeHtml(article.author.slug)}" class="amp-author" itemprop="name">${escapeHtml(article.author.name)}</a>
</span>
<span>·</span>
<time datetime="${pubDate}" itemprop="datePublished">${formatDate(article.publishedAt)}</time>
<span>·</span>
<span>${article.readTime} min read</span>
</div>

<div class="amp-image-wrap">
<amp-img src="${escapeHtml(article.featuredImage.url)}" alt="${escapeHtml(imageAlt)}" width="1600" height="900" layout="responsive" />
${imageAlt ? `<p class="amp-image-credit">${escapeHtml(imageAlt)}</p>` : ''}
</div>

<div class="amp-body" itemprop="articleBody">${sanitizedContent}</div>

<div style="display:none" itemprop="publisher" itemscope itemtype="http://schema.org/NewsMediaOrganization">
<span itemprop="name">${escapeHtml(SITE_NAME)}</span>
</div>
</article>

<footer class="amp-footer">
<p>
<a href="${SITE_URL}">${escapeHtml(SITE_NAME)}</a>
<a href="/about">About</a>
<a href="/contact">Contact</a>
<a href="/privacy">Privacy</a>
</p>
<p style="margin-top:8px">Powered by AI-assisted journalism · Editorial review on all stories</p>
<p class="amp-canonical"><a href="${canonicalUrl}">Read the full article on ${escapeHtml(SITE_NAME)} →</a></p>
</footer>
</body>
</html>`,
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    }
  )
}