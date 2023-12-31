import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import { Articles, Users, Likes, sequelize } from '@ltfei-blog/service-db'

const router = Router()

router.post('/:id', async (req: Request, res) => {
  const { id } = req.params
  const auth = req.auth
  if (!id) {
    return res.send({
      status: 403
    })
  }
  const results = await Articles.findOne({
    attributes: [
      'id',
      'title',
      'content',
      'cover',
      'desc',
      'status',
      'author',
      'create_time',
      'last_edit_time',
      [sequelize.fn('sum', sequelize.col('likes_data.liked')), 'likes_count'],
      [sequelize.col('liked_data.liked'), 'liked']
    ],
    where: {
      status: 1,
      id
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
        required: false,
        where: {
          liked: 1
        }
      },
      {
        model: Likes,
        as: 'liked_data',
        attributes: [],
        required: false,
        where: {
          user: auth?.id || 0
        }
      }
    ],
    group: ['articles.id']
  })

  if (!results) {
    return res.send({
      status: 404
    })
  }

  res.send({
    status: 200,
    data: results.toJSON()
  })
})

export default router
