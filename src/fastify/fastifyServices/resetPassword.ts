import fp from 'fastify-plugin'
import { type ResetPassword } from '@prisma/client'

import { type TResetPassword } from '../../ts/types/user.type'

export default fp(async (fastify, opts) => {
  async function checkIfPasswordChangeRequested (email: string): Promise<boolean> {
    const invitedPerson = await fastify.prisma.resetPassword.findUnique({
      where: {
        recipientEmail: email
      },
      select: {
        resetPasswordId: true
      }
    })

    return invitedPerson != null
  }

  async function addPasswordChangeRequest (data: TResetPassword): Promise<ResetPassword> {
    return await fastify.prisma.resetPassword.create({ data })
  }

  async function deletePasswordChangeRequest (recipientEmail: string): Promise<ResetPassword> {
    return await fastify.prisma.resetPassword.delete({
      where: {
        recipientEmail
      }
    })
  }

  async function getPasswordChangeRequestFromInditationId (resetId: string): Promise<{
    recipientEmail: string
  } | null> {
    return await fastify.prisma.resetPassword.findUnique({
      where: {
        hashedPassKey: resetId
      },
      select: {
        recipientEmail: true
      }
    })
  }

  fastify.decorate('checkIfPasswordChangeRequested', checkIfPasswordChangeRequested)
  fastify.decorate(
    'getPasswordChangeRequestFromInditationId',
    getPasswordChangeRequestFromInditationId
  )

  fastify.decorate('deletePasswordChangeRequest', deletePasswordChangeRequest)
  fastify.decorate('addPasswordChangeRequest', addPasswordChangeRequest)
})

declare module 'fastify' {
  export interface FastifyInstance {
    checkIfPasswordChangeRequested: (email: string) => Promise<boolean>
    getPasswordChangeRequestFromInditationId: (
      resetPasswordId: string,
    ) => Promise<{ recipientEmail: string } | null>
    deletePasswordChangeRequest: (recipientEmail: string) => Promise<ResetPassword>
    addPasswordChangeRequest: (data: TResetPassword) => Promise<TResetPassword>
  }
}
