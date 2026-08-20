/* ============================================================
   Media — Image uploads (local disk, self-hosted free)

   Uses Payload's built-in local upload (staticDir) so media is
   served from the app filesystem at /media/<file> on the Oracle VM.
   No Vercel Blob / external storage dependency.
   ============================================================ */

import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    group: 'Content',
    defaultColumns: ['alt', 'width', 'height', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  upload: {
    // Serve media as static files from public/media so Next.js image
    // optimization can process them (the default /api/media/file path is
    // rejected by Next's optimizer as a same-origin /api route).
    staticDir: 'public/media',
    imageSizes: [
      {
        name: 'card',
        width: 640,
        height: 360,
        position: 'centre',
      },
      {
        name: 'featured',
        width: 1200,
        height: 675,
        position: 'centre',
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
    adminThumbnail: 'card',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
  ],
}
