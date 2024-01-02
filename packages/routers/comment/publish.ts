import { Router } from 'express'
import Joi from 'joi'
import type { Request } from '@ltfei-blog/service-app/types'
import { Comments } from '@ltfei-blog/service-db'

const router = Router()

interface Body {
  content: string
  replyId: number
  commentId: number
  articleId: number
}

const schema = Joi.object({
  content: Joi.string().min(2).max(1000).required(),
  replyId: Joi.number(),
  commentId: Joi.number(),
  articleId: Joi.number().required()
})

router.post('/publish', async (req: Request, res) => {
  const validate = schema.validate(req.body)
  console.log(req.body, validate)

  if (validate.error) {
    return res.send({
      status: 403
    })
  }
  const auth = req.auth
  // todo: 验证文章状态以及用户访问文章的权限，验证回复的评论的状态

  const { content, commentId, replyId, articleId } = req.body as Body

  await Comments.create({
    content,
    user_id: auth.id,
    article_id: articleId,
    reply_id: replyId,
    comment_id: commentId,
    create_time: Date.now()
  })

  res.send({
    status: 200
  })
})

export default router
