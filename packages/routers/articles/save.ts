import { Router } from 'express'
import { ArticlesSave } from '@ltfei-blog/service-db'
import type { Request } from '@ltfei-blog/service-app/types'

const router = Router()

/**
 *  id: number
  title: string
  content: string
  cover: string
  desc: string
  /**
   * 1 普通草稿
   * 2 提交审核
   * 3 审核通过
   * 4 审核不通过
   *
   *
  status: number
  author: number
  create_time: number
  last_edit_time: number
  type: 'edit' | 'add'
  articles_id: number
 */

router.post('/', async (req: Request, res) => {
  const { title, desc, cover, content, type } = req.body

  if (!title || !content) {
    return res.send({
      status: 403
    })
  }

  if (type != 'edit' && type != 'add') {
    return res.send({
      status: 403
    })
  }
  // todo: 输入内容限制
  // todo: 找正在编辑的草稿直接覆盖

  const auth = req.auth

  // 未提交的草稿
  const editing = await ArticlesSave.findOne({
    where: {
      author: auth.id,
      status: 1
    }
  })
  const data = {
    author: auth.id,
    title,
    desc,
    cover,
    content,
    type,
    status: 1
  }
  if (editing) {
    const result = await ArticlesSave.update(data, {
      where: {
        id: editing.toJSON().id
      }
    })
    res.send({
      status: 200,
      data: {}
    })
  } else {
    const result = await ArticlesSave.create(data)

    res.send({
      status: 200,
      data: {
        id: result.toJSON().id
      }
    })
  }
})

export default router
