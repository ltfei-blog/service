import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'
import { CommentLikes } from '@ltfei-blog/service-db'

const router = Router()

interface Body {
  commentId: number
  like: boolean
}

const schema = Joi.object({
  commentId: Joi.number().required(),
  like: Joi.boolean().required()
})

router.post('/like', async (req: Request, res) => {
  const validate = schema.validate(req.body)

  if (validate.error) {
    return res.send({
      status: 403
    })
  }
  const auth = req.auth
  const { commentId, like } = req.body as Body

  const [comment, create] = await CommentLikes.findOrCreate({
    defaults: {
      comment: commentId,
      user: auth.id,
      liked: like,
      create_time: Date.now()
    },
    where: {
      user: auth.id,
      comment: commentId
    }
  })
  // 没有点赞过，已经插入了新数据
  if (create) {
    return res.send({ status: 200 })
  }
  comment.set({
    liked: like
  })
  comment.save()
  return res.send({ status: 200 })
})

export default router
