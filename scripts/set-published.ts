/* Set an existing article to published by slug.
   Usage: npx tsx scripts/set-published.ts <slug> */
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

async function main() {
  const slug = process.argv[2]
  if (!slug) throw new Error('usage: npx tsx scripts/set-published.ts <slug>')
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  try {
    const found = await payload.find({
      collection: 'articles',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    if (found.docs.length === 0) throw new Error(`article not found: ${slug}`)
    const article = found.docs[0] as any
    await payload.update({
      collection: 'articles',
      id: article.id as number,
      draft: false,
      data: { _status: 'published' },
    })
    console.log(`article published: ${slug} (id ${article.id})`)
    console.log('DONE.')
  } finally {
    await payload.destroy()
  }
}

main().catch((err) => {
  console.error('FAILED:', err instanceof Error ? err.message : String(err))
  process.exit(1)
})
