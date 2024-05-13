import login from './login'
import users from './users'
import articles from './articles'
import upload from './upload'
import comment from './comment'
import admin from './admin'
import { Router } from 'express'

const router = Router()

router.use('/login', login)
router.use('/users', users)
router.use('/articles', articles)
router.use('/comment', comment)
router.use('/admin', admin)
router.use(upload)

export default router
