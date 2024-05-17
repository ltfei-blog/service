import { Router } from 'express'
import {
  Articles,
  ArticlesAudit,
  Comments,
  Users,
  sequelize
} from '@ltfei-blog/service-db'
import { PERMISSIONS, getUserPermission } from '@ltfei-blog/service-permission'
import type { Request } from '@ltfei-blog/service-app/types'
import { Model, ModelStatic, Op } from 'sequelize'
import os from 'os'
import { getConfig } from '@ltfei-blog/service-config'

interface Count {
  count: number
  new: number
  audit: number
}

interface Data {
  article: Count
  comment: Count
  user: Count
  sql: {
    version: string
    sqlType: string
  }
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

const countModel = async (
  model: ModelStatic<Model>,
  where: object,
  dateKey = 'create_time'
) => {
  const count = await model.count({
    where: {
      ...where
    }
  })
  const newCount = await model.count({
    where: {
      ...where,
      [dateKey]: {
        [Op.gt]: Date.now() - recentTime
      }
    }
  })

  return {
    count,
    newCount
  }
}

const getArticle = async () => {
  const { count, newCount } = await countModel(Articles, { status: 1 })
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
  const { count, newCount } = await countModel(Comments, {})
  const audit = 0

  return {
    count,
    new: newCount,
    audit
  }
}

const getUser = async () => {
  const { count, newCount } = await countModel(Users, {}, 'register_date')
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

const getSql = async (): Promise<Data['sql']> => {
  const [err, result] = await sequelize.query('select version() as version;')
  type Result = [
    {
      version: string
    }
  ]
  const version = (result as Result)[0].version
  const sqlType = await getConfig('sql', 'type')

  return {
    sqlType,
    version
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
  // 用户
  const userPermission = await getUserPermission(user.id, PERMISSIONS.admin_user)
  if (userPermission == 1) {
    data.user = await getUser()
  }

  data.system = getSystem()
  data.sql = await getSql()

  res.send({
    status: 200,
    data
  })
})

export default router
