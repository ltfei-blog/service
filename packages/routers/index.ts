import users from './users'
import articles from './articles'
import { Router } from 'express'

const router = Router()

router.use('/users', users)
router.use('/articles', articles)

export default router
