import { Router } from 'express'
import Joi from 'joi'
import type { Request } from '@ltfei-blog/service-app/types'
import { mapComments } from '@ltfei-blog/service-utils/mapComments'
import { getComments } from '@ltfei-blog/service-utils/sql/comment'

const router = Router()

interface Body {
  articleId: number
}

const schema = Joi.object({
  articleId: Joi.number().required()
})

router.post('/list', async (req: Request, res) => {
  const validate = schema.validate(req.body)

  if (validate.error) {
    return res.send({
      status: 403
    })
  }
  const auth = req.auth

  const { articleId } = req.body as Body

  const comments = await getComments(
    {
      article_id: articleId
    },
    auth.id
  )

  res.send({
    status: 200,
    data: mapComments(comments.map((e) => e.toJSON()))
  })
})

export default router
