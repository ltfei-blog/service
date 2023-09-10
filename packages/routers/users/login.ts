import { LoginQueue } from '@ltfei-blog/service-db'
import { getConfig } from '@ltfei-blog/service-config'
import { Router } from 'express'
import { v4 as uuidV4 } from 'uuid'

const router = Router()

// interface LoginBody {
//   loginType: 'weixin_open' | 'weixin_miniprogram' | 'qq_open'
// }

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
      console.log(loginMethodConfig)

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

router.get('/qqConnect', async (req, res) => {
  const { uuid } = req.body
  // todo: 数据库验证uuid是否存在/过期
  const qqConnect = await getConfig('login_method', 'qq_connect')
  if (!qqConnect.enable) {
    return res.send({ status: 403 })
  }
  const { appid, redirect_uri } = qqConnect
  // todo: redirect_uri urlencode
  const qqLoginUrl = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${appid}&redirect_uri=${redirect_uri}&state=${uuid}`
  res.send({
    status: 200,
    data: {
      qqLoginUrl
    }
  })
})

export default router
