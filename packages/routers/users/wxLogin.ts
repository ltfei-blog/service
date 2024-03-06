import type { Request } from '@ltfei-blog/service-app/types'
import { Router } from 'express'
import Joi from 'joi'
import { checkLogin } from '@ltfei-blog/service-utils/wx/checkLogin'
import { findOrCreateUser } from '@ltfei-blog/service-utils/findOrCreateUser'
import { createUserToken } from '@ltfei-blog/service-utils/token'

const router = Router()

interface Body {
  /**
   * 微信小程序获取的code
   */
  code: string
}

const schema = Joi.object({
  code: Joi.string().length(32).required()
})

router.post('/login', async (req: Request, res) => {
  const validate = schema.validate(req.body)

  if (validate.error) {
    return res.send({
      status: 403
    })
  }

  const { code } = req.body as Body

  const login = await checkLogin(code)
  if (login.err != false) {
    console.log(login)

    return res.send({
      status: 403
    })
  }

  const { openid, unionid } = login
  const [user, created] = await findOrCreateUser(
    {
      qq_openid: openid,
      wx_unionid: unionid
    },
    {
      username: `微信用户_${openid}`,
      register_date: Date.now(),
      register_ip: req.ip,
      wx_openid: openid,
      wx_unionid: unionid
    }
  )

  const token = await createUserToken({
    id: user.toJSON().id
  })

  res.send({
    status: 200,
    data: {
      token,
      type: created ? 'register' : 'login'
    }
  })
})

export default router
