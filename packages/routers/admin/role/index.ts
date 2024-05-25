import { Router } from 'express'
import group from './group'

const router = Router()

router.use('/group', group)

export default router
