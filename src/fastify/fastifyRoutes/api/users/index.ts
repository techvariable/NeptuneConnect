import crypto from 'crypto'
import { type FastifyPluginAsync, type FastifyInstance } from 'fastify'

import emailService from '../../../../service/email'
import { checkRolePermission } from '../../../../hooks/roles'

import {
  SAddUser,
  SGetRoles,
  SInvitation,
  SEditRole,
  SUserID,
  SGetSpecificUsers,
  SUpdatePassword
} from '../../../../ts/schemas/user.schema'
import {
  type TInvitationRequest,
  type TAddUserRequest,
  type TDeleteUserRequest,
  type TGetRoles,
  type TEditRole,
  type TGetPaginatedUsers,
  type TUpdatePassword,
  type TResetInvitation
} from '../../../../ts/types/user.type'

const users: FastifyPluginAsync = async (fastify: FastifyInstance, opts): Promise<void> => {
  fastify.post<{
    Body: TInvitationRequest
  }>(
    '/invite/',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'users', permission: 'write' }),
      schema: {
        tags: ['User'],
        summary: 'Invites a new user',
        body: SInvitation
      }
    },
    async function (request, reply) {
      const key: string = crypto.randomBytes(30).toString('hex')
      const url: string = `${process.env.APP_URL}users/invite/${key}`

      const email = request.body.email

      try {
        if (await fastify.checkIfInvited(email)) {
          reply.badRequest('User already invited!!!')
          return
        } else if (await fastify.findUserByEmailId(email)) {
          reply.badRequest('User already exists!!!')
        }

        await fastify.addInvitation({
          recipientEmail: email,
          hashedPassKey: key
        })

        await emailService.sendInvitationEmail(email, url)

        return {
          success: true
        }
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )

  fastify.post<{
    Body: TInvitationRequest
  }>(
    '/forgot/',
    {
      schema: {
        tags: ['User'],
        summary: 'Send reset url to the email',
        body: SInvitation
      }
    },
    async function (request, reply) {
      const key: string = crypto.randomBytes(30).toString('hex')
      const url: string = `${process.env.APP_URL}users/forgot/${key}`

      const email = request.body.email

      try {
        if (await fastify.findUserByEmailId(email)) {
          const isPasswordChangeRequested = await fastify.checkIfPasswordChangeRequested(email)
          if (isPasswordChangeRequested) {
            await fastify.deletePasswordChangeRequest(email)
          }
          await fastify.addPasswordChangeRequest({
            recipientEmail: email,
            hashedPassKey: key
          })
          await emailService.sendPasswordResetUrl(email, url)
          await reply.redirect(process.env.APP_URL)
        }
        reply.badRequest('User does not exists!!!')
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )

  fastify.post<{
    Body: TAddUserRequest
  }>(
    '/',
    {
      schema: {
        summary: 'Adds a new user to the system',
        tags: ['User'],
        body: SAddUser
      }
    },
    async function (request, reply) {
      const { email } = request.body

      try {
        if ((await fastify.findUserByEmail(email)) !== undefined) {
          reply.badRequest('User already exists in the system')
          return
        }

        await fastify.deleteInvitation(email)
        const user = await fastify.addNewUser(request.body)
        await fastify.addDefaultRole(user.id)

        return {
          success: true
        }
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )

  fastify.put<{
    Body: TAddUserRequest
  }>(
    '/password',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'profile', permission: 'update' }),
      schema: {
        summary: 'Updates user credentials',
        tags: ['User'],
        body: SAddUser
      }
    },
    async function (request, reply) {
      try {
        await fastify.updateUserCredentials(request.body)

        return {
          success: true
        }
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )

  fastify.put<{
    Params: TResetInvitation
    Body: TUpdatePassword
  }>(
    '/forgot/password/:resetid',
    {
      schema: {
        summary: 'Updates user Password',
        tags: ['User'],
        body: SUpdatePassword
      }
    },
    async function (request, reply) {
      try {
        const resetId: string = request.params.resetid
        const invitation = await fastify.getPasswordChangeRequestFromInditationId(resetId)
        if (invitation !== null) {
          await fastify.updateUserPassword(request.body)
          return {
            success: true
          }
        } else {
          reply.badRequest('Reset request does not exists!!!')
        }
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )

  fastify.delete<{
    Body: TDeleteUserRequest
  }>(
    '/',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'users', permission: 'delete' }),
      schema: {
        summary: 'Delete user from the system',
        tags: ['User'],
        body: SUserID
      }
    },
    async function (request, reply) {
      const { id } = request.body
      if (request.user?.id === id) {
        reply.internalServerError("You can't delete yourself!!!")
        return
      }
      try {
        await fastify.deleteUser({ id })
        return {
          success: true
        }
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )

  fastify.get<{
    Querystring: TGetRoles
  }>(
    '/roles',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'users', permission: 'read' }),
      schema: {
        tags: ['User'],
        summary: 'Shows all Roles for the specific user',
        querystring: SGetRoles
      }
    },
    async function (request, reply) {
      const { userId }: TGetRoles = request.query
      try {
        const respond = await fastify.fetchRoles(Number(userId))
        return respond
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )

  fastify.get(
    '/all',
    {
      preValidation: fastify.auth([fastify.checkAuth]),
      preHandler: checkRolePermission({ name: 'users', permission: 'read' }),
      schema: {
        tags: ['User'],
        summary: 'Shows all users'
      }
    },
    async function (request, reply) {
      const users = await fastify.getAllUsers()
      return JSON.stringify(users)
    }
  )

  fastify.get<{
    Querystring: TGetPaginatedUsers
  }>(
    '/pagination/',
    {
      preValidation: fastify.auth([fastify.checkAuth]),
      preHandler: checkRolePermission({ name: 'users', permission: 'read' }),
      schema: {
        tags: ['User'],
        summary: 'Shows paginated users',
        querystring: SGetSpecificUsers
      }
    },
    async function (request, reply) {
      const { limit, offset } = request.query
      const { users, count } = await fastify.getSpecificUsers(limit, offset)
      return { users, count }
    }
  )

  fastify.put<{
    Body: TEditRole
  }>(
    '/roles',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'users', permission: 'update' }),
      schema: {
        tags: ['User'],
        summary: 'Update Roles',
        body: SEditRole
      }
    },
    async function (request, reply) {
      try {
        const { userId, roles } = request.body

        if (await fastify.isPersistantUser(userId)) {
          reply.badRequest('Persistent users cannot be updated')
          return
        }

        const presentRolesWithPersistantFlag: Array<{ roleId: number, persistant: boolean }> =
          await fastify.fetchRoles(userId)
        const presentRoles: number[] = presentRolesWithPersistantFlag.map((role) => role.roleId)
        const commonRoles: number[] = roles.filter((element) => presentRoles.includes(element))
        let insertRoles: number[] = roles.filter(function (roleId) {
          return !commonRoles.includes(roleId)
        })
        insertRoles = insertRoles.filter((item, index) => insertRoles.indexOf(item) === index)
        const deleteRoles: number[] = presentRoles.filter(function (roleId) {
          return !commonRoles.includes(roleId)
        })

        if (
          (await fastify.arePersistantRoles(insertRoles)) ||
          (await fastify.arePersistantRoles(deleteRoles))
        ) {
          reply.badRequest('Persistent roles cannot be assigned/revoked')
          return
        }

        await fastify.insertRoles(userId, insertRoles)
        await fastify.deleteRoles(userId, deleteRoles)
        const updatedRoles = await fastify.fetchRoles(userId)
        return updatedRoles
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )
}

export default users
