import { Router } from 'express'
import userInfo from './userInfo'
import editUserInfo from './editUserInfo'
import changePassword from './changePassword'
import member from './member'
import follow from './follow'
import report from './report'
import { auth, PERMISSIONS } from '@ltfei-blog/service-permission'

const router = Router()

router.use('/userInfo', userInfo)
router.use('/member', member)
router.use('/report', report)
router.use(follow)
router.use(auth(PERMISSIONS.userOperation_updateUserinfo), editUserInfo)
router.use('/changePassword', changePassword)

export default router
