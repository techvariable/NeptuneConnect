import fp from 'fastify-plugin'
import swaggerUI, { type FastifySwaggerUiOptions } from '@fastify/swagger-ui'

export default fp<FastifySwaggerUiOptions>(async (fastify) => {
  console.log(process.env.SWAGGER_ENABLED === '1', process.env.SWAGGER_ROUTE)
  if (process.env.SWAGGER_ENABLED === '1') {
    await fastify.register(swaggerUI, {
      routePrefix: process.env.SWAGGER_ROUTE
    })
  }
})
