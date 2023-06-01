import { type FastifyPluginAsync, type FastifyInstance } from 'fastify'

import {
  SAddPermission,
  SEditPermission,
  SGetPermissions,
  SGetPaginatedPermissions
} from '../../../../ts/schemas/user.schema'
import {
  type TGetPaginatedPermissions,
  type TAddPermission,
  type TEditPermission,
  type TGetPermissions
} from '../../../../ts/types/user.type'

import { isValidPermissionJson } from '../../../../utils/permission'
import { checkRolePermission } from '../../../../hooks/roles'

const permissions: FastifyPluginAsync = async (fastify: FastifyInstance, opts): Promise<void> => {
  fastify.get<{
    Querystring: TGetPermissions
  }>(
    '/',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'permissions', permission: 'read' }),
      schema: {
        tags: ['Permissions'],
        summary: 'Shows permissions for specific role',
        querystring: SGetPermissions
      }
    },
    async function (request, reply) {
      try {
        const roleId: number = request.query.roleId
        const respond = await fastify.getPermissions(roleId)

        if (respond !== null) return JSON.parse(respond)

        reply.notFound('Role not available')
        return
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )
  fastify.delete<{
    Querystring: TGetPermissions
  }>(
    '/',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'permissions', permission: 'delete' }),
      schema: {
        tags: ['Permissions'],
        summary: 'Delete specific role',
        querystring: SGetPermissions
      }
    },
    async function (request, reply) {
      try {
        const roleId: number = request.query.roleId

        if (await fastify.isPersistantRole(roleId)) { reply.badRequest('Persistent roles cannot be deleted'); return }

        const respond = await fastify.deleteSpecificRole(roleId)
        // not using 204 because front end needs the permission id
        return await reply.code(respond.isDeleted ? 201 : 400).send(respond)
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )
  fastify.get(
    '/all',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'permissions', permission: 'read' }),
      schema: {
        tags: ['Permissions'],
        summary: 'Show all roles'
      }
    },
    async function (request, reply) {
      try {
        return await fastify.getAllRoleNames()
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )
  fastify.get<{
    Querystring: TGetPaginatedPermissions
  }>(
    '/permissions',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'permissions', permission: 'read' }),
      schema: {
        tags: ['Permissions'],
        summary: 'Shows specific permissions roles',
        querystring: SGetPaginatedPermissions
      }
    },
    async function (request, reply) {
      try {
        const respond = await fastify.getPaginatedPermissions(request.query.limit, request.query.offset)
        if (respond !== null) return respond
        reply.notFound('Permission not available')
        return
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )
  fastify.post<{
    Body: TAddPermission
  }>(
    '/',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'permissions', permission: 'write' }),
      schema: {
        tags: ['Permissions'],
        summary: 'Add new permissions',
        body: SAddPermission
      }
    },
    async function (request, reply) {
      try {
        const roleName: string = request.body.roleName
        const permissions: string =
          '{\n  "editor":{\n    "read":true,\n    "write":true,\n    "update":true,\n    "delete":true \n  }\n}'

        const { isValid, error } = isValidPermissionJson(permissions)
        if (isValid === false) {
          reply.badRequest(error)
          return
        }

        const isPresent = await fastify.getPermissionsFromName(roleName)
        if (isPresent !== null) {
          await reply.code(400).send(`Role ${roleName} is already present !`)
          return
        }

        return await reply.code(201).send(await fastify.createPermissions(roleName, permissions, false))
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )
  fastify.put<{ Body: TEditPermission }>(
    '/',
    {
      preValidation: fastify.auth([fastify.checkAuthAPI]),
      preHandler: checkRolePermission({ name: 'permissions', permission: 'update' }),
      schema: {
        tags: ['Permissions'],
        summary: 'Updates permissions',
        body: SEditPermission
      }
    },
    async function (request, reply) {
      try {
        const roleId: number = request.body.roleId
        const permissions: string = request.body.permissions

        if (await fastify.isPersistantRole(roleId)) { reply.badRequest('Persistent roles cannot be updated'); return }

        const { isValid, error } = isValidPermissionJson(permissions)

        if (isValid === false) {
          reply.badRequest(error)
          return
        }

        return await reply.code(201).send(await fastify.updatePermissions(roleId, permissions))
      } catch (error) {
        fastify.log.error(error)
        reply.internalServerError('Something went wrong with the server')
      }
    }
  )
}

export default permissions
