import {
  type FastifyPluginAsync,
  type FastifyRequest,
  type FastifyReply,
  type FastifyInstance
} from 'fastify'
import { navigators } from '../../../../constants/navigators'

import { checkRolePermission } from '../../../../hooks/roles'

const myprofile: FastifyPluginAsync = async (fastify: FastifyInstance, opts): Promise<void> => {
  fastify.get(
    '/',
    {
      preValidation: fastify.auth([fastify.checkAuth]),
      preHandler: checkRolePermission({ name: 'profile', permission: 'read' }),
      schema: {
        hide: true
      }
    },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const selectedNavigators = navigators
      selectedNavigators.forEach(item => { item.name === 'Profile' ? item.selected = true : item.selected = false })
      return await reply.view('/view/myprofile.ejs', {
        navigators: selectedNavigators,
        imgurl: `${process.env.APP_URL}`,
        url: `${process.env.APP_URL}`,
        user: JSON.stringify({ name: request.user?.name, email: request.user?.email }),
        permissions: request.user?.permissions,
        mode: process.env.MODE ?? 'prod'
      })
    }
  )
}

export default myprofile
