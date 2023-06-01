import fp from 'fastify-plugin'
import { type Invitation } from '@prisma/client'

import { type TInvitation } from '../../ts/types/user.type'

export default fp(async (fastify, opts) => {
  async function checkIfInvited (email: string): Promise<boolean> {
    const invitedPerson = await fastify.prisma.invitation.findUnique({
      where: {
        recipientEmail: email
      },
      select: {
        invitationId: true
      }
    })

    return (invitedPerson != null)
  }

  async function addInvitation (data: TInvitation): Promise<Invitation> {
    return await fastify.prisma.invitation.create({ data })
  }

  async function deleteInvitation (recipientEmail: string): Promise<Invitation> {
    return await fastify.prisma.invitation.delete({
      where: {
        recipientEmail
      }
    })
  }

  async function getInvitationDetailsFromInditationId (
    invitationId: string
  ): Promise<{
      recipientEmail: string
    } | null> {
    return await fastify.prisma.invitation.findUnique({
      where: {
        hashedPassKey: invitationId
      },
      select: {
        recipientEmail: true
      }
    })
  }

  fastify.decorate('checkIfInvited', checkIfInvited)
  fastify.decorate('getInvitationDetailsFromInditationId', getInvitationDetailsFromInditationId)

  fastify.decorate('deleteInvitation', deleteInvitation)
  fastify.decorate('addInvitation', addInvitation)
})

declare module 'fastify' {
  export interface FastifyInstance {
    checkIfInvited: (email: string) => Promise<boolean>
    getInvitationDetailsFromInditationId: (invitationId: string) => Promise<{ recipientEmail: string } | null>
    deleteInvitation: (recipientEmail: string) => Promise<Invitation>
    addInvitation: (data: TInvitation) => Promise<TInvitation>
  }
}
