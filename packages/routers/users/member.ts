import { Router } from 'express'
import { Users, Articles, Likes, sequelize } from '@ltfei-blog/service-db'
import { Op } from 'sequelize'
import type { Request } from '@ltfei-blog/service-app/types'

const router = Router()

router.post('/get', async (req: Request, res) => {
  // todo: 验证id
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

/**
 * 获取用户投稿的作品
 */
router.post('/getPost', async (req: Request, res) => {
  // todo: 验证id
  const { id = req.auth?.id, laseMinTime = Date.now() } = req.body
  if (!id) {
    return res.send({
      status: 403
    })
  }

  const articles = await Articles.findAll({
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
    where: {
      author: id,
      status: 1,
      create_time: {
        [Op.lt]: laseMinTime
      }
    },
    include: [
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
    limit: 20
  })

  res.send({
    status: 200,
    data: articles
  })
})

export default router
