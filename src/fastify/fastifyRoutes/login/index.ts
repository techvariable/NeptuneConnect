import { type FastifyPluginAsync } from 'fastify'
import fastifyPassport from '@fastify/passport'

const login: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        hide: true
      }
    },
    fastifyPassport.authenticate(
      'local',
      {
        successRedirect: '/',
        failureRedirect: '/login?error=login-failed',
        failureMessage: true
      })
  )

  fastify.get<{ Querystring: { error?: string } }>(
    '/',
    {
      schema: {
        hide: true
      }
    },
    async function (request, reply) {
      const error = request.query.error
      if (request.isAuthenticated()) return await reply.redirect('/')

      return await reply.view('/view/login.ejs', { error })
    }
  )
}

export default login
