import users from './users'
import articles from './articles'
import upload from './upload'
import comment from './comment'
import { Router } from 'express'

const router = Router()

router.use('/users', users)
router.use('/articles', articles)
router.use('/comment', comment)
router.use(upload)

export default router
