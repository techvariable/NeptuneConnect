// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function errorToObject (err: any) {
  try {
    if (typeof err !== 'object') return null
    if (Object.getOwnPropertyNames(err).includes('message')) {
      return JSON.parse(err.message).statusMessage
    } else JSON.parse(JSON.stringify(err))
  } catch (err) {
    return {
      error: 'Failed to execute the query'
    }
  }
}
