import { type FastifyPluginAsync, type FastifyInstance } from 'fastify'

import { NeptuneClientPersistent } from '../../../../service/neptuneClient/PersistentClient/index'

import { errorToObject } from '../../../../utils/errors'

import { checkRolePermission } from '../../../../hooks/roles'
import { generateBuilderQueryLog, generateRawQueryLog } from '../../../../hooks/logs'

import { SLogs, SQueryBuilder, SRawQuery, SSNodeLabel, SSaveQuery, SSaveQueryId } from '../../../../ts/schemas/editor.schema'
import {
  type TSaveQuery,
  type TLogsRequest,
  type TNodeLabelRequest,
  type TQueryBuilderRequest,
  type TRawQueryRequest,
  type TSaveQueryId
} from '../../../../ts/types/editor.type'

const editor: FastifyPluginAsync = async (fastify: FastifyInstance, opts): Promise<void> => {
  const NeptuneClient = NeptuneClientPersistent.getInstance()

  fastify.get(
    '/nodes',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'editor', permission: 'read' }),
      schema: {
        tags: ['Editor'],
        summary: 'Show all nodes exist in the database'
      }
    },
    async function (request, reply) {
      try {
        const query: string = 'g.V().label().dedup()'

        const result = await NeptuneClient.query({
          groovy: query,
          parameters: {}
        })

        return {
          nodes: result
        }
      } catch (err) {
        return await reply.code(400).send({ error: errorToObject(err) })
      }
    }
  )

  fastify.post<{
    Params: TNodeLabelRequest
    Body: TQueryBuilderRequest
  }>(
    '/query/builder/:nodeLabel/:mode',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'editor', permission: 'read' }),
      onSend: [generateBuilderQueryLog(fastify)],
      schema: {
        tags: ['Editor'],
        summary: 'Show all nodes exist in the database',
        body: SQueryBuilder,
        params: SSNodeLabel
      }
    },
    async function (request, reply) {
      try {
        const start = Date.now()
        const { query, countQuery, queryParameters } = fastify.queryBuilder(
          request.params.mode,
          request.params.nodeLabel,
          request.body
        )

        const result = await NeptuneClient.query({
          groovy: query,
          parameters: queryParameters
        })

        let count = 0
        if (typeof (countQuery) === 'string' && countQuery.length > 0) {
          const countResult = await NeptuneClient.query({
            groovy: countQuery,
            parameters: queryParameters
          })

          count = countResult?.length > 0 ? countResult[0] : 0
        } else count = result.length

        const end = Date.now()

        return {
          query,
          queryParameters,
          nodes: result,
          count,
          timeTaken: end - start
        }
      } catch (err) {
        return await reply.code(400).send({ error: errorToObject(err) })
      }
    }
  )

  fastify.post<{
    Params: TNodeLabelRequest
    Body: TQueryBuilderRequest
  }>(
    '/query/builder/:nodeLabel/:mode/preview',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'editor', permission: 'read' }),
      schema: {
        tags: ['Editor'],
        summary: 'Show all nodes exist in the database',
        body: SQueryBuilder,
        params: SSNodeLabel
      }
    },
    async function (request, reply) {
      try {
        const { query, queryParameters } = fastify.queryBuilder(
          request.params.mode,
          request.params.nodeLabel,
          request.body
        )

        console.log([query, queryParameters])

        return {
          query,
          queryParameters
        }
      } catch (err) {
        console.log({ err })
        return await reply.code(400).send({ error: errorToObject(err) })
      }
    }
  )

  fastify.post<{
    Body: TRawQueryRequest
  }>(
    '/query/',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'editor', permission: 'read' }),
      onSend: [generateRawQueryLog(fastify)],
      schema: {
        tags: ['Editor'],
        summary: 'Shows result for executed query',
        body: SRawQuery
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

  fastify.get<{
    Querystring: TLogsRequest
  }>(
    '/query/logs',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'logs', permission: 'read' }),
      schema: {
        tags: ['Editor'],
        summary: 'Shows result for query logs',
        querystring: SLogs
      }
    },
    async function (request, reply) {
      try {
        const logsQuery: TLogsRequest = request.query
        const respond = await fastify.getQueryLogs(logsQuery)
        const total = await fastify.getTotalLogs(logsQuery)
        return { respond, total }
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )

  fastify.get('/saved-queries', {
    preValidation: fastify.auth([fastify.checkAuthAPI]),
    preHandler: checkRolePermission({ name: 'editor', permission: 'read' }),
    schema: {
      tags: ['Editor'],
      summary: 'Shows all saved queries'
    }
  }, async function (request, reply) {
    try {
      return await fastify.getSavedQueries(request.user?.id ?? 1)
    } catch (error) {
      fastify.log.error(error)
      reply.internalServerError('Something went wrong with the server')
    }
  })

  fastify.post<{ Body: TSaveQuery }>('/saved-queries', {
    preValidation: fastify.auth([fastify.checkAuthAPI]),
    preHandler: checkRolePermission({ name: 'editor', permission: 'read' }),
    schema: {
      tags: ['Editor'],
      summary: 'Shows all saved queries',
      body: SSaveQuery
    }
  }, async function (request, reply) {
    try {
      return await fastify.saveNewQuery(request.user?.id ?? 1, request.body.queryTitle, request.body.queryText, request.body.queryParameter)
    } catch (error) {
      fastify.log.error(error)
      reply.internalServerError('Something went wrong with the server')
    }
  })

  fastify.delete<{ Params: TSaveQueryId }>('/saved-queries/:queryId', {
    preValidation: fastify.auth([fastify.checkAuthAPI]),
    preHandler: checkRolePermission({ name: 'editor', permission: 'read' }),
    schema: {
      tags: ['Editor'],
      summary: 'Shows all saved queries',
      params: SSaveQueryId
    }
  }, async function (request, reply) {
    try {
      return await fastify.deleteSavedQuery(request.params.queryId)
    } catch (error) {
      fastify.log.error(error)
      reply.internalServerError('Something went wrong with the server')
    }
  })
}

export default editor
