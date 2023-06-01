import { type Static } from '@sinclair/typebox'

import { type SLogs, type SRawQuery, type SSNodeLabel, type SQueryLog, type SSaveQuery, type SSaveQueryId } from '../schemas/editor.schema'

export type TNodeLabelRequest = Static<typeof SSNodeLabel>
export type TRawQueryRequest = Static<typeof SRawQuery>
export type TLogsRequest = Static<typeof SLogs>
export type TQueryLog = Static<typeof SQueryLog>
export type TSaveQuery = Static<typeof SSaveQuery>
export type TSaveQueryId = Static<typeof SSaveQueryId>
export interface TQueryParameters {
  paramNodeLabel: string
  paramPaginationLimit: number
  paramPaginationOffset: number
  [index: string]: number | string
}

export type TQueryMode = 'insert' | 'update' | 'delete' | 'read'

export interface TInsertQueryRequest {
  label: string
  properties: Record<string, string | number | Date>
}
export interface TUpdateQueryBuilderRequest {
  updateId: number | string
  changes: Record<string, string | number>
}

export interface TDeleteQueryBuilderRequest {
  deleteId: number | string
}

export interface TReadQueryBuilderRequest {
  showMeta: boolean
  limit: number
  offset: number
  order: Record<string, 'asc' | 'desc'>
  filter: Record<string, { contains?: string, exact?: string, gte?: number, lte?: number, lt?: number, gt?: number, not?: string | number }>
}

export interface TQueryBuilderRequest {
  update?: TUpdateQueryBuilderRequest
  read?: TReadQueryBuilderRequest
  delete?: TDeleteQueryBuilderRequest
  insert?: TInsertQueryRequest
}

export interface TReadQueryParamters {
  paramNodeLabel: string
  paramPaginationLimit: number
  paramPaginationOffset: number
  [index: string]: number | string
}

export interface TUpdateQueryParamters {
  paramId: number | string
  [index: string]: number | string
}

export interface TInsertQueryParameters {
  paramLabel: string
  [index: string]: number | string | Date
}

export interface TQueryReq {
  query: string
  apiKey: string
  parameters: TGroovyParamters
}

export type TGroovyParamters = Record<string, number | string | boolean>

export interface TLogs {
  id?: number
  queryText: string
  queryParameter: string
  queryResult: string
  queryStatus: number
  isCustomQuery: boolean
  timeOfExecution?: Date
  timeTaken: number
  ownerId: number
}

export interface TAddLog {
  queryText: string
}

export interface TGetLogsRequest {
  limit: number
  offset: number
  sort?: 'ownerId' | 'queryResult' | 'queryStatus' | 'queryText' | 'timeOfExecution' | 'timeTaken'
  order?: 'desc' | 'asc'
  filter_queryText?: string
  filter_queryStatus?: number
  filter_ownerId?: number
}

export interface TPrismaQuerySearch {
  skip: number
  take: number
  orderBy?: any
  where?: any
  include?: any
}

export interface TPrismaQuerySearchCount {
  orderBy?: any
  where?: any
}

export interface TGetLogsFilter {
  queryText?: string
  queryStatus?: number
  ownerId?: number
}

export interface TLogsRequestTypeAll {
  filter_queryText?: string
  filter_queryStatus?: number
  filter_ownerId?: number
}
