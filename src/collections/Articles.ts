/* ============================================================
   Articles — News articles (core CMS content)
   Matches src/types/article.ts Article interface.
   ============================================================ */

import type { CollectionConfig } from 'payload'

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'category', 'publishedAt', 'isFeatured', 'isBreaking'],
    listSearchableFields: ['title', 'excerpt', 'tags'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Headline',
      required: true,
      admin: {
        description: 'The article headline as it appears on the site.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => value || (data?.title ? slugify(data.title) : undefined),
        ],
      },
      admin: {
        description: 'URL segment. Auto-generated from headline if left empty.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt',
      admin: {
        description: 'Short summary shown on cards and in meta descriptions.',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Content (HTML)',
      required: true,
      admin: {
        description: 'Full article body. Supports HTML (p, h2, h3, blockquote, ul, li, a, img, figure, strong, em).',
        className: 'field--textarea-full',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
      required: true,
      admin: {
        description: 'Lead image. Recommended 1200×675 (16:9).',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Category',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      label: 'Author',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      maxRows: 10,
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Tag',
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Published At',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
    },
    {
      name: 'isBreaking',
      type: 'checkbox',
      label: 'Breaking News',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured (hero slot)',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'readTime',
      type: 'number',
      label: 'Read Time (minutes)',
      min: 1,
      max: 60,
      hooks: {
        beforeValidate: [
          ({ value, data }) =>
            value ??
            (data?.content
              ? Math.max(1, Math.round(data.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length / 200))
              : 3),
        ],
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'SEO Title',
          admin: {
            description: 'Defaults to headline if empty.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'OG Image (1200×630)',
        },
        {
          name: 'canonical',
          type: 'text',
          label: 'Canonical URL',
        },
        {
          name: 'noindex',
          type: 'checkbox',
          label: 'Noindex (hide from search engines)',
          defaultValue: false,
        },
      ],
    },
  ],
}
