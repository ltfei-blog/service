import { Router } from 'express'
import publish from './publish'
import list from './list'
import like from './like'

const router = Router()

router.use(publish)
router.use(list)
router.use(like)

export default router
