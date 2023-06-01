import fp from 'fastify-plugin'
import swagger, { type SwaggerOptions } from '@fastify/swagger'

export default fp<SwaggerOptions>(async (fastify) => {
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'NeptuneConnect',
        description: 'Boilerplate for fastify project',
        version: '0.1.0'
      },
      host: process.env.NODE_ENV === 'development' ? 'localhost:3000' : process.env.APP_URL,
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'User', description: 'User related APIs' },
        { name: 'Settings', description: 'Settings related APIs' },
        { name: 'Permissions', description: 'Permissions related APIs' },
        { name: 'Editor', description: 'Editor related APIs' }
      ]
    }
  })
})
