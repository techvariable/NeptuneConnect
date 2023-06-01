import { type FastifyPluginAsync, type FastifyRequest, type FastifyReply, type FastifyInstance } from 'fastify'

import { type TUser } from '../../../../ts/types/other.type'
import { checkRolePermission } from '../../../../hooks/roles'

const settings: FastifyPluginAsync = async (fastify: FastifyInstance, opts): Promise<void> => {
  fastify.get(
    '/',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'settings', permission: 'read' }),
      schema: {
        tags: ['Settings'],
        summary: 'Shows all API keys for the specific user'
      }
    },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const user: TUser = {
        // @ts-expect-error request.user.id is not getting type
        id: request.user.id
      }
      try {
        const respond = await fastify.findApiKeyById(user.id)
        return respond
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )

  fastify.post(
    '/',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'settings', permission: 'write' }),
      schema: {
        tags: ['Settings'],
        summary: 'Create API key for the specific user'
      }
    },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const user: TUser = {
        // @ts-expect-error request.user.id is not getting type
        id: request.user.id
      }
      try {
        const respond = await fastify.createKey(user.id)
        return await reply.code(201).send(respond)
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )

  fastify.delete(
    '/',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'settings', permission: 'delete' }),
      schema: {
        tags: ['Settings'],
        summary: 'Delete API keys for the specific user'
      }
    },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const user: TUser = {
        // @ts-expect-error request.user.id is not getting type
        id: request.user.id
      }
      try {
        const id = user.id
        await fastify.deleteKey(id)
        return await reply.code(204).send()
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )
}

export default settings
