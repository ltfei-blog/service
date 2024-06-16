import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'
import { Articles, Users, sequelize } from '@ltfei-blog/service-db'
import { Op } from 'sequelize'
import { keys } from '@ltfei-blog/service-config'

const router = Router()

router.post('/search', async (req: Request, res) => {
  const body = req.validateBody<{
    keyword: string
  }>({
    keyword: Joi.string().min(1).max(50).required()
  })

  if (!body) {
    return res.send({
      status: 403
    })
  }

  const { keyword } = body

  const articles = await Articles.findAll({
    attributes: [
      'id',
      'title',
      // 'content',
      'cover',
      'desc',
      'status',
      'author',
      'create_time',
      'last_edit_time',
      [
        sequelize.literal(
          `(select count(likes_count.id) from likes likes_count where likes_count.articles = articles.id)`
        ),
        'likes_count'
      ],
      [
        sequelize.literal(
          `(select count(comments.id) from comments where comments.article_id = articles.id)`
        ),
        'comments_count'
      ]
    ],
    include: [
      {
        model: Users,
        as: 'author_data'
      }
    ],
    where: {
      status: keys.status.normal,
      [Op.or]: {
        content: {
          // 会自动转义特殊字符
          // abc%' or 1=1 --  => LIKE '%abc%\\' or 1=1 -- %') AND
          [Op.like]: `%${keyword}%`
        },
        title: {
          [Op.like]: `%${keyword}%`
        }
      }
    },
    group: ['articles.id']
  })

  res.send({
    status: 200,
    data: articles
  })
})

export default router
