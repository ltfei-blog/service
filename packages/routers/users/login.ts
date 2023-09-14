import { LoginQueue } from '@ltfei-blog/service-db'
import { getConfig } from '@ltfei-blog/service-config'
import { Router } from 'express'
import { v4 as uuidV4 } from 'uuid'

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
    status: 0,
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
router.post('/qqConnect', async (req, res) => {
  const { uuid } = req.body
  // todo: 数据库验证uuid是否存在/过期
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

  const { status, date } = data.toJSON()
  // todo: 过期时间配置项
  if (status != 0 || Date.now() > date.valueOf() + 1000 * 60) {
    return res.send({
      status: 403
    })
  }

  const qqConnect = await getConfig('login_method', 'qq_connect')
  if (!qqConnect.enable) {
    return res.send({ status: 403 })
  }
  const { appid, redirect_uri } = qqConnect

  const qqLoginUrl: string[] = [
    'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=',
    appid,
    '&redirect_uri=',
    encodeURIComponent(redirect_uri),
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

export default router
