import { type FastifyInstance } from 'fastify'

export default async function seedDb (fastify: FastifyInstance): Promise<void> {
  fastify.log.info('Seeding the database')
  const res = await fastify.prisma.user.count()

  if (res <= 0) {
    const newUser = await fastify.addNewUser({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      persistant: true
    })

    const adminPermission = JSON.stringify({ '*': { '*': true } })
    const newPermission = await fastify.createPermissions('admin', adminPermission, true)

    await fastify.insertRoles(newUser.id, [newPermission.id])
  }

  const permission = await fastify.getPermissionsFromName('default')

  if (permission === null) {
    fastify.log.info('Adding default permission')
    const defaultPermission = JSON.stringify({
      editor: {
        read: true,
        write: true,
        update: true,
        delete: true
      },
      profile: {
        read: true,
        write: true,
        update: true,
        delete: true
      }
    })

    await fastify.createPermissions('default', defaultPermission, true)
  }
}
