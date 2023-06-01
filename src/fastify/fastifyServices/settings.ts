import fp from 'fastify-plugin'
import uuidApiKey from 'uuid-apikey'

import { type Prisma, type APIKey } from '@prisma/client'

export default fp(async (fastify, opts) => {
  async function findApiKeyById (userId: number): Promise<{
    userId: number
    user: {
      name: string
    }
    apiKey: string
  } | null> {
    return await fastify.prisma.aPIKey.findUnique({
      where: {
        userId
      },
      select: {
        apiKey: true,
        userId: true,
        user: {
          select: {
            name: true
          }
        }
      }
    })
  }

  async function createKey (userId: number): Promise<APIKey | {
    apiKey: string
    userId: number
    user: {
      name: string
    }
  }> {
    const existingKey = await fastify.prisma.aPIKey.findUnique({
      where: {
        userId
      }
    })
    if (existingKey == null) {
      const key = uuidApiKey.create().apiKey
      return await fastify.prisma.aPIKey.create({
        data: {
          apiKey: key,
          userId
        },
        select: {
          apiKey: true,
          userId: true,
          user: {
            select: {
              name: true
            }
          }
        }
      })
    } else {
      return existingKey
    }
  }

  async function deleteKey (userId: number): Promise<Prisma.BatchPayload> {
    return await fastify.prisma.aPIKey.deleteMany({
      where: {
        userId
      }
    })
  }

  fastify.decorate('findApiKeyById', findApiKeyById)
  fastify.decorate('createKey', createKey)
  fastify.decorate('deleteKey', deleteKey)
})

declare module 'fastify' {
  export interface FastifyInstance {
    findApiKeyById: (userId: number) => any
    createKey: (userId: number) => any
    deleteKey: (userId: number) => any
  }
}
