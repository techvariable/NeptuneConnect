import {
  type FastifyPluginAsync,
  type FastifyRequest,
  type FastifyReply,
  type FastifyInstance
} from 'fastify'
import { navigators } from '../../../../constants/navigators'

import { checkRolePermission } from '../../../../hooks/roles'

const permissions: FastifyPluginAsync = async (fastify: FastifyInstance, opts): Promise<void> => {
  fastify.get(
    '/',
    {
      preValidation: fastify.auth([fastify.checkAuth]),
      preHandler: checkRolePermission({ name: 'permissions', permission: 'read' }),
      schema: {
        hide: true
      }
    },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const selectedNavigators = navigators
      selectedNavigators.forEach(item => {
        item.name === 'Permissions' ? item.selected = true : item.selected = false
      })
      return await reply.view('/view/permissions.ejs', {
        navigators: selectedNavigators,
        url: `${process.env.APP_URL}api/permissions`,
        imgurl: `${process.env.APP_URL}`,
        user: JSON.stringify({ name: request.user?.name, email: request.user?.email }),
        permissions: request.user?.permissions
      })
    }
  )
}

export default permissions
