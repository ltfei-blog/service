import { Router } from 'express'
import { auth, PERMISSIONS } from '@ltfei-blog/service-permission'
import dashboard from './dashboard/'
import users from './users/'

const router = Router()

router.use('*', auth(PERMISSIONS.admin_login))
router.use('/dashboard', dashboard)
router.use('/users', auth(PERMISSIONS.admin_user), users)

export default router
