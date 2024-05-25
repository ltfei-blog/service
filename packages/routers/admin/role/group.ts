import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import { PermissionGroups } from '@ltfei-blog/service-db'

const router = Router()

router.get('/', async (req: Request, res) => {
  const permissionGroups = await PermissionGroups.findAll()

  res.send({
    status: 200,
    data: permissionGroups
  })
})

export default router
