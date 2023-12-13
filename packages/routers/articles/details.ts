import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import { Articles, Users } from '@ltfei-blog/service-db'

const router = Router()

router.post('/:id', async (req: Request, res) => {
  const { id } = req.params
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
      'last_edit_time'
    ],
    where: {
      status: 1,
      id
    },
    include: [
      {
        model: Users,
        as: 'author_data'
      }
    ]
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
