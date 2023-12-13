import { Router } from 'express'
import init from './init'
import save from './save'
import publish from './publish'
import list from './list'
import details from './details'

const router = Router()

router.use('/init', init)
router.use('/save', save)
router.use('/publish', publish)
router.use('/list', list)
router.use('/details', details)

export default router
