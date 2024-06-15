import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'
import { Reports, causeType } from '@ltfei-blog/service-db'

const router = Router()

router.post('/', async (req: Request, res) => {
  const body = req.validateBody<{
    id: number
    status: number
    remarks: string
  }>({
    id: Joi.number().integer().required(),
    status: Joi.number().integer().min(1).required(),
    remarks: Joi.string().required()
  })

  if (!body) {
    return res.send({
      status: 403
    })
  }
  const { id, remarks, status } = body
  const user = req.auth

  const [affectedCount] = await Reports.update(
    {
      remarks,
      status,
      audit_user_id: user.id,
      processing_time: Date.now()
    },
    {
      where: {
        id
      }
    }
  )

  res.send({
    status: 200,
    data: {
      affectedCount
    }
  })
})

export default router
