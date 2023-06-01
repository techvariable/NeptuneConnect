import { join } from 'path'
import AutoLoad, { type AutoloadPluginOptions } from '@fastify/autoload'
import { type FastifyPluginAsync } from 'fastify'
import './env'
import seedDb from './service/seed'

export type AppOptions = object & Partial<AutoloadPluginOptions>

const options: AppOptions = {}

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  // plugins
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'fastify/fastifyPlugins'),
    options: opts
  })

  // services
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'fastify/fastifyServices'),
    options: opts
  })

  // routes
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'fastify/fastifyRoutes'),
    options: opts
  })

  fastify.addHook('onReady', async function () {
    await seedDb(fastify)
  })
}

export default app
export { app, options }
