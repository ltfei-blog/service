import { Router } from 'express'
import { auth, PERMISSIONS } from '@ltfei-blog/service-permission'
import list from './list'
import findOne from './findOne'
import update from './update'

const router = Router()

router.use('/list', auth(PERMISSIONS.admin_userList), list)
router.use('/findOne', auth(PERMISSIONS.admin_userList), findOne)
router.use('/update', auth(PERMISSIONS.admin_userUpdate), update)

export default router
