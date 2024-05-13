import { loginStatus } from '@ltfei-blog/service-db'
import { getConfig } from '@ltfei-blog/service-config'
import { Router } from 'express'
import {
  getAccessToken,
  getUserInfo,
  checkUuid
} from '@ltfei-blog/service-utils/loginApi'
import type { LoginRequest } from '@ltfei-blog/service-router/types'
import { createUserToken } from '@ltfei-blog/service-utils/token'
import { findOrCreateUser } from '@ltfei-blog/service-utils/findOrCreateUser'

const router = Router()

/**
 * 获取 qq 互联登录地址
 * 请求时需要携带上一步获取的uuid
 */
router.post(
  '/getQqConnectUrl',
  checkUuid(loginStatus.notLogin),
  async (req: LoginRequest, res) => {
    const { uuid } = req.body
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
    req.UpdataLoginQueue({
      status: loginStatus.getQqConnectUrl
    })

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
  async (req: LoginRequest, res) => {
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

    // uuid 标记作废
    await req.UpdataLoginQueue({
      ineffective: true,
      auth_method: 'qq_connect'
    })

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
