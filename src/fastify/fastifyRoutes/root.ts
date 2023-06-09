import { type FastifyPluginAsync } from 'fastify'
import { checkRolePermission } from '../../hooks/roles'

const settings: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get(
    '/',
    {
      preValidation: fastify.auth([fastify.checkAuth]),
      preHandler: checkRolePermission({ name: 'editor', permission: 'read' }),
      schema: {
        hide: true
      }
    },
    async function (request, reply) {
      return await reply.view('/view/editor.ejs', { url: `${process.env.APP_URL}api/editor`, imgurl: `${process.env.APP_URL}`, user: JSON.stringify({ name: request.user?.name, email: request.user?.email }), permissions: request.user?.permissions, mode: process.env.MODE ?? 'prod' })
    }
  )
}

export default settings
