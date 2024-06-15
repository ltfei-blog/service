import { Router } from 'express'
import { auth, PERMISSIONS } from '@ltfei-blog/service-permission'
import dashboard from './dashboard/'
import users from './users/'
import role from './role/'
import article from './article/'
import report from './report/'
import comment from './comment/'

const router = Router()

router.use('*', auth(PERMISSIONS.admin_login))
router.use('/dashboard', dashboard)
router.use('/users', auth(PERMISSIONS.admin_user), users)
router.use('/role', auth(PERMISSIONS.admin_role), role)
router.use('/article', auth(PERMISSIONS.admin_article), article)
router.use('/report', auth(PERMISSIONS.admin_reportProcessing), report)
router.use('/comment', auth(PERMISSIONS.admin_comment), comment)

export default router
