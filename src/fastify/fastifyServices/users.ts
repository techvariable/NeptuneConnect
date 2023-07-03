import fp from 'fastify-plugin'
import bcrypt from 'bcrypt'
import { type User, type Permission, type DemoVisitEmail } from '@prisma/client'

import {
  type TDeleteUserRequest,
  type TAddUser,
  type TGetUserDetails,
  type TGetUserByEmail,
  type TUpdatePassword
} from '../../ts/types/user.type'

export default fp(async (fastify, opts) => {
  async function getAllUsers(): Promise<User[]> {
    const users: User[] = await fastify.prisma.user.findMany({})
    return users
  }

  async function getSpecificUsers(
    limit: number,
    offset: number
  ): Promise<{ users: User[], count: number }> {
    const count = await fastify.prisma.user.count({})

    const users: User[] = await fastify.prisma.user.findMany({
      skip: offset,
      take: limit
    })
    return {
      users,
      count
    }
  }

  async function addNewUser(data: TAddUser): Promise<User> {
    const hashPassword: string = bcrypt.hashSync(data.password, 10)

    return await fastify.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashPassword,
        date: new Date(),
        persistant: data.persistant ?? false
      }
    })
  }

  async function updateUserCredentials(data: TAddUser): Promise<User> {
    const hashPassword: string = bcrypt.hashSync(data.password, 10)

    return await fastify.prisma.user.update({
      where: {
        email: data.email
      },
      data: {
        name: data.name,
        password: hashPassword
      }
    })
  }

  async function updateUserPassword(data: TUpdatePassword): Promise<User> {
    const hashPassword: string = bcrypt.hashSync(data.password, 10)

    return await fastify.prisma.user.update({
      where: {
        email: data.email
      },
      data: {
        password: hashPassword
      }
    })
  }

  async function isPersistantUser(userId: number): Promise<boolean> {
    const user = await fastify.prisma.user.findUnique({
      select: {
        persistant: true
      },
      where: {
        id: userId
      }
    })

    if (user != null) return user.persistant
    return false
  }

  async function deleteUser(data: TDeleteUserRequest): Promise<User> {
    const deletedUser = await fastify.prisma.user.delete({
      where: {
        id: data.id
      }
    })
    await fastify.prisma.userRole.deleteMany({
      where: {
        userId: data.id
      }
    })
    return deletedUser
  }
  async function findUserByEmailId(email: string): Promise<boolean> {
    const data = await fastify.prisma.user.findUnique({
      where: {
        email
      },
      select: {
        id: true,
        email: true,
        name: true,
        date: true,
        password: true,
        permissionRel: {
          select: {
            permission: {
              select: {
                permissions: true
              }
            }
          }
        }
      }
    })
    if (data !== null) {
      return true
    }
    return false
  }

  async function findUserByEmail(email: string): Promise<TGetUserByEmail | undefined> {
    const data = await fastify.prisma.user.findUnique({
      where: {
        email
      },
      select: {
        id: true,
        email: true,
        name: true,
        date: true,
        password: true,
        permissionRel: {
          select: {
            permission: {
              select: {
                permissions: true
              }
            }
          }
        }
      }
    })
    if (data != null) {
      const parsedPermission: Array<Record<string, unknown>> = []
      for (const key of data.permissionRel) {
        const obj: any = {}
        parsedPermission.push((obj.permission = JSON.parse(key.permission.permissions)))
      }
      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        date: data.date,
        password: data.password,
        permissions: parsedPermission
      }
      return userData
    }
  }

  async function findUserByAPIKey(apiKey: string): Promise<{ apiId: number } | null> {
    return await fastify.prisma.aPIKey.findUnique({
      where: {
        apiKey
      },
      select: {
        apiId: true
      }
    })
  }
  async function findUserDetailsByUserId(userId: number): Promise<TGetUserDetails> {
    const user: TGetUserDetails | null = await fastify.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    return { email: user?.email, name: user?.name }
  }
  async function findUserByUserId(userId: number): Promise<string | null> {
    const user = await fastify.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    return user?.email ?? null
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async function getRolesWithPermissions(userId: number) {
    return await fastify.prisma.userRole.findMany({
      where: {
        userId
      },
      select: {
        permission: true
      }
    })
  }

  async function findAlreadyVisitedEmailId(email: string): Promise<DemoVisitEmail | null> {
    return await fastify.prisma.demoVisitEmail.findUnique({
      where: {
        email
      }
    })
  }

  async function createNewVisitByEmail(email: string): Promise<DemoVisitEmail | null> {
    const data = fastify.prisma.demoVisitEmail.create({
      data: {
        email
      }
    })
    return await data
  }

  fastify.decorate('getAllUsers', getAllUsers)
  fastify.decorate('getSpecificUsers', getSpecificUsers)
  fastify.decorate('addNewUser', addNewUser)
  fastify.decorate('updateUserCredentials', updateUserCredentials)
  fastify.decorate('updateUserPassword', updateUserPassword)
  fastify.decorate('deleteUser', deleteUser)
  fastify.decorate('findUserByEmail', findUserByEmail)
  fastify.decorate('findUserByEmailId', findUserByEmailId)
  fastify.decorate('findUserByAPIKey', findUserByAPIKey)
  fastify.decorate('findUserByUserId', findUserByUserId)
  fastify.decorate('findUserDetailsByUserId', findUserDetailsByUserId)
  fastify.decorate('getRolesWithPermissions', getRolesWithPermissions)
  fastify.decorate('isPersistantUser', isPersistantUser)
  fastify.decorate('findAlreadyVisitedEmailId', findAlreadyVisitedEmailId)
  fastify.decorate('createNewVisitByEmail', createNewVisitByEmail)
})

declare module 'fastify' {
  export interface FastifyInstance {
    getAllUsers: () => Promise<User[]>
    getSpecificUsers: (limit: number, offset: number) => Promise<{ users: User[], count: number }>
    findUserByEmail: (email: string) => Promise<TGetUserByEmail | undefined>
    findUserByEmailId: (email: string) => Promise<boolean>
    findUserByAPIKey: (apiKey: string) => Promise<{ apiId: number } | null>
    findUserByUserId: (userId: number) => Promise<string>
    findUserDetailsByUserId: (userId: number) => Promise<User>
    addNewUser: (data: TAddUser) => Promise<User>
    updateUserCredentials: (data: TAddUser) => Promise<User>
    updateUserPassword: (data: TUpdatePassword) => Promise<User>
    deleteUser: (data: TDeleteUserRequest) => Promise<User>
    getRolesWithPermissions: (userId: number) => Promise<Array<{ permission: Permission }>>
    isPersistantUser: (userId: number) => Promise<boolean>
    findAlreadyVisitedEmailId: (email: string) => Promise<DemoVisitEmail | null>
    createNewVisitByEmail: (email: string) => Promise<DemoVisitEmail>
  }
}
