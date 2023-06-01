export interface TRoutePermissions {
  name: string | string[]
  permission: 'read' | 'write' | 'update' | 'delete'
}

export interface TUser {
  id: number
  name?: string
  email?: string
}

export interface TNavigators {
  svg?: string
  name: string
  link: string
  pagePermission?: string
  selected: boolean
}
