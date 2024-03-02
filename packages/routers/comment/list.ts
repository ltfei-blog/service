import { Router } from 'express'
import Joi from 'joi'
import type { Request } from '@ltfei-blog/service-app/types'
import { Comments, CommentLikes, Users, sequelize } from '@ltfei-blog/service-db'
import { mapComments } from '@ltfei-blog/service-utils/mapComments'

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

  console.log(auth)

  const { articleId } = req.body as Body

  const comments = await Comments.findAll({
    attributes: [
      'id',
      'content',
      'user_id',
      'article_id',
      'reply_id',
      'comment_id',
      'status',
      'create_time',
      'last_edit_time',
      [sequelize.fn('count', sequelize.col('reply_data.id')), 'reply_count'],
      [sequelize.fn('count', sequelize.col('likes_data.liked')), 'likes_count'],
      [sequelize.col('liked_data.liked'), 'liked']
    ],
    where: {
      article_id: articleId
    },
    include: [
      {
        model: Users,
        as: 'sender',
        attributes: ['id', 'username', 'avatar', 'avatar_pendant']
      },
      {
        model: Comments,
        as: 'reply_data',
        attributes: [],
        required: false
      },
      {
        model: CommentLikes,
        as: 'likes_data',
        attributes: [],
        where: {
          liked: 1
        },
        required: false
      },
      {
        model: CommentLikes,
        as: 'liked_data',
        attributes: [],
        required: false,
        where: {
          user: auth?.id || 0
        }
      }
    ],
    group: ['comments.id', 'liked_data.id'],
    order: [['create_time', 'DESC']]
    // todo: 先获取全部评论
    // limit: 20
  })

  res.send({
    status: 200,
    data: mapComments(comments.map((e) => e.toJSON()))
  })
})

export default router
