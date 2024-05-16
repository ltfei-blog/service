import { Router } from 'express'
import { Articles, ArticlesAudit, Comments } from '@ltfei-blog/service-db'
import { PERMISSIONS, getUserPermission } from '@ltfei-blog/service-permission'
import type { Request } from '@ltfei-blog/service-app/types'
import { Op } from 'sequelize'
import os from 'os'

interface Data {
  sql: {}
  article: {
    count: number
    new: number
    audit: number
  }
  comment: {
    count: number
    new: number
    audit: number
  }
  user: {}
  system: {
    arch: string
    platform: NodeJS.Platform
    type: string
    hostname: string
    totalmem: string
    freemem: string
    release: string
  }
}

const recentTime = 1000 * 60 * 60 * 24 * 7

const router = Router()

const getArticle = async () => {
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

  return {
    count,
    new: newCount,
    audit
  }
}

const getComment = async () => {
  const count = await Comments.count({
    where: {
      // status: 1
    }
  })
  const newCount = await Comments.count({
    where: {
      // status: 1,
      create_time: {
        [Op.gt]: Date.now() - recentTime
      }
    }
  })

  // const audit = await ArticlesAudit.count({
  //   where: {
  //     status: 0
  //   }
  // })
  const audit = 0

  return {
    count,
    new: newCount,
    audit
  }
}

const getSystem = () => {
  const arch = os.arch()
  const platform = os.platform()
  const type = os.type()
  const hostname = os.hostname()
  const release = os.release()

  const totalmem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + 'G'
  const freemem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + 'G'

  return {
    arch,
    platform,
    type,
    hostname,
    totalmem,
    freemem,
    release
  }
}

router.get('/', async (req: Request, res) => {
  const user = req.auth
  const data: Partial<Data> = {}

  // 文章
  const articlePermission = await getUserPermission(user.id, PERMISSIONS.admin_article)
  if (articlePermission == 1) {
    data.article = await getArticle()
  }
  // 评论
  const commentPermission = await getUserPermission(user.id, PERMISSIONS.admin_comment)
  if (commentPermission == 1) {
    data.comment = await getComment()
  }

  data.system = getSystem()

  res.send({
    status: 200,
    data
  })
})

export default router
