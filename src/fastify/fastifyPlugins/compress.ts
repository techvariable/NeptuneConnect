import fp from 'fastify-plugin'
import compress, { type FastifyCompressOptions } from '@fastify/compress'

export default fp<FastifyCompressOptions>(async (fastify) => {
  await fastify.register(compress)
})
