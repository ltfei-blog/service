import { Router } from 'express'
import { Users } from '@ltfei-blog/service-db'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'
import { keys } from '@ltfei-blog/service-config'

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

  const users = await Users.findAll({
    attributes: { exclude: ['password'] },
    limit: limit,
    offset: offset,
    order: [[sortBy, sortType]]
  }).catch((err: Error) => {
    res.send({
      status: 500,
      msg: err.message
    })
  })

  const total = await Users.count()

  users &&
    res.send({
      status: 200,
      data: {
        keys: keys.user,
        total,
        list: users.map((e) => e.toJSON())
      }
    })
})

export default router
