import { Router } from 'express'
import Joi from 'joi'
import type { Request } from '@ltfei-blog/service-app/types'
import { mapComments } from '@ltfei-blog/service-utils/mapComments'
import { getComments } from '@ltfei-blog/service-utils/sql/comment'

const router = Router()

router.post('/list', async (req: Request, res) => {
  const body = req.validateBody<{
    articleId: number
  }>({
    articleId: Joi.number().required()
  })

  if (!body) {
    return res.send({
      status: 403
    })
  }
  const auth = req.auth

  const { articleId } = body

  const comments = await getComments(
    {
      article_id: articleId
    },
    auth?.id
  )

  res.send({
    status: 200,
    data: mapComments(comments.map((e) => e.toJSON()))
  })
})

export default router
