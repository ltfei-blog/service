import { Router } from 'express'
import list from './list'
import { auth, PERMISSIONS } from '@ltfei-blog/service-permission'

const router = Router()

router.use('/list', auth(PERMISSIONS.admin_articleList), list)

export default router
