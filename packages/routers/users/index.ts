import { Router } from 'express'
import login from './login'
import userInfo from './userInfo'
import { auth, PERMISSIONS } from '@ltfei-blog/service-permission'

const router = Router()

router.use('/login', auth(PERMISSIONS.userLogin_login), login)
router.use('/userInfo', userInfo)

export default router
