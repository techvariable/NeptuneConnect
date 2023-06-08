import { type FastifyPluginAsync, type FastifyInstance } from 'fastify'

import {
  type TUserIdRequest,
  type TAcceptInvitation,
  type TGetUsers
} from '../../../ts/types/user.type'
import { checkRolePermission } from '../../../hooks/roles'
import { SGetSpecificUsers, SUserID } from '../../../ts/schemas/user.schema'

const users: FastifyPluginAsync = async (fastify: FastifyInstance, opts): Promise<void> => {
  fastify.get<{
    Querystring: TGetUsers
  }>(
    '/',
    {
      preValidation: fastify.auth([fastify.checkAuth]),
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      preHandler: checkRolePermission({ name: 'users', permission: 'read' }),
      schema: {
        hide: true,
        querystring: SGetSpecificUsers
      }
    },
    async function (request, reply) {
      const { limit, offset } = request.query
      const { users, count } = await fastify.getSpecificUsers(limit, offset)
      const url = ''
      return await reply.view('/view/users.ejs', {
        users,
        count,
        url,
        imgurl: `${process.env.APP_URL}`,
        user: JSON.stringify({ name: request.user?.name, email: request.user?.email }),
        limit,
        offset,
        permissions: request.user?.permissions,
        mode: process.env.MODE
      })
    }
  )

  fastify.get<Record<string, unknown>>(
    '/forgot',
    {
      schema: {
        hide: true
      }
    },
    async function (request, reply) {
      const url = ''
      return await reply.view('/view/forgotPassword.ejs', {
        url,
        imgurl: `${process.env.APP_URL}`
      })
    }
  )

  fastify.get<{
    Params: TUserIdRequest
  }>(
    '/:id',
    {
      preValidation: fastify.auth([fastify.checkAuth]),
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      preHandler: checkRolePermission({ name: 'users', permission: 'read' }),
      schema: {
        hide: true,
        params: SUserID
      }
    },
    async function (request, reply) {
      const userId = request.params.id
      const permissions = await fastify.getRolesWithPermissions(userId)
      const user = await fastify.findUserDetailsByUserId(userId)
      const combinedpermissions: Array<Record<string, unknown>> = []
      permissions.forEach((item) => {
        combinedpermissions.push(JSON.parse(item.permission.permissions))
      })
      const details = JSON.stringify({ name: user.name, email: user.email })
      return await reply.view('/view/userProfile.ejs', {
        url: `${process.env.APP_URL}`,
        imgurl: `${process.env.APP_URL}`,
        permissions,
        combinedpermissions,
        user: JSON.stringify({ name: request.user?.name, email: request.user?.email }),
        useremail: user.email,
        details,
        mode: process.env.MODE
      })
    }
  )

  fastify.get<{
    Params: TAcceptInvitation
  }>(
    '/invite/:invitationId',
    {
      schema: {
        hide: true
      }
    },
    async function (request, reply) {
      const invitationId: string = request.params.invitationId
      const invitation = await fastify.getInvitationDetailsFromInditationId(invitationId)
      if (invitation != null) {
        return await reply.view('/view/invitation.ejs', {
          errorMessage: null,
          email: invitation.recipientEmail,
          url: process.env.APP_URL,
          postUrl: '/api/users'
        })
      }

      return await reply.view('/view/invitation.ejs', {
        errorMessage: 'Invitation id is not correct',
        email: null,
        url: process.env.APP_URL,
        postUrl: '/api/users'
      })
    }
  )

  fastify.get<{
    Params: TAcceptInvitation
  }>(
    '/forgot/:invitationId',
    {
      schema: {
        hide: true
      }
    },
    async function (request, reply) {
      const invitationId: string = request.params.invitationId
      const invitation = await fastify.getPasswordChangeRequestFromInditationId(invitationId)
      if (invitation != null) {
        return await reply.view('/view/resetPassword.ejs', {
          errorMessage: null,
          email: invitation.recipientEmail,
          url: process.env.APP_URL,
          postUrl: `/api/users/forgot/password/${invitationId}`
        })
      }

      return await reply.view('/view/resetPassword.ejs', {
        errorMessage: 'Reset id is not correct',
        email: null,
        url: process.env.APP_URL,
        postUrl: '/users'
      })
    }
  )
}

export default users
