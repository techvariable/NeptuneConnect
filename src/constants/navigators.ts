import { type TNavigators } from '../ts/types/other.type'

export const navigators: TNavigators[] = [
  {
    svg: '/public/assets/images/gear.svg',
    name: 'General',
    link: '/settings',
    selected: false
  },
  {
    svg: '/public/assets/images/apikey.svg',
    name: 'API',
    link: '/settings/api-key',
    pagePermission: 'settings',
    selected: false
  },
  {
    svg: '/public/assets/images/logs.svg',
    name: 'Logs',
    link: '/settings/query-logs',
    pagePermission: 'logs',
    selected: false
  },
  {
    svg: '/public/assets/images/permissions.svg',
    name: 'Permissions',
    link: '/settings/permissions',
    pagePermission: 'permissions',
    selected: false
  },
  {
    svg: '/public/assets/images/iconprof.svg',
    name: 'Profile',
    link: '/settings/myprofile',
    pagePermission: 'profile',
    selected: false
  }
]
