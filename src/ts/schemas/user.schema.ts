import { Type } from '@sinclair/typebox'

export const SInvitation = Type.Object({
  email: Type.String()
})

export const SGetRoles = Type.Object({
  userId: Type.Integer()
})

export const SAddUser = Type.Object({
  name: Type.String(),
  email: Type.String(),
  password: Type.String()
})

export const SUpdatePassword = Type.Object({
  email: Type.String(),
  password: Type.String()
})

export const SUserID = Type.Object({
  id: Type.Number()
})

export const SAddPermission = Type.Object({
  roleName: Type.String()
  // permissions: Type.String()
})

export const SEditPermission = Type.Object({
  roleId: Type.Number(),
  permissions: Type.String()
})

export const SGetPermissions = Type.Object({
  roleId: Type.Integer()
})

export const SGetPaginatedPermissions = Type.Object({
  limit: Type.Integer(),
  offset: Type.Integer()
})

export const SEditRole = Type.Object({
  userId: Type.Integer(),
  roles: Type.Array(Type.Number())
})

export const SGetSpecificUsers = Type.Object({
  limit: Type.Number({ default: 50 }),
  offset: Type.Number({ default: 0 })
})
