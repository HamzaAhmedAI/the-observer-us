/* Fast DB check for the 404: list article rows, their category slugs,
   version rows, and media urls. Uses pg directly (fast, no Payload init).
   Run: node scripts/diag-article.mjs (reads ../.env.seed) */
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'

const { Client } = pg
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
const client = new Client({ connectionString: env.DATABASE_URL })
await client.connect()
try {
  const a = await client.query(
    `select a.id, a.slug, a._status, a.category_id, c.slug as category_slug, a.featured_image_id, a.author_id, a.published_at
     from articles a left join categories c on c.id = a.category_id order by a.id desc limit 5`
  )
  console.log('articles:', JSON.stringify(a.rows, null, 1))
  const v = await client.query(`select parent_id, version_slug, version__status, latest from _articles_v order by id desc limit 5`)
  console.log('versions:', JSON.stringify(v.rows))
  const m = await client.query(`select id, filename, url, width, height, mime_type, sizes is not null as has_sizes from media order by id desc limit 5`)
  console.log('media:', JSON.stringify(m.rows))
} finally {
  await client.end()
}
console.log('DONE.')
