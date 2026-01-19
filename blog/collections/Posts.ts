import { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedDate', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Public can read published posts
      if (!user) {
        return {
          status: { equals: 'published' },
        }
      }
      // Admin can read all
      return true
    },
    create: () => true, // Admin only (controlled by auth)
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 200,
      admin: {
        description: 'Short summary of the post (200 characters max)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Main image for the post',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    // SEO Group
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          maxLength: 60,
          admin: {
            description: 'Custom meta title (60 characters max). Defaults to post title.',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          maxLength: 160,
          admin: {
            description: 'Custom meta description (160 characters max). Defaults to excerpt.',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Custom Open Graph image. Defaults to featured image.',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Trigger ISR revalidation when post is published or updated
        if (operation === 'update' && doc.status === 'published') {
          const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
          const revalidateSecret = process.env.REVALIDATE_SECRET

          if (revalidateSecret) {
            try {
              // Revalidate homepage
              await fetch(`${serverUrl}/api/revalidate?secret=${revalidateSecret}&path=/`)
              // Revalidate post page
              await fetch(`${serverUrl}/api/revalidate?secret=${revalidateSecret}&path=/posts/${doc.slug}`)
            } catch (err) {
              console.error('Revalidation failed:', err)
            }
          }
        }
      },
    ],
  },
}
