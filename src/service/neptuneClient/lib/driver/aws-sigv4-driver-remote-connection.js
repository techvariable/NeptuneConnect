const gremlin = require('gremlin')
const request = require('request')
const { getUrlAndHeaders, uuid } = require('../utils')

class AwsSigV4DriverRemoteConnection extends gremlin.driver.RemoteConnection {
  constructor (host, port, options = {}, cbConnected, cbDisconnected, cbError) {
    const { url } = getUrlAndHeaders(host, port, options, '/gremlin', options.secure ? 'wss' : 'ws')
    super(url)

    this.host = host
    this.port = port
    this.options = options
    this.cbConnected = cbConnected
    this.cbDisconnected = cbDisconnected
    this.cbError = cbError
    this.secure = options.secure || false

    this.try = 0
    this.maxRetry = this.options.maxRetry || 10

    this.clientOptions = {
      connectOnStartup: true,
      mimeType: 'application/vnd.gremlin-v2.0+json',
      pingEnabled: true,
      pingInterval: 1000,
      pongTimeout: 2000,
      ...this.options
    }

    this._rejections = {}
    this._connect()
  }

  _connect () {
    this.try += 1
    const { url, headers } = getUrlAndHeaders(
      this.host,
      this.port,
      this.options,
      '/status',
      this.secure ? 'https' : 'http'
    )
    request.get({ url, headers, timeout: 3000 }, (error, response, body) => {
      this._statusCallback(error, response, body)
    })
  }

  _statusCallback (error, response, body) {
    if (error) {
      this._errorHandler(error)
    } else if (response) {
      const msg = typeof response === 'object' ? JSON.stringify(response) : response
      if (response.statusCode === 200) {
        this._connectSocket()
      } else {
        this._errorHandler(new Error(msg))
      }
    } else {
      const msg = 'No response or error received from request'
      this._errorHandler(new Error(msg))
    }
  }

  _connectSocket () {
    const { url, headers } = getUrlAndHeaders(
      this.host,
      this.port,
      this.options,
      '/gremlin',
      this.secure ? 'wss' : 'ws'
    )
    this._client = new gremlin.driver.Client(url, { headers, ...this.clientOptions })
    this._client._connection.on('log', (log) => this._logHandler(log))
    this._client._connection.on('close', (code, message) => this._closeHandler(code, message))
    this._client._connection.on('error', (error) => this._errorHandler(error))
    this._client._connection._ws.on('open', () => this._connectHandler())
  }

  _logHandler (log) {
    // eslint-disable-line class-methods-use-this
  }

  _connectHandler () {
    if (this.cbConnected) {
      this.cbConnected()
    }
    if (this._client._connection.isOpen) {
      this.try = 0
    }
  }

  _closeHandler (code, message) {
    this._cancelPendingQueries(new Error('Neptune connection is closed'))
    if (this.cbDisconnected) {
      this.cbDisconnected(code, message)
    }
    if (this.options.autoReconnect && this.try < this.maxRetry) {
      this._connect()
    }
  }

  _errorHandler (error) {
    this._cancelPendingQueries(error)
    if (this.cbError) {
      this.cbError(error)
    }
    if (this.options.autoReconnect && this.try < this.maxRetry) {
      this._connect()
    } else if (error instanceof Error) {
      throw error
    }
  }

  _cancelPendingQueries (error) {
    Object.values(this._rejections).forEach((reject) => reject(error))
    this._rejections = {}
  }

  /** @override */
  open () {
    return this._client.open()
  }

  /** @override */
  submit (bytecode) {
    return new Promise((resolve, reject) => {
      const queryId = uuid()
      this._rejections[queryId] = reject
      this._client
        .submit(bytecode)
        .then((result) => {
          delete this._rejections[queryId]
          resolve(new gremlin.driver.RemoteTraversal(result.toArray()))
        })
        .catch(reject)
    }).then((result) => result)
  }

  /** @override */
  close () {
    this.options.autoReconnect = false
    return this._client.close()
  }
}

module.exports.AwsSigV4DriverRemoteConnection = AwsSigV4DriverRemoteConnection
