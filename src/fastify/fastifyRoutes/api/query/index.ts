import { type FastifyPluginAsync, type FastifyInstance } from 'fastify'

import { NeptuneClientPersistent } from '../../../../service/neptuneClient/PersistentClient/index'

import { errorToObject } from '../../../../utils/errors'

import { generateRawQueryLog } from '../../../../hooks/logs'

import { SHeaderAPIKey, SRawQuery } from '../../../../ts/schemas/editor.schema'
import { type TRawQueryRequest } from '../../../../ts/types/editor.type'

const query: FastifyPluginAsync = async (fastify: FastifyInstance, opts): Promise<void> => {
  const NeptuneClient = NeptuneClientPersistent.getInstance()

  fastify.post<{
    Body: TRawQueryRequest
  }>(
    '/api-key',
    {
      preValidation: fastify.auth([fastify.checkAPIKey]),
      onSend: [generateRawQueryLog(fastify)],
      schema: {
        tags: ['Query'],
        summary: 'Shows result for executed query',
        body: SRawQuery,
        headers: SHeaderAPIKey
      }
    },
    async function (request, reply) {
      try {
        const { query, parameters } = request.body

        const start = Date.now()
        const result: any = await NeptuneClient.query({
          groovy: query,
          parameters
        })
        const end = Date.now()
        return { timeTaken: end - start, result }
      } catch (err) {
        return await reply.code(400).send({ error: errorToObject(err) })
      }
    }
  )
}

export default query
