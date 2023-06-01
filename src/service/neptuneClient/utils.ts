import type * as gremlin from 'gremlin'

import { ES6MapToObject } from '../../utils/es6Helpers'
import { getRandomNumberBetween } from '../../utils/random'
import { timeout } from '../../utils/timers'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function retryQuery (
  connection: gremlin.driver.DriverRemoteConnection,
  funcParams: { g: any, t: any },
  execFunction: (g: any, t: any) => Promise<any>,
  resolve: (value?: any) => void,
  reject: (reason?: any) => void,
  numRetry: number
) {
  execFunction(funcParams.g, funcParams.t)
    .then((value: any) => {
      void connection.close().then(() => { resolve(value) })
    })
    .catch((err: any) => {
      //   let errString = typeof err === 'object' ? JSON.stringify(err) : `${err}`;
      if (numRetry === 0) {
        void connection.close().then(() => {
          reject(err)
        })
      } else {
        const jitterTime = getRandomNumberBetween(50, 300)
        void timeout(jitterTime).then((val) => {
          retryQuery(connection, funcParams, execFunction, resolve, reject, numRetry - 1)
        })
      }
    })
}

export async function retryGroovyQuery (
  client: gremlin.driver.Client,
  groovy: string,
  numRetries: number,
  closeClient: boolean = true
): Promise<any> {
  try {
    const val = await client.submit(groovy)

    if (closeClient) await client.close()
    return val
  } catch (err) {
    if (numRetries === 0) {
      if (closeClient) await client.close()
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(typeof err === 'object' ? JSON.stringify(err) : `${err}`)
    } else {
      const jitterTime = getRandomNumberBetween(50, 300)
      await timeout(jitterTime)
      return await retryGroovyQuery(client, groovy, numRetries - 1)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getFormattedGroovyStatement (
  groovy: string,
  params: Record<string, number | string | boolean>
) {
  let groovyCopy = groovy
  Object.keys(params).forEach((key) => {
    const ps = paramToString(params[key])
    groovyCopy = groovyCopy.replace(
      new RegExp(`([(,]\\s*)(:${key})([)]|[,])`), `$1${ps}$3`
    )
  })
  return groovyCopy
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function paramToString (param: string | number | boolean) {
  if (typeof param === 'string') return `"${param}"`
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  else return `${param}`
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ParseNeptuneOutput<T = any> (val: { _items: any[] }) {
  const out = val._items.map((v) => {
    if (v instanceof Map) return ES6MapToObject(v)
    else return v
  })

  return out as T[]
}
