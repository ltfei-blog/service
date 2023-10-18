import jwt from 'jsonwebtoken'
import { getConfig } from '@ltfei-blog/service-config'
import type { TokenUser } from '@ltfei-blog/service-app/types'

export const createUserToken = async (user: TokenUser) => {
  const secret = await getConfig('app', 'jwtSecret')
  return jwt.sign(user, secret, {
    // todo: 登录有效期配置项
    expiresIn: '7d'
  })
}
