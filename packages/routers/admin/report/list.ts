import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import { Reports, causeType } from '@ltfei-blog/service-db'
import Joi from 'joi'

const router = Router()

router.post('/', async (req: Request, res) => {
  const body = req.validateBody<{
    limit: number
    offset: number
    sortBy: string
    sortType: 'DESC' | 'ASC'
  }>({
    limit: Joi.number().min(0).max(100).default(20),
    offset: Joi.number().min(0).default(0),
    sortBy: Joi.string().default('id'),
    sortType: Joi.string().valid('DESC', 'ASC').default('ASC')
  })

  if (!body) {
    return res.send({
      status: 403
    })
  }
  const { limit, offset, sortBy, sortType } = body

  const reports = await Reports.findAll({
    limit: limit,
    offset: offset,
    order: [[sortBy, sortType]]
  }).catch((err: Error) => {
    res.send({
      status: 500,
      msg: err.message
    })
  })

  const total = await Reports.count()

  reports &&
    res.send({
      status: 200,
      data: {
        list: reports.map((e) => e.toJSON()),
        causeType,
        total
      }
    })
})

export default router
