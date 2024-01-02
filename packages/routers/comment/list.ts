import { Router } from 'express'
import Joi from 'joi'
import type { Request } from '@ltfei-blog/service-app/types'
import { Comments } from '@ltfei-blog/service-db'

const router = Router()

const schema = Joi.object({
  articleId: Joi.number().required()
})

router.post('/list', (req, res) => {})

export default router
