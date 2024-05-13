import { Router } from 'express'
import { Articles, ArticlesAudit } from '@ltfei-blog/service-db'
import { PERMISSIONS, getUserPermission } from '@ltfei-blog/service-permission'
import type { Request } from '@ltfei-blog/service-app/types'
import { Op } from 'sequelize'

interface Data {
  sql: {}
  article: {
    count: number
    new: number
    audit: number
  }
  comment: {}
  user: {}
}

const recentTime = 1000 * 60 * 60 * 24 * 7

const router = Router()

router.get('/', async (req: Request, res) => {
  const user = req.auth
  const data: Partial<Data> = {}

  const articlePermission = await getUserPermission(user.id, PERMISSIONS.admin_article)
  if (articlePermission == 1) {
    const count = await Articles.count({
      where: {
        status: 1
      }
    })
    const newCount = await Articles.count({
      where: {
        status: 1,
        create_time: {
          [Op.gt]: Date.now() - recentTime
        }
      }
    })
    const audit = await ArticlesAudit.count({
      where: {
        status: 0
      }
    })

    data.article = {
      count,
      new: newCount,
      audit
    }
  }

  res.send({
    status: 200,
    data
  })
})

export default router
