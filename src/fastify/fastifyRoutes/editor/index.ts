import { type FastifyPluginAsync } from 'fastify'
import { checkRolePermission } from '../../../hooks/roles'
import { SQueryLog } from '../../../ts/schemas/editor.schema'
import { type TQueryLog } from '../../../ts/types/editor.type'
import { getFileFromS3, getFileFromLocal } from '../../../utils/store'

const settings: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{
    Params: TQueryLog
  }>(
    '/query/logs/:key',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'logs', permission: 'read' }),
      schema: {
        tags: ['Editor'],
        summary: 'Shows result for query logs',
        params: SQueryLog
      }
    },
    async function (request, reply) {
      try {
        const key = request.params.key
        const storageType = process.env.LOG_STORAGE_PROVIDER ?? 's3'
        if (storageType === 's3') { return await getFileFromS3(key) }
        return await getFileFromLocal(key)
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )
}

export default settings
