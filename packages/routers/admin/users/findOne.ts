import { Router } from 'express'
import { Users } from '@ltfei-blog/service-db'
import type { Request } from '@ltfei-blog/service-app/types'

const router = Router()

router.post('/', async (req: Request, res) => {
  const user = await Users.findOne({
    where: req.body
  }).catch((e: Error) => {
    res.send({
      status: 500,
      msg: e.message
    })
  })

  user &&
    res.send({
      status: 200,
      data: user
    })
})

export default router
