/* Generic article publisher for the Observer US content sprint.
   Reads one JSON file describing an article and publishes it to the
   live CMS (Payload local API). Idempotent — skips when the slug exists.
   Usage: npx tsx scripts/publish-article.ts <path-to-article.json>
   JSON shape:
     {
       "title": "...", "slug": "...", "excerpt": "...",
       "content": "<p>...html...</p>",
       "category": "breach-actions",           // category slug
       "contentType": "evergreen-hub",        // evergreen-hub | news-hook |
                                              // tool-guide | comparison | checklist
       "readTime": 6, "lastReviewed": "2026-11-13",
       "containsAffiliateLinks": false,
       "featuredImage": "featured-xxx.jpg",   // file in ../assets (uploaded)
       "featuredImageAlt": "...",
       "sources": [{ "label": "...", "url": "https://..." }],
       "seo": { "title": "...", "description": "..." }
     }
   Env: ../.env.seed. Same tsx/Payload notes as seed-content.ts:
   config is imported dynamically AFTER the env file loads, and the
   local node_modules loadEnv.js patch is required (see seed-content.ts). */
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'

function loadEnvFile(file: string) {
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/)
    if (!m) continue
    let value = m[2].trim()
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) value = value.slice(1, -1)
    if (process.env[m[1]] === undefined) process.env[m[1]] = value
  }
}
loadEnvFile(path.resolve(process.cwd(), '../.env.seed'))
process.env.CMS_API_URL = 'https://theobserverus.com'

const ASSETS = path.resolve(process.cwd(), '../assets')

async function main() {
  const jsonPath = process.argv[2]
  if (!jsonPath) throw new Error('usage: npx tsx scripts/publish-article.ts <article.json>')
  const article = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  try {
    const existing = await payload.find({
      collection: 'articles',
      where: { slug: { equals: article.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`article exists: ${article.slug} (skipped)`)
      return
    }
    // Category by slug.
    const cat = await payload.find({
      collection: 'categories',
      where: { slug: { equals: article.category } },
      limit: 1,
    })
    if (cat.docs.length === 0) throw new Error(`category not found: ${article.category}`)
    const categoryId = cat.docs[0].id as number

    // Author (default hamza-ahmed).
    const author = await payload.find({
      collection: 'authors',
      where: { slug: { equals: article.author ?? 'hamza-ahmed' } },
      limit: 1,
    })
    if (author.docs.length === 0) throw new Error('author not found')
    const authorId = author.docs[0].id as number

    // Featured image: upload from ../assets unless an id is given.
    let featuredImageId: number
    if (typeof article.featuredImageId === 'number') {
      featuredImageId = article.featuredImageId
    } else {
      const filePath = path.join(ASSETS, article.featuredImage)
      const data = fs.readFileSync(filePath)
      const media = await payload.create({
        collection: 'media',
        data: { alt: article.featuredImageAlt ?? article.title },
        file: { data, mimetype: 'image/jpeg', name: article.featuredImage, size: data.length },
      })
      featuredImageId = media.id as number
      console.log(`media uploaded: ${article.featuredImage} (id ${featuredImageId})`)
    }

    const created = await payload.create({
      collection: 'articles',
      draft: false,
      data: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        featuredImage: featuredImageId,
        category: categoryId,
        author: authorId,
        contentType: article.contentType,
        sources: article.sources ?? [],
        lastReviewed: article.lastReviewed ?? null,
        containsAffiliateLinks: article.containsAffiliateLinks ?? false,
        readTime: article.readTime ?? 5,
        publishedAt: new Date().toISOString(),
        _status: 'published', // NOTE: draft:false alone left _status 'draft' (article 995) — this field is what actually publishes.
        seo: {
          title: article.seo?.title ?? article.title,
          description: article.seo?.description ?? article.excerpt,
          ogImage: featuredImageId,
        },
      },
    })
    console.log(`article PUBLISHED: /${article.category}/${article.slug} (id ${created.id})`)
    console.log('DONE.')
  } finally {
    await payload.destroy()
  }
}

main().catch((err) => {
  console.error('FAILED:', err instanceof Error ? err.message : String(err))
  process.exit(1)
})
