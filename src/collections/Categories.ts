/* ============================================================
   Categories — News sections (politics, tech, business, ...)
   ============================================================ */

import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'slug', 'color'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL segment, e.g. "technology" → /technology',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'color',
      type: 'text',
      label: 'Accent Color',
      admin: {
        description: 'Hex color used in UI accents, e.g. #2563eb',
      },
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        if (!doc?.id) return doc
        const { totalDocs } = await req.payload.count({
          collection: 'articles',
          where: { 'category.value': { equals: doc.id } },
        })
        return { ...doc, articleCount: totalDocs }
      },
    ],
  },
}
