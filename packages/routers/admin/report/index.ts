import { Router } from 'express'
import list from './list'
import update from './update'

const router = Router()

router.use('/list', list)
router.use('/update', update)

export default router
