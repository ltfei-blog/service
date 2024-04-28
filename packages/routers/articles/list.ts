import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import { Articles, Users, Likes, Comments, sequelize } from '@ltfei-blog/service-db'
import { Op } from 'sequelize'
import Joi from 'joi'

const router = Router()

router.post('/', async (req: Request, res) => {
  const body = req.validateBody<{
    count: number
    cursor: number
  }>({
    count: Joi.number().integer().min(1).max(100).default(10),
    cursor: Joi.number().integer().min(0)
  })

  if (!body) {
    return res.send({
      status: 403
    })
  }

  const { count = 10, cursor = 0 } = body

  // todo: 分页查询
  const results = await Articles.findAll({
    attributes: [
      'id',
      'title',
      'cover',
      'desc',
      'status',
      'author',
      'create_time',
      'last_edit_time',
      [sequelize.fn('count', sequelize.col('likes_data.liked')), 'likes_count'],
      [
        sequelize.literal(
          `(select count(comments.id) from comments where comments.article_id = articles.id)`
        ),
        'comments_count'
      ]
    ],

    order: [['create_time', 'DESC']],
    where: {
      status: 1
    },
    include: [
      {
        model: Users,
        as: 'author_data'
      },
      {
        model: Likes,
        as: 'likes_data',
        attributes: [],
        where: {
          liked: 1
        },
        required: false
      }
    ],
    group: ['articles.id'],
    offset: Number(cursor),
    limit: Number(count)
  })

  res.send({
    status: 200,
    data: results.map((e) => e.toJSON())
  })
})

export default router
