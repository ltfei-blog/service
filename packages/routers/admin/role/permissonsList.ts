import { Router } from 'express'
import { PERMISSIONS } from '@ltfei-blog/service-permission'

const router = Router()

router.get('/', (req, res) => {
  res.send({
    status: 200,
    data: PERMISSIONS
  })
})

export default router
