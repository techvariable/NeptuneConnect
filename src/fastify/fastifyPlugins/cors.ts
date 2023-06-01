import fp from 'fastify-plugin'
import cors, { type FastifyCorsOptions } from '@fastify/cors'

export default fp<FastifyCorsOptions>(async (fastify) => {
  // This is NOT recommended for production as it enables reflection exploits
  await fastify.register(cors, { origin: true })
})
