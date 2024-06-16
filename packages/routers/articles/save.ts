import { Router } from 'express'
import { ArticlesSave, Articles } from '@ltfei-blog/service-db'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'
import { keys } from '@ltfei-blog/service-config'

const router = Router()

interface Body {
  title: string
  desc: string
  cover: string
  content: string
  type: 'add' | 'edit'
  editId?: number
}
const schema = Joi.object({
  title: Joi.string().min(2).max(40).required(),
  desc: Joi.string().allow('').min(10).max(100),
  cover: Joi.string().optional().allow(''),
  content: Joi.string().min(5).max(40000).required(),
  type: Joi.string().valid('add').valid('edit').required(),
  editId: Joi.number().optional().allow(null)
})

router.post('/', async (req: Request, res) => {
  const { title, desc, cover, content, type, editId }: Body = req.body

  const validate = schema.validate(req.body)
  if (validate.error) {
    return res.send({
      status: 403
    })
  }

  if (type == keys.articlesSave.type.edit && !editId) {
    return res.send({
      status: 403
    })
  }

  const auth = req.auth

  /**
   * 编辑文章 验证作者
   */
  if (type == keys.articlesSave.type.edit) {
    const article = Articles.findOne({
      where: {
        author: auth.id,
        id: editId,
        status: keys.status.normal
      }
    })
    if (!article) {
      res.send({
        status: 404
      })
    }
  }

  /**
   * 查找草稿
   */
  const editing = await ArticlesSave.findOne({
    where: {
      author: auth.id,
      status: keys.articlesSave.status.normal
    }
  })
  const data = {
    author: auth.id,
    title,
    desc,
    cover,
    content,
    type,
    status: keys.articlesSave.status.normal
  }
  if (editing) {
    // 有正在编辑的草稿直接覆盖
    await ArticlesSave.update(data, {
      where: {
        id: editing.toJSON().id
      }
    })
    res.send({
      status: 200
    })
  } else {
    // 插入新的草稿
    await ArticlesSave.create(data)

    res.send({
      status: 200
    })
  }
})

export default router
