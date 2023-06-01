import { type RouteGenericInterface } from 'fastify/types/route'
import { type FastifyRequest, type FastifyReply } from 'fastify'

import { type TRoutePermissions } from '../ts/types/other.type'

export function checkRolePermission<T extends RouteGenericInterface> (route: TRoutePermissions) {
  return async (req: FastifyRequest<T>, rep: FastifyReply) => {
    const userPermissions = req.user?.permissions ?? []
    if (
      !(
        userPermissions.find((v) => '*' in v && v['*']['*']) != null ||
        userPermissions.find((v) => '*' in v && v['*'][route.permission]) != null ||
        userPermissions.some((v) => {
          if (!Array.isArray(route.name)) {
            return route.name in v && v[route.name][route.permission]
          } else {
            return route.name.some((name) => name in v && v[name][route.permission])
          }
        })
      )
    ) {
      if (req.url.split('/').includes('api')) {
        rep.forbidden("User doesn't have sufficient permissions to perform this operation!")
        return
      }
      return await rep.view('/view/errorPage.ejs', {
        imgurl: `${process.env.APP_URL}`,
        user: JSON.stringify({ name: req.user?.name, email: req.user?.email })
      })
    }
  }
}
