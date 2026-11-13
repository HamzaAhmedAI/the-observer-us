/* Update the Hamza Ahmed author avatar to a new photo.
   Uploads the file as a new media item and points the author at it.
   Usage: npx tsx scripts/update-author-avatar.ts <filename-in-../assets>
   (default: author-hamza-ahmed-v2.jpg)
   Env: ../.env.seed (copied from the VM). CMS_API_URL is overridden to
   the live site so the publish hook (if any) hits the real site.
   NOTE: tsx + Payload needs the local node_modules patch
   (loadEnv.js default import) and the config must be imported
   dynamically AFTER the env file loads (see seed-content.ts). */
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
const FILENAME = process.argv[2] ?? 'author-hamza-ahmed-v2.jpg'

async function main() {
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  try {
    const filePath = path.join(ASSETS, FILENAME)
    const data = fs.readFileSync(filePath)
    const media = await payload.create({
      collection: 'media',
      data: { alt: 'Hamza Ahmed, Founder & Editor-in-Chief of The Observer US' },
      file: { data, mimetype: 'image/jpeg', name: FILENAME, size: data.length },
    })
    console.log(`media uploaded: ${FILENAME} (id ${media.id})`)

    const authorFound = await payload.find({
      collection: 'authors',
      where: { slug: { equals: 'hamza-ahmed' } },
      limit: 1,
    })
    if (authorFound.docs.length === 0) {
      throw new Error('author hamza-ahmed not found')
    }
    const authorId = authorFound.docs[0].id as number
    await payload.update({
      collection: 'authors',
      id: authorId,
      data: { avatar: media.id as number },
    })
    console.log(`author avatar updated to media ${media.id}`)
    console.log('DONE.')
  } finally {
    await payload.destroy()
  }
}

main().catch((err) => {
  console.error('FAILED:', err instanceof Error ? err.message : String(err))
  process.exit(1)
})
