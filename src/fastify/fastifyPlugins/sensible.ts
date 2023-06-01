import fp from 'fastify-plugin'
import sensible, { type SensibleOptions } from '@fastify/sensible'

export default fp<SensibleOptions>(async (fastify) => {
  await fastify.register(sensible)
})
