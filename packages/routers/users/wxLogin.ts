import type { Request } from '@ltfei-blog/service-app/types'
import { Router } from 'express'
import Joi from 'joi'
import { checkLogin } from '@ltfei-blog/service-utils/wx/checkLogin'
import { findOrCreateUser } from '@ltfei-blog/service-utils/findOrCreateUser'
import { createUserToken } from '@ltfei-blog/service-utils/token'
import { getUnlimited } from '@ltfei-blog/service-utils/wx/getUnlimited'
import { loginStatus, LoginQueue } from '@ltfei-blog/service-db'
import { checkUuid } from '@ltfei-blog/service-utils/loginApi'
import type { LoginRequest } from '@ltfei-blog/service-router/types'

const router = Router()

interface Body {
  /**
   * 微信小程序 调用 wx.login 获取的code
   */
  code: string
  scene: string
}

const schema = Joi.object({
  code: Joi.string().length(32).required(),
  scene: Joi.string().max(32)
})

/**
 * 小程序登录(仅在小程序调用)
 */
router.post('/login', async (req: Request, res) => {
  const validate = schema.validate(req.body)

  if (validate.error) {
    return res.send({
      status: 403
    })
  }

  const { code, scene } = req.body as Body

  // // todo: 验证 scene
  // if (scene) {
  //   LoginQueue.findOne({
  //     where: {
  //       uuid: scene
  //     }
  //   })
  // }

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

  await LoginQueue.update(
    {
      status: loginStatus.loginSucceed
    },
    {
      where: {
        uuid: scene
      }
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
router.post('/checkScene', async (req, res) => {
  const { scene } = req.body

  if (!scene) {
    return res.send({
      status: 403
    })
  }

  const data = await LoginQueue.findOne({
    where: {
      uuid: scene
    }
  })
  // todo: 是否过期

  if (!data || data.toJSON().status != loginStatus.notLogin) {
    return res.send({
      status: 403
    })
  }

  data.update({
    status: loginStatus.scanCode
  })

  return res.send({
    status: 200
  })
})

export default router
