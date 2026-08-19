/* ============================================================
   The Observer US — Payload CMS Configuration
   Collections: Users, Media, Categories, Authors, Articles
   ============================================================ */

import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Authors } from './collections/Authors'
import { Articles } from './collections/Articles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Storage strategy (self-hosted, free):
// We deliberately do NOT use Vercel Blob. Media uploads use Payload's
// built-in local `staticDir` (see collections/Media.ts) which serves files
// from the app's filesystem at /media/<file>. This keeps the whole stack
// Vercel-free. (Optional upgrade: swap to @payloadcms/storage-r2 on Cloudflare
// R2 later — but local disk is sufficient and $0 on the Oracle VM.)

export default buildConfig({
  // ─── Secret (top-level in Payload 3) ──────────────────────
  secret: process.env.PAYLOAD_SECRET || '',

  // ─── Admin ────────────────────────────────────────────────
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' — The Observer US CMS',
    },
  },

  // ─── Collections ──────────────────────────────────────────
  collections: [Users, Media, Categories, Authors, Articles],

  // ─── Database (Postgres — keep Neon free DB; any DATABASE_URL works) ─
  // Prefer DATABASE_URI; fall back to Neon's auto-injected vars
  // (unpooled first — Payload needs a direct connection for
  //  transactions/migrations, not the pgbouncer-pooled URL).
  // For self-hosting on the Oracle VM, point DATABASE_URL at your Neon
  // (free) connection string — that's where the real content lives.
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URI ||
        process.env.DATABASE_URL_UNPOOLED ||
        process.env.POSTGRES_URL_NON_POOLING ||
        process.env.DATABASE_URL ||
        '',
    },
    // Auto-create/update tables on boot (dev-style push).
    // Replace with proper `payload migrate` in production later.
    push: true,
  }),

  // ─── Storage: local disk (Vercel Blob removed for free self-hosting) ─
  // Media uploads are served from the app filesystem via staticDir.
  // No external storage dependency required.
  plugins: [],

  // ─── Types ────────────────────────────────────────────────
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  graphQL: {
    disable: true,
  },
})
