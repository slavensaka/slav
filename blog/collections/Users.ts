import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // Enables authentication
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Only allow first user to be created (single author blog)
    create: () => false, // Disable public registration
    read: () => true,
    update: () => true,
    delete: () => false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
