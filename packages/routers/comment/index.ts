import { Router } from 'express'
import publish from './publish'
import list from './list'

const router = Router()

router.use(publish)
router.use(list)

export default router
