import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import { Users } from '@ltfei-blog/service-db'

const router = Router()

router.post('/', async (req: Request, res) => {
  const auth = req.auth
  const result = await Users.findOne({
    where: {
      id: auth.id
    }
  })
  if (!result) {
    return res.send({
      status: 4001
    })
  }

  const user = result.toJSON()

  res.send({
    status: 200,
    data: {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      city: user.city,
      gender: user.gender,
      register_date: user.register_date,
      last_login_date: user.last_login_date,
      status: user.status,
      avatar_pendant: user.avatar_pendant
    }
  })
})

export default router
