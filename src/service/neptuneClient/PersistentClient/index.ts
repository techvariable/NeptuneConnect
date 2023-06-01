import * as gremlin from 'gremlin'
import { type INeptuneClientPersistent } from './interface'
import { getConnectionDetails, type GroovyStatement } from '../index'
import { retryGroovyQuery, getFormattedGroovyStatement, ParseNeptuneOutput } from '../utils'

const RemoteClient = gremlin.driver.Client

/**
 * A Class Based Implementation of NeptuneClient that allows multiple queries to be
 * executed in a single session/transaction. It improves upon NeptuneClient and NeptuneClientGroovy
 * by letting you perform multiple queries with a single connection, thus reducing the number of times
 * a WebSocket connection is opened to NeptuneDB and potentially minimizing the risk of running out of Sockets
 * and Overwhelming the DB.
 *
 * The Client is implemented on a Singleton Pattern and cannot be accessed by creating a new instance.
 * To get an instance of the NeptuneClientPersistent Class, call the static getInstance() method
 *
 * @example
 * ```ts
 *  import {NeptuneClientPersistent} from 'clients/Neptune';
 *
 *  const NeptuneClient = NeptuneClientPersistent.getInstance()
 * ```
 */
export class NeptuneClientPersistent implements INeptuneClientPersistent {
  private static instance: NeptuneClientPersistent | null = null
  client: gremlin.driver.Client | null = null
  maxRetries = 5

  private getClient (): gremlin.driver.Client {
    const { url, headers } = getConnectionDetails()
    const client = new RemoteClient(url, {
      traversalSource: 'g',
      headers
    })

    return client
  }

  private constructor (maxRetries?: number) {
    if ((maxRetries != null)) this.maxRetries = maxRetries
    this.client = this.getClient()
  }

  /**
   *
   * @param maxRetries A setting that specifies the maximum number of times a query should be retried in case of failure. This is used only if the numRetries param
   * is not passed to the query method
   * @returns An Instance of NeptuneClientPersistent
   */
  static getInstance (maxRetries?: number): NeptuneClientPersistent {
    if (this.instance == null) {
      this.instance = new NeptuneClientPersistent(maxRetries)
      return this.instance
    } else return this.instance
  }

  /**
   * Tries to open a WebSocket connection to NeptuneDB and dispose the existing WebSocket in use, if any
   * @returns void
   */
  async open (): Promise<void> {
    if (this.client != null) await this.client.open()
    else {
      console.warn(
        'Cannot open connection to Neptune DB! The Neptune Client has not been instantiated.'
      )
    }
  }

  /**
   * Tries to close a WebSocket connection to NeptuneDB and dispose the existing WebSocket in use, if any
   * @returns void
   */
  async close (): Promise<void> {
    if (this.client != null) await this.client.close()
    else {
      console.warn(
        'Cannot close connection to Neptune DB! The Neptune Client has not been instantiated.'
      )
    }
  }

  /**
   *
   * @param param0
   * @param param0.groovy Gremlin Query in a groovy string
   * @param param0.parameters parameters to be injected in the gremlin query
   * @param numRetries number of times the query should be retried in case of failure. Overrides the maxRetries param passed to the constructor during initialization, if specified.
   * @returns Result of the Gremlin Query.
   * @example
   * ```ts
   *  const data = await NeptuneClient.query<{name: string, ssn: string}>({
   *      groovy: `g.V().hasLabel('Person').has('name',containing(:name_filter)).valueMap('name','ssn')`,
   *      parameters: {name_filter: 'ar'}
   *  })
   * ```
   */
  async query<T = any>({ groovy, parameters }: GroovyStatement, numRetries?: number): Promise<T[]> {
    if (this.client == null) throw new Error("NeptuneClient is not initialzed, Can't query NeptuneDB!")
    try {
      let statement = groovy
      if (parameters != null) statement = getFormattedGroovyStatement(statement, parameters)
      const returnedData = (await retryGroovyQuery(
        this.client,
        statement,
        numRetries ?? this.maxRetries,
        false
      )) as { _items: any[] }
      return ParseNeptuneOutput<T>(returnedData)
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (this.client) await this.close()
      this.client = this.getClient()
      const err = e as any
      throw new Error(err?.message ?? 'Failed to execute the query')
    }
  }
}
