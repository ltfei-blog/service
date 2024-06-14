import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import { Reports, causeType } from '@ltfei-blog/service-db'
import Joi from 'joi'

const router = Router()

router.get('/getCauseType', (req, res) => {
  res.send({
    status: 200,
    data: causeType
  })
})

router.post('/', async (req: Request, res) => {
  const body = req.validateBody<{
    type: 'article' | 'comment' | 'user'
    cause: number
    report_id: number
    desc: string
  }>({
    type: Joi.string().valid('article', 'comment', 'user').required(),
    cause: Joi.number().integer().required(),
    report_id: Joi.number().integer().required(),
    desc: Joi.string().min(1).max(100)
  })

  if (!body) {
    return res.send({
      status: 403
    })
  }

  const { cause, report_id, type, desc } = body

  const user = req.auth

  await Reports.findOrCreate({
    defaults: {
      report_id,
      type,
      originator_id: user.id,
      cause,
      create_time: Date.now(),
      desc
    },
    where: {
      report_id,
      type,
      originator_id: user.id
    }
  })

  return res.send({
    status: 200
  })
})

export default router
