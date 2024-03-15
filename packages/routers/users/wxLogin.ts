import { Router } from 'express'
import Joi from 'joi'
import { checkLogin } from '@ltfei-blog/service-utils/wx/checkLogin'
import { findOrCreateUser } from '@ltfei-blog/service-utils/findOrCreateUser'
import { createUserToken } from '@ltfei-blog/service-utils/token'
import { getUnlimited } from '@ltfei-blog/service-utils/wx/getUnlimited'
import { loginStatus, LoginQueue } from '@ltfei-blog/service-db'
import type { LoginRequest } from '@ltfei-blog/service-router/types'
import { checkUuid, generateRandomString } from '@ltfei-blog/service-utils/loginApi'
import { getConfig } from '@ltfei-blog/service-config'

const router = Router()

/**
 * 微信小程序单独登录的init
 */
router.post('/init', async (req, res) => {
  const { enable } = await getConfig('login_method', 'wx_miniprogram')
  if (!enable) {
    return res.send({
      status: 403,
      msg: '已禁止使用微信小程序登录'
    })
  }
  const uuid = generateRandomString()
  await LoginQueue.create({
    status: loginStatus.scanCode,
    date: Date.now(),
    uuid,
    ineffective: false
  })

  res.send({
    status: 200,
    data: {
      uuid
    }
  })
})

interface Body {
  /**
   * 微信小程序 调用 wx.login 获取的code
   */
  code: string
  uuid: string
}

const schema = Joi.object({
  code: Joi.string().length(32).required(),
  uuid: Joi.string().max(32)
})

/**
 * 小程序登录(仅在小程序调用)
 */
router.post('/login', checkUuid(loginStatus.scanCode), async (req: LoginRequest, res) => {
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

  const userId = user.toJSON().id
  // 修改登录状态
  await req.UpdataLoginQueue({
    status: loginStatus.loginSucceed,
    user_id: userId,
    auth_method: 'wx_miniprogram'
  })

  const token = await createUserToken({
    id: userId
  })

  res.send({
    status: 200,
    data: {
      token,
      type: created ? 'register' : 'login'
    }
  })
})

router.post(
  '/getQrCode',
  checkUuid(loginStatus.notLogin),
  async (req: LoginRequest, res) => {
    const { uuid } = req.body

    const buffer = await getUnlimited(uuid)

    res.type('image/jpeg')
    res.send(buffer)
  }
)

/**
 * 检测 scene 是否有效，并修改状态为已扫码
 */
router.post(
  '/checkScene',
  checkUuid(loginStatus.notLogin),
  async (req: LoginRequest, res) => {
    await req.UpdataLoginQueue({
      status: loginStatus.scanCode
    })

    return res.send({
      status: 200
    })
  }
)

export default router
