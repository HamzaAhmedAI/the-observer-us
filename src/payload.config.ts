/* ============================================================
   The Observer US — Payload CMS Configuration
   Collections: Users, Media, Categories, Authors, Articles
   ============================================================ */

import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Authors } from './collections/Authors'
import { Articles } from './collections/Articles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Vercel Blob storage — enabled only when the token is present
const blobToken = process.env.BLOB_READ_WRITE_TOKEN

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

  // ─── Database (Postgres — Neon on Vercel) ─────────────────
  // Prefer DATABASE_URI; fall back to Neon's auto-injected vars
  // (unpooled first — Payload needs a direct connection for
  //  transactions/migrations, not the pgbouncer-pooled URL).
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

  // ─── Storage (Vercel Blob for media uploads) ──────────────
  plugins: [
    ...(blobToken
      ? [
          vercelBlobStorage({
            collections: {
              media: true,
            },
            token: blobToken,
          }),
        ]
      : []),
  ],

  // ─── Types ────────────────────────────────────────────────
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  graphQL: {
    disable: true,
  },
})
