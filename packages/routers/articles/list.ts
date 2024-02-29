import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import { Articles, Users, Likes, Comments, sequelize } from '@ltfei-blog/service-db'

const router = Router()

router.post('/', async (req: Request, res) => {
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
      [sequelize.fn('count', sequelize.col('comment_count.id')), 'comments_count']
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
      },
      {
        model: Comments,
        as: 'comment_count',
        attributes: [],
        required: false
      }
    ],
    group: ['articles.id']
    // 禁用包装器
    // raw: true
  })

  console.log(results)

  res.send({
    status: 200,
    data: results.map((e) => e.toJSON())
  })
})

export default router
