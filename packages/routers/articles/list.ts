import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'
import { findAll } from '@ltfei-blog/service-utils/sql/articles'

const router = Router()

router.post('/', async (req: Request, res) => {
  const body = req.validateBody<{
    count: number
    cursor: number
  }>({
    count: Joi.number().integer().min(1).max(100).default(10),
    cursor: Joi.number().integer().min(0)
  })

  if (!body) {
    return res.send({
      status: 403
    })
  }

  const { count = 10, cursor = 0 } = body

  const results = await findAll(
    {
      status: 1
    },
    Number(cursor),
    Number(count)
  )

  res.send({
    status: 200,
    data: results.map((e) => e.toJSON())
  })
})

export default router
