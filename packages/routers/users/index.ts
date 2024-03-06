import { Router } from 'express'
import login from './login'
import wxLogin from './wxLogin'
import userInfo from './userInfo'
import { auth, PERMISSIONS } from '@ltfei-blog/service-permission'

const router = Router()

router.use(
  '/login',
  //  auth(PERMISSIONS.userLogin_login),
  login
)
router.use(
  '/wxLogin',
  // auth(PERMISSIONS.userLogin_login),
  // auth(PERMISSIONS.userLogin_wxLogin),
  wxLogin
)
router.use('/userInfo', userInfo)

export default router
