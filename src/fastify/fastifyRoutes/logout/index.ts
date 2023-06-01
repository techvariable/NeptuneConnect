import { type FastifyPluginAsync } from 'fastify'

const logout: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        hide: true
      }
    },
    async function (request, reply) {
      if (request.isAuthenticated()) await request.logOut()
      return await reply.redirect('/login')
    }
  )
}

export default logout
