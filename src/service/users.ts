import { type FastifyInstance } from 'fastify'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function findUserByEmail (email: string, fastify: FastifyInstance) {
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
    const parsedPermission: object[] = []
    for (const key of data.permissionRel) {
      const obj: any = {}
      parsedPermission.push((obj.permission = JSON.parse(key.permission.permissions)))
    }
    const userData = {
      id: 0,
      name: '',
      email: '',
      date: new Date(),
      password: '',
      permissions: [{}]
    }
    userData.id = data.id
    userData.name = data.name
    userData.email = data.email
    userData.date = data.date
    userData.password = data.password
    userData.permissions = parsedPermission
    return userData
  }
}

async function findUserByAPIKey (apiKey: string, fastify: FastifyInstance): Promise<{
  userId: number
} | null> {
  return await fastify.prisma.aPIKey.findUnique({
    where: {
      apiKey
    },
    select: {
      userId: true
    }
  })
}

export default {
  findUserByEmail,
  findUserByAPIKey
}
