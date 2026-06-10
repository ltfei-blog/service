import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'
import { Users } from '@ltfei-blog/service-db'
import { encrypion } from '@ltfei-blog/service-utils/encrypion'

const router = Router()

/**
 * 设置/修改 密码
 */
router.post('/', async (req: Request, res) => {
  const body = req.validateBody<{
    oldPassword: string | null
    newPassword: string
  }>({
    oldPassword: Joi.string().min(6).max(20).allow(null).required(),
    newPassword: Joi.string().regex(RegExp('^(?=.*[A-Za-z])(?=.*\\d).{6,20}$')).required()
  })
  if (!body) {
    return res.send({
      status: 403
    })
  }

  if (body.oldPassword === body.newPassword) {
    return res.send({
      status: 403,
      msg: '新密码不能与旧密码相同'
    })
  }

  const user = await Users.findOne({
    attributes: ['id', 'password'],
    where: {
      id: req.auth.id
    }
  })

  // 密码非空 验证旧密码
  if (
    user.toJSON().password !== null &&
    user.toJSON().password !== encrypion(body.oldPassword)
  ) {
    return res.send({
      status: 403,
      msg: '密码错误'
    })
  }

  // 设置新密码

  await user.update({
    password: encrypion(body.newPassword)
  })

  res.send({
    status: 200
  })
})

export default router
