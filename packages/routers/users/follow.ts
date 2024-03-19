import { Router } from 'express'
import { Follow, Users } from '@ltfei-blog/service-db'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'

const router = Router()

router.post('/follow', async (req: Request, res) => {
  const body = req.validateBody<{
    target: number
  }>({
    target: Joi.number().required()
  })

  if (!body) {
    return res.send({
      status: 403
    })
  }

  const { target } = body
  const { id } = req.auth

  if (target == id) {
    return res.send({
      status: 403,
      msg: '不能关注自己'
    })
  }

  // 目标用户状态
  const targetUser = await Users.findOne({
    where: {
      id: target
    }
  })

  if (!targetUser || targetUser.toJSON().status != 1) {
    return res.send({
      status: 403,
      msg: '用户状态异常'
    })
  }

  const [follow, create] = await Follow.findOrCreate({
    where: {
      user_id: id,
      target_user_id: target
    },
    defaults: {
      user_id: id,
      target_user_id: target,
      create_time: Date.now()
    }
  })

  await follow.update({
    status: true,
    last_edit_time: Date.now()
  })

  res.send({
    status: 200
  })
})
router.post('/unFollow', async (req: Request, res) => {
  const body = req.validateBody<{
    target: number
  }>({
    target: Joi.number().required()
  })

  if (!body) {
    return res.send({
      status: 403
    })
  }

  const { target } = body
  const { id } = req.auth

  const follow = await Follow.findOne({
    where: {
      target_user_id: target,
      user_id: id
    }
  })

  await follow.update({
    status: false,
    last_edit_time: Date.now()
  })

  res.send({
    status: 200
  })
})

export default router
