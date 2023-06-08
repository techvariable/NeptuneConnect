import { type FastifyPluginAsync, type FastifyRequest, type FastifyReply, type FastifyInstance } from 'fastify'

import { navigators } from '../../../../constants/navigators'
import { checkRolePermission } from '../../../../hooks/roles'

const settings: FastifyPluginAsync = async (fastify: FastifyInstance, opts): Promise<void> => {
  fastify.get(
    '/',
    {
      preValidation: fastify.auth([fastify.checkAuth]),
      preHandler: checkRolePermission({ name: 'settings', permission: 'read' }),
      schema: {
        hide: true
      }
    },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const selectedNavigators = navigators
      selectedNavigators.forEach(item => { item.name === 'API' ? item.selected = true : item.selected = false })
      return await reply.view('/view/apiKey.ejs', { navigators, url: `${process.env.APP_URL}api/settings`, imgurl: `${process.env.APP_URL}`, permissions: request.user?.permissions, user: JSON.stringify({ name: request.user?.name, email: request.user?.email }), mode: process.env.MODE })
    }
  )
}

export default settings
