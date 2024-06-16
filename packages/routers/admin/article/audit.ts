import { Router } from 'express'
import { ArticlesAudit } from '@ltfei-blog/service-db'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'
import { articlesAudit } from '@ltfei-blog/service-utils/sql/articles'
import { keys } from '@ltfei-blog/service-config'

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
  }).catch((err: Error) => {
    res.send({
      status: 500,
      msg: err.message
    })
  })

  const total = await ArticlesAudit.count()
  const unauditedCount = await ArticlesAudit.count({
    where: {
      status: keys.articlesAudit.status.untreated
    }
  })

  articlesAudit &&
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

router.post('/audit', async (req: Request, res) => {
  const body = req.validateBody<{
    id: number
    cause: string
    status: number
  }>({
    id: Joi.number().integer().min(0).required(),
    cause: Joi.string().allow(''),
    status: Joi.number().integer().min(0).max(100).required()
  })

  if (!body) {
    return res.send({
      status: 403
    })
  }

  const user = req.auth

  const { cause, id, status } = body

  if (status == 1) {
    await articlesAudit(id, status, cause, user.id)
  } else {
    await ArticlesAudit.update(
      {
        cause,
        status
      },
      {
        where: {
          id
        }
      }
    )
  }

  res.send({
    status: 200
  })
})

export default router
