import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import { Articles } from '@ltfei-blog/service-db'

const router = Router()

router.post('/', async (req, res) => {
  // todo: 分页查询
  const results = await Articles.findAll({
    where: {
      status: 1
    },
    // 禁用包装器
    raw: true
  })

  res.send({
    status: 200,
    data: results
  })
})

export default router
