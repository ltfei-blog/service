import { Router } from 'express'
import { auth, PERMISSIONS } from '@ltfei-blog/service-permission'

import list from './list'

const router = Router()

router.use('/list', auth(PERMISSIONS.admin_commentList), list)

export default router
