import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import { Users, sequelize } from '@ltfei-blog/service-db'

const router = Router()

router.post('/', async (req: Request, res) => {
  const auth = req.auth
  const result = await Users.findOne({
    attributes: [
      'id',
      'username',
      'avatar',
      'city',
      'gender',
      'desc',
      'register_date',
      'last_login_date',
      'status',
      'avatar_pendant',
      [
        // 统计获赞
        sequelize.literal(
          `(SELECT COUNT(likes.id) AS likes_count
          FROM articles
                   LEFT JOIN likes ON articles.id = likes.articles
          WHERE articles.author = users.id
            AND likes.liked = 1
          GROUP BY articles.author)`
        ),
        'get_likes'
      ],
      // 统计粉丝
      [
        sequelize.literal(
          `(select count(*) from follows where status=1 and target_user_id = users.id)`
        ),
        'followers'
      ],
      // 统计关注
      [
        sequelize.literal(
          `(select count(*) from follows where status=1 and user_id = users.id)`
        ),
        'following'
      ]
    ],
    where: {
      id: auth.id
    }
  })
  if (!result) {
    return res.send({
      status: 4001
    })
  }

  const user = result.toJSON()

  res.send({
    status: 200,
    data: user
  })
})

export default router
