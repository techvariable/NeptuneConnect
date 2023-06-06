import { type FastifyRequest, type FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'

import fastifyPassport from '@fastify/passport'
import fastifyAuth, { type FastifyAuthFunction } from '@fastify/auth'
import fastifySecureSession from '@fastify/secure-session'
import LocalStrategy from 'passport-local'

import usersService from '../../service/users'
import { type TAPIKey } from '../../ts/types/user.type'

declare module 'fastify' {
  interface FastifyInstance {
    checkAuth: FastifyAuthFunction
    checkAuthAPI: FastifyAuthFunction
    checkAPIKey: FastifyAuthFunction
  }

  interface FastifyRequest {
    apiKeyUser: {
      id: number
    }
  }
}

declare module 'fastify' {
  export interface PassportUser {
    id: number
    name: string
    email: string
    date: string
    permissions: Array<Record<string, any>>
  }
}

export default fp(async (fastify) => {
  await fastify.register(fastifySecureSession, {
    cookie: {
      maxAge: 60 * 60 * 100
    },
    key: fs.readFileSync(path.join(process.cwd(), 'not-so-secret-key'))
  })
  await fastify.register(fastifyPassport.initialize())
  await fastify.register(fastifyPassport.secureSession())

  fastifyPassport.use(
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    new LocalStrategy.Strategy({ usernameField: 'email' }, async function (
      username: string,
      password: string,
      cb: any
    ): Promise<any> {
      const user = await usersService.findUserByEmail(username, fastify)
      if (user == null) {
        return cb(null, false, {
          error: 'Username or password is wrong!!!'
        })
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return cb(null, false, {
          error: 'Username or password is wrong!!!'
        })
      }

      const parsedPermission: object[] = []

      for (const key of user.permissions) {
        parsedPermission.push(key)
      }

      cb(null, {
        id: user.id,
        name: user.name,
        email: user.email,
        date: user.date,
        permissions: parsedPermission
      })
    })
  )

  fastify.decorate(
    'checkAuthAPI',
    // eslint-disable-next-line @typescript-eslint/ban-types
    async function (request: FastifyRequest, reply: FastifyReply, done: Function): Promise<any> {
      if (request.isAuthenticated()) {
        return true
      }

      reply.unauthorized('Unauthorized user')
    }
  )

  fastify.decorate(
    'checkAPIKey',
    async function (
      request: FastifyRequest<{ Headers: TAPIKey, user: number }>,
      reply: FastifyReply,
      // eslint-disable-next-line @typescript-eslint/ban-types
      done: Function
    ): Promise<any> {
      const key = request.headers['api-key']

      if (key != null) {
        const user = await usersService.findUserByAPIKey(key, fastify)
        if (user?.userId != null) {
          request.apiKeyUser = {
            id: user.userId
          }
          return true
        }
      }

      reply.unauthorized('Unauthorized user')
    }
  )

  fastify.decorate('checkAuth', async function (request: FastifyRequest, reply: FastifyReply) {
    if (request.isAuthenticated()) {
      return true
    } else {
      return await reply.redirect('/login')
    }
  })

  void fastify.register(fastifyAuth)

  fastifyPassport.registerUserSerializer(async function (user, done) {
    return user
  })

  fastifyPassport.registerUserDeserializer(async function (user, done) {
    return user
  })
})
