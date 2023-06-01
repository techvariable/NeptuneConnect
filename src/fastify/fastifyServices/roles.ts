import fp from 'fastify-plugin'
import { type Permission, type UserRole, type Prisma } from '@prisma/client'
import { type TDeletePermission } from '../../ts/types/user.type'

export default fp(async (fastify, opts) => {
  async function getRoleIdFromName (roleName: string): Promise<number | null> {
    const rolesObject: Permission | null = await fastify.prisma.permission.findUnique({
      where: {
        roleName
      }
    })

    if (rolesObject != null) {
      return rolesObject?.id
    }

    return null
  }

  async function getPermissionsFromName (roleName: string): Promise<string | null> {
    const rolesObject: Permission | null = await fastify.prisma.permission.findUnique({
      where: {
        roleName
      }
    })

    if (rolesObject != null) {
      return rolesObject?.permissions
    }

    return null
  }

  async function addDefaultRole (userId: number): Promise<void> {
    const roleId = await getRoleIdFromName('default')

    if (roleId != null) {
      await fastify.prisma.userRole.create({
        data: {
          userId,
          roleId
        }
      })
    }
  }

  async function getAllRoleNames (): Promise<Array<Partial<Permission>>> {
    const rolesObject: Array<Partial<Permission>> = await fastify.prisma.permission.findMany({
      select: {
        id: true,
        roleName: true
      }
    })
    return rolesObject
  }
  async function getPaginatedPermissions (limit: number, offset: number): Promise<Array<Partial<Permission>>> {
    const rolesObject: Array<Partial<Permission>> = await fastify.prisma.permission.findMany({
      skip: offset,
      take: limit,
      select: {
        id: true,
        roleName: true
      }
    })
    return rolesObject
  }

  async function createPermissions (roleName: string, permissions: string, persistant: boolean = false): Promise<Permission> {
    const createdRoles: Permission = await fastify.prisma.permission.create({
      data: {
        roleName,
        permissions,
        persistant
      }
    })
    return createdRoles
  }

  async function getPermissions (roleId: number): Promise<string | null> {
    const rolesObject: Partial<Permission> | null = await fastify.prisma.permission.findUnique({
      where: {
        id: roleId
      }
    })

    return rolesObject?.permissions ?? null
  }

  async function deleteSpecificRole (roleId: number): Promise<TDeletePermission> {
    const operation: TDeletePermission = {
      isDeleted: false,
      deletedPermissionId: null,
      deletedPermissionName: null,
      usersWithAssignedRole: []
    }

    const users = await fastify.prisma.userRole.findMany({
      where: {
        roleId
      }
    })

    const userIds = users.map((u) => u.userId)

    if (userIds.length === 0) {
      const permission = await fastify.prisma.permission.delete({
        where: {
          id: roleId
        }
      })

      operation.deletedPermissionId = permission.id
      operation.deletedPermissionName = permission.roleName
      operation.isDeleted = true

      return operation
    } else {
      const userEmails = await fastify.prisma.user.findMany({
        select: {
          email: true
        },
        where: {
          id: { in: userIds }
        }
      })

      const usersWithAssignedRole: string[] = userEmails.map((v) => {
        return v.email
      })

      operation.usersWithAssignedRole = usersWithAssignedRole
      const deletedRoleName = await fastify.prisma.permission.findUnique({
        select: {
          roleName: true
        },
        where: {
          id: roleId
        }
      })

      operation.deletedPermissionName = deletedRoleName?.roleName ?? null
      return operation
    }
  }

  async function isPersistantRole (roleId: number): Promise<boolean> {
    const permission = await fastify.prisma.permission.findUnique({
      select: {
        persistant: true
      },
      where: {
        id: roleId
      }
    })

    if (permission != null) return permission.persistant
    return false
  }

  async function updatePermissions (roleId: number, permissions: string): Promise<Permission> {
    const updatedRoles: Permission = await fastify.prisma.permission.update({
      where: {
        id: roleId
      },
      data: {
        permissions
      }
    })
    return updatedRoles
  }

  async function fetchRoles (userId: number): Promise<Array<{ roleId: number, persistant: boolean }>> {
    const rolesArray: Array<{ roleId: number, permission: { persistant: boolean } }> = await fastify.prisma.userRole.findMany({
      where: {
        userId
      },
      select: {
        roleId: true,
        permission: {
          select: {
            persistant: true
          }
        }
      }
    })
    return rolesArray.map(role => {
      return {
        roleId: role.roleId,
        persistant: role.permission.persistant
      }
    })
    // return rolesArray.map((item) => item.roleId)
  }

  async function insertRoles (userId: number, roles: number[]): Promise<UserRole[]> {
    const totalInsertedData = []
    // Bulk insert not supported in SQLite
    for (const Id of roles) {
      const roleId = Number(Id)

      const insertedData: UserRole = await fastify.prisma.userRole.create({
        data: {
          userId,
          roleId
        }
      })
      totalInsertedData.push(insertedData)
    }
    return totalInsertedData
  }

  async function deleteRoles (userId: number, roles: number[]): Promise<Prisma.BatchPayload[]> {
    const totalDeletedData = []
    for (const Id of roles) {
      if (!await isPersistantRole(Id)) {
        const roleId = Number(Id)

        const insertedData = await fastify.prisma.userRole.deleteMany({
          where: {
            userId,
            roleId
          }
        })
        totalDeletedData.push(insertedData)
      }
    }
    return totalDeletedData
  }

  async function arePersistantRoles (roles: number[]): Promise<boolean> {
    const count = await fastify.prisma.permission.count({
      where: {
        id: { in: roles },
        persistant: true
      }
    })

    return count > 0
  }

  fastify.decorate('createPermissions', createPermissions)
  fastify.decorate('getPermissions', getPermissions)
  fastify.decorate('deleteSpecificRole', deleteSpecificRole)
  fastify.decorate('updatePermissions', updatePermissions)
  fastify.decorate('getPermissionsFromName', getPermissionsFromName)
  fastify.decorate('getAllRoleNames', getAllRoleNames)
  fastify.decorate('getPaginatedPermissions', getPaginatedPermissions)
  fastify.decorate('fetchRoles', fetchRoles)
  fastify.decorate('insertRoles', insertRoles)
  fastify.decorate('deleteRoles', deleteRoles)
  fastify.decorate('isPersistantRole', isPersistantRole)
  fastify.decorate('addDefaultRole', addDefaultRole)
  fastify.decorate('arePersistantRoles', arePersistantRoles)
})

declare module 'fastify' {
  export interface FastifyInstance {
    createPermissions: (rolename: string, permissions: string, persistant: boolean) => Promise<Permission>
    getPermissions: (roleId: number) => Promise<string | null>
    deleteSpecificRole: (roleId: number) => Promise<TDeletePermission>
    updatePermissions: (roleId: number, permissions: string) => Promise<Permission>
    getPermissionsFromName: (roleName: string) => Promise<string | null>
    getAllRoleNames: () => Promise<Array<Partial<Permission>>>
    getPaginatedPermissions: (limit: number, offset: number) => Promise<Array<Partial<Permission>>>
    fetchRoles: (userId: number) => Promise<Array<{ roleId: number, persistant: boolean }>>
    insertRoles: (userId: number, roles: number[]) => Promise<UserRole[]>
    deleteRoles: (userId: number, roles: number[]) => Promise<any>
    isPersistantRole: (roleId: number) => Promise<boolean>
    arePersistantRoles: (roles: number[]) => Promise<boolean>
    addDefaultRole: (userId: number) => Promise<void>
  }
}
