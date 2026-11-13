/* Fix missing columns in the Payload versions tables.
   The manual DDL on 2026-11-13 mirrored the three new article fields
   into _articles_v but missed version_view_count (and possibly others),
   so saving an article version failed and no article could be created.
   This compares each versions table against the columns Payload expects
   (from the collection definitions) and adds whatever is missing.
   Run: node scripts/fix-versions-schema.mjs  (reads ../.env.seed)
*/
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

// table -> { column: postgres type }
const EXPECTED = {
  _articles_v: {
    id: 'serial',
    parent_id: 'integer',
    version_title: 'text',
    version_slug: 'text',
    version_excerpt: 'text',
    version_content: 'text',
    version_featured_image_id: 'integer',
    version_category_id: 'integer',
    version_author_id: 'integer',
    version_content_type: 'varchar',
    version_last_reviewed: 'timestamp with time zone',
    version_contains_affiliate_links: 'boolean',
    version_published_at: 'timestamp with time zone',
    version_is_breaking: 'boolean',
    version_is_featured: 'boolean',
    version_view_count: 'integer',
    version_read_time: 'integer',
    version_seo_title: 'text',
    version_seo_description: 'text',
    version_seo_og_image_id: 'integer',
    version_seo_canonical: 'text',
    version_seo_noindex: 'boolean',
    version_updated_at: 'timestamp with time zone',
    version_created_at: 'timestamp with time zone',
    version__status: 'varchar',
    created_at: 'timestamp with time zone',
    updated_at: 'timestamp with time zone',
    latest: 'boolean',
  },
}

const client = new Client({ connectionString: env.DATABASE_URL })
await client.connect()
try {
  for (const [table, cols] of Object.entries(EXPECTED)) {
    const res = await client.query(
      `select column_name from information_schema.columns where table_name = $1`,
      [table]
    )
    const existing = new Set(res.rows.map((r) => r.column_name))
    const missing = Object.entries(cols).filter(([c]) => !existing.has(c))
    if (missing.length === 0) {
      console.log(`${table}: complete (${existing.size} columns)`)
      continue
    }
    for (const [col, type] of missing) {
      const def =
        type === 'boolean' ? 'DEFAULT false'
        : type === 'integer' ? 'DEFAULT 0'
        : type === 'serial' ? ''
        : ''
      await client.query(`ALTER TABLE "${table}" ADD COLUMN "${col}" ${type} ${def}`)
      console.log(`${table}: added ${col} ${type}`)
    }
  }
  // Also report the media sizes state (sharp warning during seed).
  const mediaCols = await client.query(
    `select column_name from information_schema.columns where table_name = 'media'`
  )
  const mediaColNames = new Set(mediaCols.rows.map((r) => r.column_name))
  if (!mediaColNames.has('sizes')) {
    await client.query(`ALTER TABLE "media" ADD COLUMN "sizes" jsonb`)
    console.log('media: added sizes jsonb')
  } else {
    console.log('media: sizes column present')
  }
  const mediaV = await client.query(
    `select column_name from information_schema.columns where table_name = '_media_v'`
  )
  if (mediaV.rows.length > 0) {
    const vCols = new Set(mediaV.rows.map((r) => r.column_name))
    if (!vCols.has('version_sizes')) {
      await client.query(`ALTER TABLE "_media_v" ADD COLUMN "version_sizes" jsonb`)
      console.log('_media_v: added version_sizes jsonb')
    } else {
      console.log('_media_v: version_sizes present')
    }
  } else {
    console.log('_media_v: no versions table (media has versions disabled)')
  }
  const media = await client.query(`select filename from media order by id`)
  console.log('media rows:', JSON.stringify(media.rows))
} finally {
  await client.end()
}
console.log('DONE.')
