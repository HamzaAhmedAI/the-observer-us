/* Generate Payload image-size variants for the two featured images.
   Payload's sharp integration didn't run under the tsx seed (and warns
   the same on the VM), so variants are generated here with sharp directly
   (centre-crop cover, same as Payload's 'centre' position) and the
   media rows' sizes JSON is updated to match.
   Variants: card 640x360, featured 1200x675, og 1200x630.
   Files land in public/media/ (served live via /api/media/file/).
   Run: node scripts/gen-media-variants.mjs (reads ../.env.seed for the DB) */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import pg from 'pg'

const { Client } = pg
const MEDIA_DIR = path.resolve(process.cwd(), 'public/media')
const SIZES = [
  { name: 'card', width: 640, height: 360 },
  { name: 'featured', width: 1200, height: 675 },
  { name: 'og', width: 1200, height: 630 },
]

function loadEnvFile(file) {
  const env = {}
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/)
    if (!m) continue
    let v = m[2].trim()
    if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) v = v.slice(1, -1)
    env[m[1]] = v
  }
  return env
}
const env = loadEnvFile(path.resolve(process.cwd(), '../.env.seed'))

const IMAGES = ['featured-credit-freeze-hub.jpg', 'featured-greystar-letter.jpg']

for (const filename of IMAGES) {
  const src = path.join(MEDIA_DIR, filename)
  const base = filename.replace(/\.jpg$/, '')
  const sizes = {}
  for (const s of SIZES) {
    const outName = `${base}-${s.width}x${s.height}.jpg`
    const outPath = path.join(MEDIA_DIR, outName)
    const info = await sharp(src)
      .resize(s.width, s.height, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 85 })
      .toFile(outPath)
    sizes[s.name] = {
      url: `/api/media/file/${outName}`,
      width: s.width,
      height: s.height,
      filename: outName,
      mimeType: 'image/jpeg',
      filesize: info.size,
    }
    console.log(`generated ${outName} (${info.size} bytes)`)
  }
  const client = new Client({ connectionString: env.DATABASE_URL })
  await client.connect()
  try {
    await client.query(`update media set sizes = $1 where filename = $2`, [JSON.stringify(sizes), filename])
    console.log(`sizes JSON stored for ${filename}`)
  } finally {
    await client.end()
  }
}
console.log('DONE. Sync the variant files to the VM: scp public/media/featured-*-*.jpg opc@...:/opt/observer/the-observer-us/public/media/')
