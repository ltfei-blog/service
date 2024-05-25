import { Router } from 'express'
import { getPermissionGroupPermissions } from '@ltfei-blog/service-permission'

const router = Router()

router.get('/', async (req, res) => {
  const id = req.query.id as string

  if (Number.isNaN(Number(id))) {
    return res.send({
      status: 403
    })
  }

  const permissions = await getPermissionGroupPermissions(Number(id))

  res.send({
    status: 200,
    data: permissions
  })
})

export default router
