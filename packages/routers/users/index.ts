import { Router } from 'express'
import login from './login'
import wxLogin from './wxLogin'
import userInfo from './userInfo'
import editUserInfo from './editUserInfo'
import member from './member'
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
router.use('/member', member)
router.use(auth(PERMISSIONS.userOperation_updateUserinfo), editUserInfo)

export default router
