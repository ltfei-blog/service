import { LoginQueue } from '@ltfei-blog/service-db'
import { Router } from 'express'
import { v4 as uuidV4 } from 'uuid'

const router = Router()

interface LoginBody {
  loginType: 'weixin_open' | 'weixin_miniprogram' | 'qq_open'
}

router.get('/init', async (req, res) => {
  const { loginType }: LoginBody = req.body
  if (!['weixin_open', 'weixin_miniprogram', 'qq_open'].includes(loginType)) {
    return res.send({
      status: 403
    })
  }
  const uuid = uuidV4()
  await LoginQueue.create({
    status: 0,
    date: new Date(),
    uuid
  })

  res.send({
    status: 200,
    data: {
      uuid
    }
  })
})

export default router
