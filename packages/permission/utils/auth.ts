import type { Response, NextFunction } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import { Permission } from './permissionsList'
import { getUserPermission } from './getUserPermission'

/**
 * express中间件 验证权限
 */
export const auth = (permissionKey: Permission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.auth
    if (!user) {
      return res.send({
        status: 4001
      })
    }

    const permission = await getUserPermission(user.id, permissionKey)

    if (permission == 1) {
      next()
    } else {
      return res.send({
        status: 403
      })
    }
  }
}
