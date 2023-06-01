import fp from 'fastify-plugin'
import formBody, { type FastifyFormbodyOptions } from '@fastify/formbody'

export default fp<FastifyFormbodyOptions>(async (fastify) => {
  await fastify.register(formBody)
})
