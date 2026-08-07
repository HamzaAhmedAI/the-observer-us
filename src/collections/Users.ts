/* ============================================================
   Users — Admin authentication for the CMS
   ============================================================ */

import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'createdAt'],
    group: 'Admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
    },
  ],
}
