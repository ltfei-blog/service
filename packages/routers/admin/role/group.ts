import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import { PermissionGroups } from '@ltfei-blog/service-db'
import { recursivePermissionGroup } from '@ltfei-blog/service-permission'

const router = Router()

router.get('/', async (req: Request, res) => {
  const permissionGroups = await PermissionGroups.findAll()

  res.send({
    status: 200,
    data: permissionGroups
  })
})

router.get('/detail', async (req, res) => {
  const id = req.query.id as string

  if (Number.isNaN(Number(id))) {
    return res.send({
      status: 403
    })
  }

  const permissionGroup = await recursivePermissionGroup(Number(id))

  res.send({
    status: 200,
    data: permissionGroup
  })
})

export default router
