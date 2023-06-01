import { type Static } from '@sinclair/typebox'
import {
  type SAddUser,
  type SUpdatePassword,
  type SUserID,
  type SGetRoles,
  type SInvitation,
  type SAddPermission,
  type SEditPermission,
  type SEditRole,
  type SGetPermissions,
  type SGetPaginatedPermissions,
  type SGetSpecificUsers
} from '../schemas/user.schema'

export type TInvitationRequest = Static<typeof SInvitation>
export type TAddUserRequest = Static<typeof SAddUser>
export type TUpdatePassword = Static<typeof SUpdatePassword>
export type TUserIdRequest = Static<typeof SUserID>
export type TDeleteUserRequest = Static<typeof SUserID>
export type TGetRoles = Static<typeof SGetRoles>
export type TGetPaginatedUsers = Static<typeof SGetSpecificUsers>
export type TGetPermissions = Static<typeof SGetPermissions>
export type TGetUsers = Static<typeof SGetSpecificUsers>
export type TGetPaginatedPermissions = Static<typeof SGetPaginatedPermissions>
export type TAddPermission = Static<typeof SAddPermission>
export type TEditPermission = Static<typeof SEditPermission>
export type TEditRole = Static<typeof SEditRole>
export interface TUser {
  id: number
  email?: string
  date?: Date
}
export interface TAddUser {
  email: string
  name: string
  password: string
  persistant?: boolean
}
export interface TAPIKey {
  'api-key'?: string
}
export interface TInvitation {
  recipientEmail: string
  hashedPassKey: string
}

export interface TResetPassword {
  recipientEmail: string
  hashedPassKey: string
}
export interface TAddinvitation {
  email: string
}
export interface TAcceptInvitation {
  invitationId: string
}
export interface TResetInvitation {
  resetid: string
}

export interface TDeletePermission {
  isDeleted: boolean
  deletedPermissionId: number | null
  deletedPermissionName: string | null
  usersWithAssignedRole: string[]
}
export interface TGetUserDetails {
  name: string | undefined
  email: string | undefined
}
export interface TGetUserByEmail {
  id: number
  name: string
  email: string
  date: Date
  password: string
  permissions: any
}
