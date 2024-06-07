import { Router } from 'express'
import { auth, PERMISSIONS } from '@ltfei-blog/service-permission'
import dashboard from './dashboard/'
import users from './users/'
import role from './role/'
import article from './article/'

const router = Router()

router.use('*', auth(PERMISSIONS.admin_login))
router.use('/dashboard', dashboard)
router.use('/users', auth(PERMISSIONS.admin_user), users)
router.use('/role', auth(PERMISSIONS.admin_role), role)
router.use('/article', auth(PERMISSIONS.admin_article), article)

export default router
