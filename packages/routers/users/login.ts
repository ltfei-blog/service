import { LoginQueue, loginStatus } from '@ltfei-blog/service-db'
import { getConfig } from '@ltfei-blog/service-config'
import { Router } from 'express'
import { v4 as uuidV4 } from 'uuid'
import axios from 'axios'
import { QqConnectUserInfo } from '@ltfei-blog/service-router/types'

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
router.post('/getQqConnectUrl', async (req, res) => {
  const { uuid } = req.body
  const data = await LoginQueue.findOne({
    where: {
      uuid
    }
  })

  if (!data) {
    return res.send({
      status: 403
    })
  }

  const { status, date, id } = data.toJSON()
  // todo: 过期时间配置项
  if (status != loginStatus.notLogin || Date.now() > date.valueOf() + 1000 * 60) {
    return res.send({
      status: 403
    })
  }

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

  res.send({
    status: 200,
    data: {
      qqLoginUrl: qqLoginUrl.join('')
    }
  })
})

/**
 * 使用qq互联登录页面获取的authorizationCode和uuid登录
 */
router.post('/qqConnectLogin', async (req, res) => {
  const { uuid, authorizationCode } = req.body
  const { appkey, appid, redirect_uri } = await getConfig('login_method', 'qq_connect')

  // todo: 验证uuid

  /**
   * 使用Authorization_Code获取Access_Token
   * https://wiki.connect.qq.com/%e4%bd%bf%e7%94%a8authorization_code%e8%8e%b7%e5%8f%96access_token
   */
  const {
    data: { access_token: accessToken, openid }
  } = await axios<{
    access_token: string
    openid: string
  }>({
    url: 'https://graph.qq.com/oauth2.0/token',
    method: 'GET',
    params: {
      grant_type: 'authorization_code',
      client_id: appid,
      client_secret: appkey,
      code: authorizationCode,
      redirect_uri,
      fmt: 'json',
      need_openid: 1
    }
  })

  /**
   * get_user_info 获取用户信息
   * https://wiki.connect.qq.com/get_user_info
   */
  const { data } = await axios<QqConnectUserInfo>({
    url: 'https://graph.qq.com/user/get_user_info',
    method: 'GET',
    params: {
      access_token: accessToken,
      oauth_consumer_key: appid,
      openid
    }
  })

  // todo: 增/查数据库
  // todo: 生成token
})

export default router
