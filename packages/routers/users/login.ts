import { LoginQueue, loginStatus, Users } from '@ltfei-blog/service-db'
import { getConfig } from '@ltfei-blog/service-config'
import { Router } from 'express'
import { v4 as uuidV4 } from 'uuid'
import {
  getAccessToken,
  getUserInfo,
  checkUuid
} from '@ltfei-blog/service-utils/loginApi'
import type { LoginRequest } from '@ltfei-blog/service-router/types'
import { createUserToken } from '@ltfei-blog/service-utils/token'
import { findOrCreateUser } from '@ltfei-blog/service-utils/findOrCreateUser'

const router = Router()

const generateRandomString = (length = 32) => {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$&'()*+,/:;=?@-._~"
  let randomString = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomString += characters.charAt(randomIndex)
  }

  return randomString
}

/**
 * init 路由
 * 返回登录方式、登录id（二维码和登录地址单独返回）
 */
router.get('/init', async (req, res) => {
  const { url } = req.body

  const loginMethodConfig = await getConfig('login_method')

  // 过滤允许的登录方式
  const loginMethods = Object.keys(loginMethodConfig)
    .map((e) => {
      if (loginMethodConfig[e as keyof typeof loginMethodConfig].enable) {
        return e
      }
    })
    .filter((e) => e)

  const uuid = generateRandomString()
  await LoginQueue.create({
    status: loginStatus.notLogin,
    date: Date.now(),
    url,
    uuid
  })

  res.send({
    status: 200,
    data: {
      uuid,
      loginMethods
    }
  })
})

/**
 * 获取 qq 互联登录地址
 * 请求时需要携带上一步获取的uuid
 */
router.post(
  '/getQqConnectUrl',
  checkUuid(loginStatus.notLogin),
  async (req: LoginRequest, res) => {
    const { uuid } = req.body
    const { status, date, id } = req.LoginQueue
    console.log('getQqConnectUrl')

    // 修改状态值
    await LoginQueue.update(
      {
        status: loginStatus.getQqConnectUrl
      },
      {
        where: {
          id
        }
      }
    )
    /**
     * 检查是否允许qq互联登录
     */
    const qqConnect = await getConfig('login_method', 'qq_connect')
    if (!qqConnect.enable) {
      return res.send({ status: 403 })
    }
    const { appid, redirect_uri } = qqConnect

    const qqLoginUrl: string[] = [
      'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=',
      appid,
      '&redirect_uri=',
      encodeURI(redirect_uri),
      '&state=',
      uuid
    ]
    // 可以返回后再异步处理
    LoginQueue.update(
      {
        status: loginStatus.getQqConnectUrl
      },
      {
        where: {
          id: req.LoginQueue.id
        }
      }
    )

    res.send({
      status: 200,
      data: {
        qqLoginUrl: qqLoginUrl.join('')
      }
    })
  }
)

/**
 * 使用qq互联登录页面获取的authorizationCode和uuid登录
 */
router.post(
  '/qqConnectLogin',
  checkUuid(loginStatus.getQqConnectUrl),
  async (req, res) => {
    const { authorizationCode } = req.body
    const { appkey, appid, redirect_uri } = await getConfig('login_method', 'qq_connect')

    /**
     * 使用Authorization_Code获取Access_Token
     */
    const {
      access_token: accessToken,
      openid,
      error
    } = await getAccessToken(appid, appkey, authorizationCode, redirect_uri)

    if (error) {
      return res.send({
        status: 403,
        msg: error
      })
    }

    /**
     * get_user_info 获取用户信息
     */
    const data = await getUserInfo(accessToken, appid, openid)
    if (data.ret < 0) {
      return res.send({
        status: 403,
        msg: `${data.ret} ${data.msg}`
      })
    }

    const [user, created] = await findOrCreateUser(
      {
        qq_openid: openid
      },
      {
        username: data.nickname,
        avatar: data.figureurl_qq_2 || data.figureurl_qq_1,
        register_date: Date.now(),
        register_ip: req.ip,
        qq_openid: openid
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
  }
)

export default router
