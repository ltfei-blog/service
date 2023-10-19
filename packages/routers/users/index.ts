import { Router } from 'express'
import login from './login'
import userInfo from './userInfo'

const router = Router()

router.use('/login', login)
router.use('/userInfo', userInfo)

export default router
