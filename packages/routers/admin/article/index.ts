import { Router } from 'express'
import list from './list'
import audit from './audit'
import detail from './detail'
import update from './update'
import { auth, PERMISSIONS } from '@ltfei-blog/service-permission'

const router = Router()

router.use('/list', auth(PERMISSIONS.admin_articleList), list)
router.use('/update', auth(PERMISSIONS.admin_articleUpdate), update)
router.use('/detail', auth(PERMISSIONS.admin_articleList), detail)
router.use('/audit', auth(PERMISSIONS.admin_articleAudit), audit)

export default router
