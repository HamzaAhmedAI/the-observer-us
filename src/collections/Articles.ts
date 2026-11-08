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
      name: 'contentType',
      type: 'select',
      label: 'Content Type',
      defaultValue: 'news-hook',
      options: [
        { label: 'Evergreen hub — action guide, updated over time', value: 'evergreen-hub' },
        { label: 'News hook — one event, links into a hub', value: 'news-hook' },
        { label: 'Tool / comparison guide — quote, checklist or calculator page', value: 'tool-guide' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Home & Wallet mix: 40% evergreen hubs, 40% news hooks, 20% tool guides.',
      },
    },
    {
      name: 'sources',
      type: 'array',
      label: 'Sources (official, linked)',
      maxRows: 8,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Source name',
          required: true,
          admin: { description: 'e.g. "FTC — Get a credit freeze"' },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Source URL',
          required: true,
        },
      ],
      admin: {
        description:
          'Every factual claim should trace to one of these. Link the official source, never a rewrite of it.',
      },
    },
    {
      name: 'lastReviewed',
      type: 'date',
      label: 'Last Reviewed',
      admin: {
        position: 'sidebar',
        description:
          'Date this guide was last checked against its official sources. Shown on evergreen hubs.',
      },
    },
    {
      name: 'containsAffiliateLinks',
      type: 'checkbox',
      label: 'Contains affiliate links',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Tick this if any link on the page is an affiliate link — a disclosure line is shown to readers.',
      },
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
      name: 'viewCount',
      type: 'number',
      label: 'View Count',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Total page views. Auto-incremented by /api/track.',
        readOnly: false,
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
