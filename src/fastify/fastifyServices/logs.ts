import fp from 'fastify-plugin'

import { type QueryLog } from '@prisma/client'
import {
  type TLogsRequestTypeAll,
  type TGetLogsFilter,
  type TLogs,
  type TPrismaQuerySearch,
  type TPrismaQuerySearchCount,
  type TLogsRequest
} from '../../ts/types/editor.type'

export default fp(async (fastify, opts) => {
  async function getQueryFilter (key: string, val: string): Promise<string | number | {
    contains: string
  } | null> {
    switch (key) {
      case 'queryText':
        return {
          contains: val
        }
      case 'queryStatus':
        return parseInt(val)
      case 'email':
        // eslint-disable-next-line no-case-declarations
        const users = await fastify.prisma.user.findMany({
          select: {
            id: true
          },
          where: {
            email: {
              contains: val
            }
          }
        })
        return users.length > 0 ? users[0].id : null
      default:
        return val
    }
  }

  async function getSearchQuery (query: TLogsRequest): Promise<TPrismaQuerySearch> {
    const keyMapper = {
      email: 'ownerId'
    }

    const searchQuery: TPrismaQuerySearch = {
      skip: query.offset,
      take: query.limit
    }
    const filterQuery: TGetLogsFilter = {}

    if (query.sort != null) {
      const orderBy: any = {}
      orderBy[query.sort] = query.order

      searchQuery.orderBy = [orderBy]
    }

    for (let i = 0; i < Object.keys(query).length; i++) {
      const q = Object.keys(query)[i]

      if ((q.length > 0) && q.match(/filter_([a-zA-z0-9]+)/g) != null) {
        const key: string = q.slice(7)
        // @ts-expect-error
        filterQuery[keyMapper[key] != null || keyMapper[key] !== undefined ? keyMapper[key] : key] = await getQueryFilter(key, query[q])
      }
    }

    if (Object.keys(filterQuery).length > 0) {
      searchQuery.where = filterQuery
    }
    searchQuery.include = {
      user: {
        select: {
          email: true
        }
      }
    }
    return searchQuery
  }

  async function getTotalSearchQuery (query: TLogsRequestTypeAll): Promise<TPrismaQuerySearchCount> {
    const searchQuery: TPrismaQuerySearchCount = {}

    const filterQuery: TGetLogsFilter = {}
    Object.keys(query).forEach(async function (q) {
      if ((q.length > 0) && q.match(/filter_([a-zA-z0-9]+)/g) != null) {
        const key: string = q.slice(7)
        // @ts-expect-error
        filterQuery[key] = await getQueryFilter(key, query[q])
      }
    })

    if (Object.keys(filterQuery).length > 0) {
      searchQuery.where = filterQuery
    }
    return searchQuery
  }

  async function getTotalLogs (query: TLogsRequestTypeAll): Promise<number> {
    return await fastify.prisma.queryLog.count(await getTotalSearchQuery(query))
  }
  async function getQueryLogs (query: TLogsRequest): Promise<TLogs[]> {
    const data = await fastify.prisma.queryLog.findMany(await getSearchQuery(query))

    return data.map((item) => {
      // @ts-expect-error
      const email = item.user.email
      // @ts-expect-error
      delete item.user

      return {
        ...item,
        email
      }
    })
  }

  async function addNewLog (data: TLogs): Promise<QueryLog> {
    return await fastify.prisma.queryLog.create({
      data: {
        queryText: data.queryText,
        queryParameter: data.queryParameter,
        queryResult: data.queryResult,
        queryStatus: data.queryStatus,
        isCustomQuery: data.isCustomQuery,
        timeTaken: data.timeTaken,
        ownerId: data.ownerId
      }
    })
  }

  fastify.decorate('getQueryLogs', getQueryLogs)
  fastify.decorate('addNewLog', addNewLog)
  fastify.decorate('getTotalLogs', getTotalLogs)
})

declare module 'fastify' {
  export interface FastifyInstance {
    getQueryLogs: (query: TLogsRequest) => Promise<TLogs[]>
    getTotalLogs: (query: TLogsRequestTypeAll) => Promise<number>
    addNewLog: (data: TLogs) => Promise<QueryLog>
  }
}
