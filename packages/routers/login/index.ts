import { Router } from 'express'
import login from './login'
import wxLogin from './wxLogin'
import qqConnectLogin from './qqConnectLogin'
// import { auth, PERMISSIONS } from '@ltfei-blog/service-permission'

const router = Router()

//  todo: 登录的权限控制不应该与用户信息耦合，应该分离到设置里边
router.use(
  '/',
  //  auth(PERMISSIONS.userLogin_login),
  login
)
router.use(
  '/wxLogin',
  // auth(PERMISSIONS.userLogin_login),
  // auth(PERMISSIONS.userLogin_wxLogin),
  wxLogin
)

router.use('/qqConnectLogin', qqConnectLogin)

export default router
