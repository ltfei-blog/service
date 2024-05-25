import { Router } from 'express'
import {
  getPermissionGroupPermissions,
  setPermission
} from '@ltfei-blog/service-permission'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'

const router = Router()

router.get('/', async (req, res) => {
  const id = req.query.id as string

  if (Number.isNaN(Number(id))) {
    return res.send({
      status: 403
    })
  }

  const permissions = await getPermissionGroupPermissions(Number(id))

  res.send({
    status: 200,
    data: permissions
  })
})

router.put('/', async (req: Request, res) => {
  const body = req.validateBody<{
    group: number
    key: string
    value: number
  }>({
    group: Joi.number().integer().min(1).required(),
    key: Joi.string().required(),
    value: Joi.number().integer().min(0).required()
  })

  if (!body) {
    return res.send({
      status: 403
    })
  }

  const { group, key, value } = body

  await setPermission(group, key, value)

  res.send({
    status: 200
  })
})

export default router
