import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Import collections
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',

  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' - Slav.hr Blog',
      favicon: '/favicon.ico',
    },
  },

  collections: [
    Posts,
    Categories,
    Tags,
    Media,
    Users,
  ],

  editor: lexicalEditor({}),

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  sharp,

  // Plugin for cloud storage will be added when R2 is configured
  // plugins: [...],
})
