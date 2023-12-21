import { Router } from 'express'
import { Likes } from '@ltfei-blog/service-db'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'

const router = Router()

const schema = Joi.object({
  articles: Joi.number().required()
})
router.post('/', async (req: Request, res) => {
  const { articles } = req.body
  const auth = req.auth

  /**
   * 验证参数
   */
  const validate = schema.validate(req.body)
  if (validate.error) {
    return res.send({
      status: 403
    })
  }

  const isLiked = await Likes.findOne({
    where: {
      articles,
      user: auth.id
    }
  })

  // 曾经点赞过，直接修改点赞状态
  if (isLiked) {
    const { liked, id } = isLiked.toJSON()
    await Likes.update(
      {
        liked: !liked,
        last_edit_time: Date.now()
      },
      {
        where: {
          id
        }
      }
    )

    return res.send({
      status: 200,
      data: {
        liked: !liked
      }
    })
  }

  const like = await Likes.create({
    articles,
    create_time: Date.now(),
    liked: true,
    user: auth.id
  })
  const { liked } = like.toJSON()
  res.send({
    status: 200,
    data: {
      liked
    }
  })
})

export default router
