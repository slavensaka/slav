import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // Note: In production with R2, this will be overridden by cloud storage plugin
    staticDir: '../public/media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 432,
        position: 'centre',
      },
      {
        name: 'feature',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  },
  access: {
    read: () => true, // Public read
    create: () => true, // Admin only
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alternative text for the image (important for accessibility and SEO)',
      },
    },
  ],
}
