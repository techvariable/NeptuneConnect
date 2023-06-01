import path from 'path'
import fp from 'fastify-plugin'
import staticFiles, { type FastifyStaticOptions } from '@fastify/static'

export default fp<FastifyStaticOptions>(async (fastify) => {
  await fastify.register(staticFiles, {
    root: path.join(process.cwd(), 'view'),
    prefix: '/public/' // optional: default '/'
  })
})
