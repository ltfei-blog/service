import { Router } from 'express'
import userInfo from './userInfo'
import editUserInfo from './editUserInfo'
import member from './member'
import follow from './follow'
import { auth, PERMISSIONS } from '@ltfei-blog/service-permission'

const router = Router()

router.use('/userInfo', userInfo)
router.use('/member', member)
router.use(follow)
router.use(auth(PERMISSIONS.userOperation_updateUserinfo), editUserInfo)

export default router
