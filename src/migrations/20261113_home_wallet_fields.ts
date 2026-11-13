import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Home & Wallet Protection pivot — article schema.
 *
 * Adds the fields the pivot introduced on Articles (contentType, sources,
 * lastReviewed, containsAffiliateLinks) plus their version-table mirrors.
 *
 * Applied manually to the live Neon DB on 2026-11-13 (the `payload` CLI
 * could not load payload.config.ts on the VM — tsx loader failure on the
 * extensionless './collections/Users' import — so `payload migrate:create`
 * could not generate this). All statements are idempotent (IF NOT EXISTS),
 * so applying this file to a DB that already has the changes is a no-op.
 *
 * NOTE: `payload migrate` on the VM is still blocked by that CLI loader
 * issue. Fix the loader (or run the SQL in this file) before relying on
 * `payload migrate` for future schema changes.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "content_type" character varying DEFAULT 'news-hook';
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "last_reviewed" timestamp(3) with time zone;
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "contains_affiliate_links" boolean DEFAULT false;

    CREATE TABLE IF NOT EXISTS "articles_sources" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" character varying NOT NULL,
      "label" character varying NOT NULL,
      "url" character varying NOT NULL,
      CONSTRAINT "articles_sources_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "articles_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "articles"("id") ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS "articles_sources_order_idx" ON "articles_sources" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "articles_sources_parent_id_idx" ON "articles_sources" USING btree ("_parent_id");

    ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_content_type" character varying DEFAULT 'news-hook';
    ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_last_reviewed" timestamp(3) with time zone;
    ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_contains_affiliate_links" boolean DEFAULT false;

    CREATE SEQUENCE IF NOT EXISTS "_articles_v_version_sources_id_seq";
    CREATE TABLE IF NOT EXISTS "_articles_v_version_sources" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" integer NOT NULL DEFAULT nextval('_articles_v_version_sources_id_seq'::regclass),
      "label" character varying NOT NULL,
      "url" character varying NOT NULL,
      "_uuid" character varying,
      CONSTRAINT "_articles_v_version_sources_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "_articles_v_version_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "_articles_v"("id") ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS "_articles_v_version_sources_order_idx" ON "_articles_v_version_sources" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_articles_v_version_sources_parent_id_idx" ON "_articles_v_version_sources" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_articles_v_version_sources";
    DROP SEQUENCE IF EXISTS "_articles_v_version_sources_id_seq";
    ALTER TABLE "_articles_v" DROP COLUMN IF EXISTS "version_contains_affiliate_links";
    ALTER TABLE "_articles_v" DROP COLUMN IF EXISTS "version_last_reviewed";
    ALTER TABLE "_articles_v" DROP COLUMN IF EXISTS "version_content_type";
    DROP TABLE IF EXISTS "articles_sources";
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "contains_affiliate_links";
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "last_reviewed";
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "content_type";
  `)
}
