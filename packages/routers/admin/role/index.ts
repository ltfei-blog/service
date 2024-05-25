import { Router } from 'express'
import group from './group'
import permissons from './permissons'
import permissonsList from './permissonsList'

const router = Router()

router.use('/group', group)
router.use('/permissons', permissons)
router.use('/permissonsList', permissonsList)

export default router
