import { Router } from 'express'
import init from './init'
import save from './save'

const router = Router()

router.use('/init', init)
router.use('/save', save)

export default router
