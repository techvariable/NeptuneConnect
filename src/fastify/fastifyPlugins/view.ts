import fp from 'fastify-plugin'
import view, { type FastifyViewOptions } from '@fastify/view'
import * as ejs from 'ejs'

export default fp<FastifyViewOptions>(async (fastify) => {
  await fastify.register(view, { engine: { ejs } })
})
