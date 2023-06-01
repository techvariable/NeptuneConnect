import fastify from 'fastify'
import app from './app'
import 'dotenv/config'

// Instantiate Fastify with some config
const server = fastify({
  logger: {
    transport:
      process.env.ENVIRONMENT === 'DEV'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname'
            }
          }
        : undefined
  }
})

// Register your application as a normal plugin.
void server.register(app)

// Start listening.
server.listen({ port: Number(process.env.PORT ?? 5500), host: '0.0.0.0' }, async (err, address) => {
  if (err != null) {
    server.log.error(err)
    process.exit(1)
  } else {
    server.log.info('Server running on' + address)
  }
})
