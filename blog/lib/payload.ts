import { getPayload as getPayloadInstance } from 'payload'
import config from '@/payload.config'

/**
 * Get Payload instance for server-side operations
 */
export const getPayload = async () => {
  return await getPayloadInstance({ config })
}
