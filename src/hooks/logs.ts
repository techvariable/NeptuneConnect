import { type Static, Type } from '@sinclair/typebox'
import { type FastifyInstance, type FastifyRequest, type FastifyReply } from 'fastify'

import { storeFileToLocalFilesystem, storeFileToS3 } from '../utils/store'
import {
  type TQueryBuilderRequest,
  type TNodeLabelRequest,
  type TLogs
} from '../ts/types/editor.type'

export const RawQuerySchema = Type.Object({
  query: Type.String(),
  parameters: Type.Optional(Type.Object({}))
})

export type RawQueryRequestType = Static<typeof RawQuerySchema>

export function generateRawQueryLog (fastify: FastifyInstance) {
  return async function (
    request: FastifyRequest<{ Body: RawQueryRequestType }>,
    reply: FastifyReply,
    payload: any
  ) {
    if (reply.statusCode === 200) {
      const parsedJson: any = JSON.parse(payload)

      const fileName: string =
        process.env.LOG_STORAGE_PROVIDER === 's3'
          ? await storeFileToS3(JSON.stringify(parsedJson.result))
          : await storeFileToLocalFilesystem(JSON.stringify(parsedJson.result))

      const newLogsParameters: TLogs = {
        queryText: request.body.query,
        queryParameter: JSON.stringify(request.body.parameters),
        queryResult: fileName,
        queryStatus: 200,
        isCustomQuery: true,
        timeTaken: parsedJson.timeTaken,
        ownerId: request.user?.id ?? request.apiKeyUser.id
      }

      void fastify.addNewLog(newLogsParameters)
    }
  }
}

export function generateBuilderQueryLog (fastify: FastifyInstance) {
  return async function (
    request: FastifyRequest<{
      Params: TNodeLabelRequest
      Body: TQueryBuilderRequest
    }>,
    reply: FastifyReply,
    payload: any
  ) {
    if (reply.statusCode === 200) {
      const parsedJson: any = JSON.parse(payload)

      const fileName: string =
        process.env.LOG_STORAGE_PROVIDER === 's3'
          ? await storeFileToS3(JSON.stringify(parsedJson.nodes))
          : await storeFileToLocalFilesystem(JSON.stringify(parsedJson.nodes))

      const newLogsParameters: TLogs = {
        queryText: parsedJson.query,
        queryParameter: JSON.stringify(parsedJson.queryParameters),
        queryResult: fileName,
        queryStatus: 200,
        isCustomQuery: false,
        timeTaken: parsedJson.timeTaken,
        ownerId: request.user?.id ?? request.apiKeyUser.id
      }

      void fastify.addNewLog(newLogsParameters)
    }
  }
}
