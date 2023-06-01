import { type FastifyPluginAsync, type FastifyRequest, type FastifyReply, type FastifyInstance } from 'fastify'
import { navigators } from '../../../constants/navigators'

const settings: FastifyPluginAsync = async (fastify: FastifyInstance, opts): Promise<void> => {
  fastify.get(
    '/',
    {
      preValidation: fastify.auth([fastify.checkAuth]),
      schema: {
        hide: true
      }
    },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const selectedNavigators = navigators
      selectedNavigators.forEach(item => { item.name === 'General' ? item.selected = true : item.selected = false })
      return await reply.view('/view/settings.ejs', { navigators: selectedNavigators, url: `${process.env.APP_URL}api/settings`, imgurl: `${process.env.APP_URL}`, user: JSON.stringify({ name: request.user?.name, email: request.user?.email }), permissions: request.user?.permissions })
    }
  )
}

export default settings
