import { Router } from 'express'
import init from './init'
import save from './save'
import publish from './publish'

const router = Router()

router.use('/init', init)
router.use('/save', save)
router.use('/publish', publish)

export default router
