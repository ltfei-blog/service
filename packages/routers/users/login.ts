import { LoginQueue, loginStatus, Users } from '@ltfei-blog/service-db'
import { getConfig } from '@ltfei-blog/service-config'
import { Router } from 'express'
import { v4 as uuidV4 } from 'uuid'
import {
  getAccessToken,
  getUserInfo,
  checkUuid
} from '@ltfei-blog/service-utils/qqConnectLoginApi'
import type { LoginRequest } from '@ltfei-blog/service-router/types'
import { createUserToken } from '@ltfei-blog/service-utils/token'

const router = Router()

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

  const uuid = uuidV4()
  await LoginQueue.create({
    status: loginStatus.notLogin,
    date: new Date(),
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

    // todo: 增/查数据库
    const [user, created] = await Users.findOrCreate({
      where: {
        qq_openid: openid
      },
      defaults: {
        username: data.nickname,
        // password
        avatar: data.figureurl_qq_2 || data.figureurl_qq_1,
        // city:
        // gender
        register_date: new Date(),
        // last_login_date
        register_ip: req.ip,
        // status:
        // avatar_pendant
        // wx_openid
        // wx_unionid
        qq_openid: openid
      }
    })

    const token = createUserToken({
      id: user.toJSON().id
    })

    // todo: 生成token
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
