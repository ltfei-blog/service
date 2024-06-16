import { Router } from 'express'
import {
  Users,
  Articles,
  Likes,
  sequelize,
  BrowsingHistory
} from '@ltfei-blog/service-db'
import { Op } from 'sequelize'
import type { Request } from '@ltfei-blog/service-app/types'
import joi from 'joi'
import { keys } from '@ltfei-blog/service-config'

const router = Router()

router.post('/get', async (req: Request, res) => {
  const data = req.validateBody<{
    id: number
  }>({
    id: joi.number().required()
  })

  if (!data) {
    return res.send({
      status: 403
    })
  }

  const { id } = data

  const user = await Users.findOne({
    attributes: [
      'id',
      'username',
      'avatar',
      'city',
      'gender',
      'desc',
      'register_date',
      'status',
      'avatar_pendant',
      // 统计获赞
      [
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
      // todo: 统计 关注 等
      // todo: 判断是否已经关注此用户
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
  const data = req.validateBody<{
    id: number
    laseMinTime: number
  }>({
    id: joi.number().required(),
    laseMinTime: joi.number()
  })

  if (!data) {
    return res.send({
      status: 403
    })
  }

  const { id, laseMinTime = Date.now() } = data

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
      status: keys.status.normal,
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

/**
 * 获取用户的喜欢
 */
router.post('/getLikes', async (req: Request, res) => {
  const data = req.validateBody<{
    id: number
    laseMinTime: number
  }>({
    id: joi.number(),
    laseMinTime: joi.number()
  })

  if (!data) {
    return res.send({
      status: 403
    })
  }

  const { laseMinTime = Date.now() } = data

  if (!req.auth) {
    return res.send({
      status: 4001
    })
  }

  const id = req.auth.id
  // todo: 暂时先仅支持获取自己的
  const likes = await Likes.findAll({
    attributes: [
      'id',
      'articles',
      'liked',
      'user',
      'create_time',
      'last_edit_time',
      // [sequelize.fn('count', sequelize.col('likes_data.liked')), 'likes_count'],
      [
        sequelize.literal(
          `(select count(likes_count.id) from likes likes_count where likes_count.articles = likes.articles)`
        ),
        'likes_count'
      ],
      [
        sequelize.literal(
          `(select count(comments.id) from comments where comments.article_id = likes.articles)`
        ),
        'comments_count'
      ]
    ],
    where: {
      user: id,
      liked: 1,
      create_time: {
        [Op.lt]: laseMinTime
      }
    },
    include: [
      {
        model: Articles,
        as: 'user_likes_data',
        required: false,
        where: {
          status: keys.status.normal
        },
        include: [{ model: Users, as: 'author_data' }],
        attributes: [
          'id',
          'title',
          'content',
          'cover',
          'desc',
          'status',
          'author',
          'create_time',
          'last_edit_time'
        ]
      }
    ]
  })

  res.send({
    status: 200,
    data: likes
  })
})

router.post('/getHistory', async (req: Request, res) => {
  const data = req.validateBody<{
    id: number
    laseMinTime: number
  }>({
    id: joi.number(),
    laseMinTime: joi.number()
  })

  if (!data) {
    return res.send({
      status: 403
    })
  }

  const { laseMinTime = Date.now() } = data

  if (!req.auth) {
    return res.send({
      status: 4001
    })
  }

  const id = req.auth.id

  // todo: 暂时仅支持获取自己的
  const browsingHistory = await BrowsingHistory.findAll({
    where: {
      user_id: id
    },
    include: [
      {
        model: Articles,
        as: 'browsing_history_article_data',
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
          [
            sequelize.literal(
              `(select count(likes_count.id) from likes likes_count where likes_count.articles = browsing_history_article_data.id)`
            ),
            'likes_count'
          ],
          [
            sequelize.literal(
              `(select count(comments.id) from comments where comments.article_id = browsing_history_article_data.id)`
            ),
            'comments_count'
          ]
        ],
        include: [
          {
            model: Users,
            as: 'author_data'
          }
        ]
      }
    ]
  })

  res.send({
    status: 200,
    data: browsingHistory
  })
})

export default router
