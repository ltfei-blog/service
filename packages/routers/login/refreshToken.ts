import { Router } from 'express'
import { createToken, verifyRefreshToken } from '@ltfei-blog/service-utils/token'

const router = Router()

router.post('/', async (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.send({
      status: 403
    })
  }

  const auth = await verifyRefreshToken(refreshToken)

  if (!auth) {
    return res.send({
      status: 401
    })
  }

  const user = {
    id: auth.id
  }
  const token = await createToken(user)

  res.send({
    status: 200,
    data: token
  })
})

export default router
