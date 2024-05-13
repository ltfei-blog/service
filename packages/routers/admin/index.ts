import { Router } from 'express'
import { auth, PERMISSIONS } from '@ltfei-blog/service-permission'
import dashboard from './dashboard/'

const router = Router()

router.use('*', auth(PERMISSIONS.admin_login))
router.use('/dashboard', dashboard)

export default router
