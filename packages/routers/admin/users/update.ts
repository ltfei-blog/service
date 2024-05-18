import { Router } from 'express'
import { Users } from '@ltfei-blog/service-db'
import type { Request } from '@ltfei-blog/service-app/types'

const router = Router()

router.post('/', async (req: Request, res) => {
  const { id, ...data } = req.body
  if (Number.isNaN(Number(id)) || !Number.isInteger(Number(id)) || id <= 0) {
    return res.send({
      status: 403
    })
  }

  const result = await Users.update(data, {
    where: {
      id
    }
  })

  res.send({
    status: 200,
    data: result[0]
  })
})

export default router
