import { Router } from 'express'
import init from './init'
import save from './save'
import publish from './publish'
import list from './list'

const router = Router()

router.use('/init', init)
router.use('/save', save)
router.use('/publish', publish)
router.use('/list', list)

export default router
