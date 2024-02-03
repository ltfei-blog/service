import { Router } from 'express'
import Joi from 'joi'
import type { Request } from '@ltfei-blog/service-app/types'
import { Comments, Users, sequelize } from '@ltfei-blog/service-db'
import type { Comment } from '../types'

const router = Router()

const mapComments = (
  comments: {
    id: number
    content: string
    user_id: number
    article_id: number
    reply_id?: number
    comment_id: number
    status?: any
    create_time: number
    last_edit_time?: any
    reply_count?: number
    sender?: {
      id: number
      username: string
      avatar: string
      avatar_pendant?: any
    }
  }[]
): Comment[] => {
  const results: Comment[] = []

  comments.forEach((e) => {
    // 回复id为0的是主评论
    console.log(e.reply_id)

    if (e.reply_id) {
      const result = results.find((result) => {
        return result.id == e.comment_id
      })
      if (!result) {
        return
      }
      result.reply?.push({
        id: e.id,
        content: e.content,
        date: e.create_time.toString(),
        userId: e.sender.id,
        avatar: e.sender.avatar,
        username: e.sender.username,
        likeCount: 0,
        liked: false,
        isAuthor: false,
        replyCommentId: e.comment_id,
        replyToReplyId: e.reply_count,
        replyCount: e.reply_count
      })
      return
    }
    console.log(results)

    results.push({
      id: e.id,
      content: e.content,
      date: e.create_time.toString(),
      userId: e.sender.id,
      avatar: e.sender.avatar,
      username: e.sender.username,
      likeCount: 0,
      liked: false,
      isAuthor: false,
      reply: []
    })
  })

  return results
}

interface Body {
  articleId: number
}

const schema = Joi.object({
  articleId: Joi.number().required()
})

router.post('/list', async (req: Request, res) => {
  const validate = schema.validate(req.body)
  console.log(req.body, validate)

  if (validate.error) {
    return res.send({
      status: 403
    })
  }
  const auth = req.auth
  const { articleId } = req.body as Body
  // todo: 统计被点赞数量
  // todo: 是否点赞
  // todo: 统计回复数量(仅主评论)
  // todo: 是否作者（前端判断
  // todo: 子评论不用统计回复数量

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
      [sequelize.fn('count', sequelize.col('reply_data.id')), 'reply_count']
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
      }
    ],
    group: ['comments.id']
    // todo: 先获取全部评论
    // limit: 20
  })

  res.send({
    status: 200,
    data: mapComments(comments.map((e) => e.toJSON()))
  })
})

export default router
