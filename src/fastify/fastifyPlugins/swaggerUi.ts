import fp from 'fastify-plugin'
import swaggerUI, { type FastifySwaggerUiOptions } from '@fastify/swagger-ui'

export default fp<FastifySwaggerUiOptions>(async (fastify) => {
  await fastify.register(swaggerUI, {
    routePrefix: '/docs'
  })
})
