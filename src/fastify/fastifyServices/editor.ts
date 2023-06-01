import fp from 'fastify-plugin'
import { type SaveQuery } from '@prisma/client'

import { type TQueryBuilderRequest, type TQueryParameters, type TReadQueryBuilderRequest, type TReadQueryParamters, type TUpdateQueryBuilderRequest, type TUpdateQueryParamters, type TDeleteQueryBuilderRequest, type TQueryMode, type TInsertQueryRequest, type TInsertQueryParameters } from '../../ts/types/editor.type'

export default fp(async (fastify, opts) => {
  function generateParamName(section: string, key: string, withColon: boolean = true): string {
    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1)
    const formattedSection = section.charAt(0).toUpperCase() + section.slice(1)

    return withColon ? `:param${formattedSection}${formattedKey}` : `param${formattedSection}${formattedKey}`
  }

  function readQueryBuilder(nodeName: string, parameters: TReadQueryBuilderRequest): { query: string, countQuery: string, queryParameters: TReadQueryParamters } {
    let [sortingQuery, filterQuery] = ['', '']
    const queryParameters: TReadQueryParamters = {
      paramNodeLabel: nodeName,
      paramPaginationLimit: parameters.limit + parameters.offset,
      paramPaginationOffset: parameters.offset
    }

    if (Object.keys(parameters.order).length > 0) {
      const sort = parameters.order

      sortingQuery =
        '.order()' +
        Object.keys(sort)
          .map((k: string, index: number) => {
            queryParameters[generateParamName('sorting', `${k}_${index}`, false)] = k
            queryParameters[generateParamName('sorting', `Sort${k}By_${index}`, false)] = sort[k]

            return `.by(${generateParamName('sorting', `${k}_${index}`)}, ${sort[k]})`
          })
          .join('')
    }

    if (Object.keys(parameters.filter).length > 0) {
      const filter = parameters.filter

      filterQuery = Object.keys(filter)
        .map((k: string, index: number) => {
          const filterBy = filter[k]
          const filterKeyName = `${k}_${index}`
          const filterValueName = `${k}By_${index}`

          queryParameters[generateParamName('filter', filterKeyName, false)] = k

          if (filterBy.exact != null) {
            queryParameters[generateParamName('filter', filterValueName, false)] = filterBy.exact

            return `.has(${generateParamName('filter', filterKeyName)}, ${generateParamName('filter', filterValueName)})`
          }

          if (filterBy.not != null) {
            queryParameters[generateParamName('filter', filterValueName, false)] = filterBy.not

            return `.not(has(${generateParamName('filter', filterKeyName)}, ${generateParamName('filter', filterValueName)}))`
          }

          if (filterBy.contains != null) {
            queryParameters[generateParamName('filter', filterValueName, false)] = filterBy.contains

            return `.has(${generateParamName('filter', filterKeyName)}, TextP.containing(${generateParamName('filter', filterValueName)}))`
          }

          if (filterBy.gt != null) {
            queryParameters[generateParamName('filter', filterValueName, false)] = filterBy.gt

            return `.has(${generateParamName('filter', filterKeyName)}, gt(${generateParamName('filter', filterValueName)}))`
          }

          if (filterBy.lt != null) {
            queryParameters[generateParamName('filter', filterValueName, false)] = filterBy.lt

            return `.has(${generateParamName('filter', filterKeyName)}, lt(${generateParamName('filter', filterValueName)}))`
          }

          if (filterBy.gte != null) {
            queryParameters[generateParamName('filter', filterValueName, false)] = filterBy.gte

            return `.has(${generateParamName('filter', filterKeyName)}, gte(${generateParamName('filter', filterValueName)}))`
          }

          if (filterBy.lte != null) {
            queryParameters[generateParamName('filter', filterValueName, false)] = filterBy.lte

            return `.has(${generateParamName('filter', filterKeyName)}, lte(${generateParamName('filter', filterValueName)}))`
          }

          throw Error('Provided filter is not valid')
        })
        .join('')
    }

    const pagination: string = `.range(${generateParamName('pagination', 'offset')}, ${generateParamName('pagination', 'limit')})`

    return {
      query: `g.V().hasLabel(:paramNodeLabel)${filterQuery}${sortingQuery}${pagination}.valueMap(${parameters.showMeta ? 'true' : ''})`,
      countQuery: `g.V().hasLabel(:paramNodeLabel)${filterQuery}.count()`,
      queryParameters
    }
  }

  function updateQueryBuilder(parameters: TUpdateQueryBuilderRequest): { query: string, queryParameters: TUpdateQueryParamters } {
    let changeQuery = ''
    const queryParameters: TUpdateQueryParamters = {
      paramId: parameters.updateId
    }

    if (Object.keys(parameters.changes).length > 0) {
      Object.keys(parameters.changes).forEach((ch, index) => {
        const updateKey = `${ch}_${index}`
        const updateValue = `${ch}By_${index}`

        queryParameters[generateParamName('update', updateKey, false)] = ch
        queryParameters[generateParamName('update', updateValue, false)] = parameters.changes[ch]

        changeQuery += `.property(Cardinality.single, ${generateParamName('update', updateKey)}, ${generateParamName('update', updateValue)})`
      })
    }

    return {
      query: `g.V(:paramId)${changeQuery}.valueMap(true)`,
      queryParameters
    }
  }

  function deleteQueryBuilder(parameters: TDeleteQueryBuilderRequest): {
    query: string
    queryParameters: {
      paramId: string | number
    }
  } {
    return {
      query: 'g.V(:paramId).drop()',
      queryParameters: { paramId: parameters.deleteId }
    }
  }

  function insertQueryBuilder(parameters: TInsertQueryRequest): { query: string, queryParameters: TInsertQueryParameters } {
    const queryParameters: TInsertQueryParameters = {
      paramLabel: parameters.label
    }

    let insertQuery = ''

    Object.keys(parameters.properties).forEach((property, index) => {
      const insertKey = `${property}_${index}`
      const insertValue = `${property}By_${index}`

      queryParameters[generateParamName('insert', insertKey, false)] = property
      queryParameters[generateParamName('insert', insertValue, false)] = parameters.properties[property]

      insertQuery += `.property(${generateParamName('insert', insertKey)}, ${generateParamName('insert', insertValue)})`
    })

    return {
      query: `g.addV(:paramLabel)${insertQuery}`,
      queryParameters
    }
  }

  function queryBuilder(mode: TQueryMode, nodeName: string, parameters: TQueryBuilderRequest): { query: string, countQuery?: string, queryParameters: TUpdateQueryParamters | TReadQueryParamters | TInsertQueryParameters } {
    if (mode === 'read' && (parameters.read != null)) return readQueryBuilder(nodeName, parameters.read)
    if (mode === 'update' && (parameters.update != null)) return updateQueryBuilder(parameters.update)
    if (mode === 'delete' && (parameters.delete != null)) return deleteQueryBuilder(parameters.delete)
    if (mode === 'insert' && (parameters.insert != null)) return insertQueryBuilder(parameters.insert)

    throw Error('Invalid mode')
  }

  async function getSavedQueries(userId: number): Promise<SaveQuery[]> {
    return await fastify.prisma.saveQuery.findMany({
      where: {
        ownerId: userId
      }
    })
  }

  async function saveNewQuery(userId: number, queryTitle: string, queryText: string, queryParameter: string): Promise<SaveQuery> {
    return await fastify.prisma.saveQuery.create({
      data: {
        queryTitle, queryText, queryParameter, ownerId: userId
      }
    })
  }

  async function deleteSavedQuery(queryId: number): Promise<SaveQuery> {
    return await fastify.prisma.saveQuery.delete({
      where: {
        id: queryId
      }
    })
  }

  fastify.decorate('queryBuilder', queryBuilder)
  fastify.decorate('getSavedQueries', getSavedQueries)
  fastify.decorate('saveNewQuery', saveNewQuery)
  fastify.decorate('deleteSavedQuery', deleteSavedQuery)
})

declare module 'fastify' {
  export interface FastifyInstance {
    queryBuilder: (mode: TQueryMode, nodeName: string, parameters: TQueryBuilderRequest) => { query: string, countQuery?: string, queryParameters: TQueryParameters }
    getSavedQueries: (userId: number) => Promise<SaveQuery[]>
    saveNewQuery: (userId: number, queryTitle: string, queryText: string, queryParameter: string) => Promise<SaveQuery>
    deleteSavedQuery: (queryId: number) => Promise<SaveQuery>
  }
}
