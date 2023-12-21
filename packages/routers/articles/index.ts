import { Router } from 'express'
import init from './init'
import save from './save'
import publish from './publish'
import list from './list'
import details from './details'
import like from './like'

const router = Router()

router.use('/init', init)
router.use('/save', save)
router.use('/publish', publish)
router.use('/list', list)
router.use('/details', details)
router.use('/like', like)

export default router
