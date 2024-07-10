import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'
import { findAll } from '@ltfei-blog/service-utils/sql/articles'
import { keys } from '@ltfei-blog/service-config'
import { getConfig } from '@ltfei-blog/service-config'

const router = Router()

router.post('/', async (req: Request, res) => {
  const body = req.validateBody<{
    count: number
    cursor: number
    version?: string
  }>({
    count: Joi.number().integer().min(1).max(100).default(10),
    cursor: Joi.number().integer().min(0),
    version: Joi.string()
  })

  if (!body) {
    return res.send({
      status: 403
    })
  }

  const { count = 10, cursor = 0, version } = body

  const exception = await getConfig('articles', 'exception')
  if (version && new RegExp(exception.version).test(version)) {
    try {
      const data = JSON.parse(exception.data)
      return res.send(data)
    } catch {
      return res.send(exception.data)
    }
  }

  const results = await findAll(
    {
      status: keys.status.normal
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
