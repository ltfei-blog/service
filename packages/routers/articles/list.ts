import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import { Articles, Users } from '@ltfei-blog/service-db'

const router = Router()

router.post('/', async (req, res) => {
  // todo: 分页查询
  const results = await Articles.findAll({
    where: {
      status: 1
    },
    include: [
      {
        model: Users,
        as: 'author_data'
      }
    ]
    // 禁用包装器
    // raw: true
  })

  res.send({
    status: 200,
    data: results.map((e) => e.toJSON())
  })
})

export default router
