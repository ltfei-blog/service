import { Router } from 'express'
import { Users } from '@ltfei-blog/service-db'
import { Op } from 'sequelize'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'
import { encrypion } from '@ltfei-blog/service-utils/encrypion'
import { createToken } from '@ltfei-blog/service-utils/token'

const router = Router()

/**
 * 使用 用户id / 邮箱(todo: 绑定邮箱) 登录
 */
router.post('/', async (req: Request, res) => {
  const body = req.validateBody<{
    account: string
    password: string
  }>({
    account: Joi.string().max(20).required(),
    password: Joi.string().min(6).max(20).required()
  })

  if (!body) {
    return res.send({
      status: 403
    })
  }

  const user = await Users.findOne({
    attributes: ['id', 'password'],
    where: {
      [Op.or]: {
        id: body.account
      }
    }
  })

  if (!user || user.toJSON().password !== encrypion(body.password)) {
    return res.send({
      status: 401,
      msg: '用户名或密码错误'
    })
  }

  const token = await createToken({
    id: user.toJSON().id
  })

  return res.send({
    status: 200,
    data: token
  })
})

export default router
