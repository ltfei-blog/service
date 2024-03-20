import { Router } from 'express'
import init from './init'
import save from './save'
import publish from './publish'
import list from './list'
import details from './details'
import like from './like'
import search from './search'
import { auth, PERMISSIONS } from '@ltfei-blog/service-permission'

const router = Router()

router.use('/init', init)
router.use('/save', auth(PERMISSIONS.creator_saveDraft), save)
router.use('/publish', auth(PERMISSIONS.creator_publishArticle), publish)
router.use('/list', list)
router.use('/details', details)
router.use('/like', auth(PERMISSIONS.contentOperation_like), like)
router.use(search)

export default router
