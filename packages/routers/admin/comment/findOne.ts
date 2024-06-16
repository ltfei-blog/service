import { Router } from 'express'
import { Comments } from '@ltfei-blog/service-db'
import type { Request } from '@ltfei-blog/service-app/types'
import { Op } from 'sequelize'
import { mapComments } from '@ltfei-blog/service-utils/mapComments'
import { getComments } from '@ltfei-blog/service-utils/sql/comment'

const router = Router()

/**
 * 获取单条评论(仅支持获取主评论)
 */
router.post('/', async (req: Request, res) => {
  const { id } = req.body
  if (typeof Number(id) != 'number') {
    return res.send({
      status: 403
    })
  }

  const comments = await getComments({
    [Op.or]: [
      {
        comment_id: id
      },
      {
        id
      }
    ]
  })

  const list = mapComments(comments.map((e) => e.toJSON()))

  res.send({
    status: 200,
    data: {
      list
    }
  })
})

export default router
