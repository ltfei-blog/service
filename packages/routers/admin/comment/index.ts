import { Router } from 'express'
import { auth, PERMISSIONS } from '@ltfei-blog/service-permission'

import list from './list'
import findOne from './findOne'

const router = Router()

router.use('/list', auth(PERMISSIONS.admin_commentList), list)
router.use('/findOne', auth(PERMISSIONS.admin_commentList), findOne)

export default router
