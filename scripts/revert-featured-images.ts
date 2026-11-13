/* Revert the two articles' featured images to the original (v1) media.
   Used 2026-11-13 after the user decided to keep the old default design.
   Hub -> media 1157 (featured-credit-freeze-hub.jpg)
   Greystar -> media 1158 (featured-greystar-letter.jpg)
   Usage: npx tsx scripts/revert-featured-images.ts
   Env: ../.env.seed. Same tsx/Payload notes as seed-content.ts. */
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

const REVERTS = [
  { slug: 'how-to-freeze-your-credit-at-all-three-bureaus-free', mediaId: 1157 },
  { slug: 'got-a-greystar-letter-do-these-4-things', mediaId: 1158 },
]

async function main() {
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  try {
    for (const r of REVERTS) {
      const found = await payload.find({
        collection: 'articles',
        where: { slug: { equals: r.slug } },
        limit: 1,
      })
      if (found.docs.length === 0) throw new Error(`article not found: ${r.slug}`)
      const article = found.docs[0] as any
      await payload.update({
        collection: 'articles',
        id: article.id as number,
        data: {
          featuredImage: r.mediaId,
          seo: { ...article.seo, ogImage: r.mediaId },
        },
      })
      console.log(`article reverted: ${r.slug} -> media ${r.mediaId}`)
    }
    console.log('DONE.')
  } finally {
    await payload.destroy()
  }
}

main().catch((err) => {
  console.error('FAILED:', err instanceof Error ? err.message : String(err))
  process.exit(1)
})
