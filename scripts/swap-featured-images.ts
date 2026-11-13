/* Swap the featured images of the two live articles to the v3
   (dark-icon) variants the owner picked.
   Uploads both files as new media, then updates each article's
   featuredImage + seo.ogImage. Variants are generated afterwards by
   scripts/gen-media-variants.mjs (pass the new filenames).
   Usage: npx tsx scripts/swap-featured-images.ts
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

const VARIANTS = path.resolve(process.cwd(), '../assets/variants')

const SWAPS = [
  {
    slug: 'how-to-freeze-your-credit-at-all-three-bureaus-free',
    file: 'v3-darkicon-hub.jpg',
    newName: 'featured-credit-freeze-hub-v3.jpg',
    alt: 'Freeze your credit at all three bureaus — free, about 30 minutes online',
  },
  {
    slug: 'got-a-greystar-letter-do-these-4-things',
    file: 'v3-darkicon-greystar.jpg',
    newName: 'featured-greystar-letter-v3.jpg',
    alt: 'Got a Greystar breach letter? Four things to do before your deadline',
  },
]

async function main() {
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  try {
    for (const swap of SWAPS) {
      const filePath = path.join(VARIANTS, swap.file)
      const data = fs.readFileSync(filePath)
      const media = await payload.create({
        collection: 'media',
        data: { alt: swap.alt },
        file: { data, mimetype: 'image/jpeg', name: swap.newName, size: data.length },
      })
      console.log(`media uploaded: ${swap.newName} (id ${media.id})`)

      const found = await payload.find({
        collection: 'articles',
        where: { slug: { equals: swap.slug } },
        limit: 1,
      })
      if (found.docs.length === 0) throw new Error(`article not found: ${swap.slug}`)
      const article = found.docs[0] as any
      await payload.update({
        collection: 'articles',
        id: article.id as number,
        data: {
          featuredImage: media.id as number,
          seo: { ...article.seo, ogImage: media.id as number },
        },
      })
      console.log(`article updated: ${swap.slug} -> media ${media.id}`)
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
