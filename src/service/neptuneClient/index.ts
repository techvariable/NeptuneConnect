import * as gremlin from 'gremlin'
import { getUrlAndHeaders } from './lib/utils'
import { retryQuery, retryGroovyQuery, getFormattedGroovyStatement } from './utils'
import { NeptuneClientPersistent } from './PersistentClient'
import { type INeptuneClientPersistent } from './PersistentClient/interface'

const { t } = gremlin.process
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection
const RemoteClient = gremlin.driver.Client

const neptuneEndpoint = process.env.NEPTUNE_ENDPOINT
const neptunePort = process.env.NEPTUNE_PORT
const useIAM = process.env.USE_IAM
const isDev = process.env.NODE_ENV === 'development'

const proto = isDev ? 'ws' : 'wss'

export function getConnectionDetails (): { url: string, headers: object } {
  if (useIAM === 'true') {
    return getUrlAndHeaders(neptuneEndpoint, neptunePort, {}, '/gremlin', proto)
  } else {
    const databaseURL = `${proto}://${neptuneEndpoint}:${neptunePort}/gremlin`
    return { url: databaseURL, headers: {} }
  }
}

function createRemoteConnection (): gremlin.driver.DriverRemoteConnection {
  const { url, headers } = getConnectionDetails()

  return new DriverRemoteConnection(url, {
    mimeType: 'application/vnd.gremlin-v2.0+json',
    headers
  })
}

/**
 *
 * @param execFunction
 * Callback function that recieves a graph traversal source and gremlin.process.t object
 * this method should perform a gremlin query and return the result that is expects to get from the NeptuneClient
 * @param maxRetry
 *  The maximum number of times the query is retried if the DB throws a timeout error
 * @example
 * await NeptuneClient(
 *      async(g,t) => {
 *          return g.V().hasLabel('Person').values('name').toList()
 *      },
 *      3
 * )
 * @returns
 * Result of the Gremlin Query
 */
export async function NeptuneClient (
  execFunction: (
    g: gremlin.process.GraphTraversalSource<gremlin.process.GraphTraversal>,
    t: {
      id: gremlin.process.EnumValue
      key: gremlin.process.EnumValue
      label: gremlin.process.EnumValue
      value: gremlin.process.EnumValue
    },
  ) => Promise<any>,
  maxRetry: number = 3
): Promise<any> {
  return await new Promise((resolve, reject) => {
    const connection = createRemoteConnection()
    const g = gremlin.process.AnonymousTraversalSource.traversal().withRemote(connection)
    retryQuery(connection, { g, t }, execFunction, resolve, reject, maxRetry)
  })
}

export type GroovyParamters = Record<string, number | string | boolean>

export interface GroovyStatement {
  /** Gremlin Query string that is groovy compatible */
  groovy: string
  /** Parameters to be replaced in the prepared statement with actual values */
  parameters?: GroovyParamters
}

/**
 * @description Executes a groovy statement string on NeptuneDB and returns the result
 * @param param0 The Groovy Statement to be executed on NeptuneDB
 * @param maxRetries The maximum number of times the query is retried if the DB throws a timeout error
 * @example
 * await NeptuneClientGroovy(
 *      {
 *          groovy: 'g.V().hasLabel(:label).values("name")',
 *          parameters: {label: 'Person'}
 *      },
 *      3
 * );
 * @returns Result of the Gremlin Query
 */
export async function NeptuneClientGroovy (
  { groovy, parameters }: GroovyStatement,
  maxRetries: number = 3
): Promise<any> {
  const { url, headers } = getConnectionDetails()
  const client = new RemoteClient(url, {
    traversalSource: 'g',
    headers
  })

  let groovyStatement = groovy
  if (parameters != null) groovyStatement = getFormattedGroovyStatement(groovy, parameters)

  return await retryGroovyQuery(client, groovyStatement, maxRetries)
}

export { NeptuneClientPersistent, type INeptuneClientPersistent }
