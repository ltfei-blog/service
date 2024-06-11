import { Router } from 'express'
import { ArticlesAudit } from '@ltfei-blog/service-db'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'

const router = Router()

router.post('/list', async (req: Request, res) => {
  const body = req.validateBody<{
    limit: number
    offset: number
    sortBy: string
    sortType: 'DESC' | 'ASC'
  }>({
    limit: Joi.number().min(0).max(100).default(20),
    offset: Joi.number().min(0).default(0),
    sortBy: Joi.string().default('status'),
    sortType: Joi.string().valid('DESC', 'ASC').default('ASC')
  })

  if (!body) {
    return res.send({
      status: 403
    })
  }

  const { limit, offset, sortBy, sortType } = body

  const articlesAudit = await ArticlesAudit.findAll({
    attributes: { exclude: ['content'] },
    limit: limit,
    offset: offset,
    order: [[sortBy, sortType]]
  })

  const total = await ArticlesAudit.count()
  const unauditedCount = await ArticlesAudit.count({
    where: {
      status: 0
    }
  })

  res.send({
    status: 200,
    data: {
      total,
      unauditedCount,
      list: articlesAudit.map((e) => e.toJSON())
    }
  })
})

router.get('/detail', async (req, res) => {
  const id = req.query.id as string
  if (!id) {
    return res.send({
      status: 403
    })
  }

  const articles = await ArticlesAudit.findOne({
    where: {
      id
    }
  })

  res.send({
    status: 200,
    data: articles
  })
})

export default router
