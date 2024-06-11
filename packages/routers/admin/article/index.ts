import { Router } from 'express'
import list from './list'
import audit from './audit'
import { auth, PERMISSIONS } from '@ltfei-blog/service-permission'

const router = Router()

router.use('/list', auth(PERMISSIONS.admin_articleList), list)
router.use('/audit', auth(PERMISSIONS.admin_articleAudit), audit)

export default router
