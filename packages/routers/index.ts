import users from './users'
import articles from './articles'
import upload from './upload'
import { Router } from 'express'

const router = Router()

router.use('/users', users)
router.use('/articles', articles)
router.use(upload)

export default router
