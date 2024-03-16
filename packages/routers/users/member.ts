import { Router } from 'express'
import { Users, sequelize } from '@ltfei-blog/service-db'
import type { Request } from '@ltfei-blog/service-app/types'

const router = Router()

router.post('/get', async (req: Request, res) => {
  const { id = req.auth.id } = req.body

  if (!id) {
    return res.send({
      status: 403
    })
  }

  const user = await Users.findOne({
    attributes: [
      'id',
      'username',
      'avatar',
      'city',
      'gender',
      'register_date',
      'status',
      'avatar_pendant',
      // 统计获赞
      [
        sequelize.literal(
          `(SELECT COUNT(likes.id) AS likes_count
          FROM articles
                   LEFT JOIN likes ON articles.id = likes.articles
          WHERE articles.author = ${id}
            AND likes.liked = 1
          GROUP BY articles.author)`
        ),
        'get_likes'
      ]
      // todo: 统计 关注 粉丝 等
    ],
    where: {
      id
    }
  })

  res.send({
    status: 200,
    data: user
  })
})

export default router
