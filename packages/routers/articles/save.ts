import { Router } from 'express'
import { ArticlesSave } from '@ltfei-blog/service-db'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'

const router = Router()

interface Body {
  title: string
  desc: string
  cover: string
  content: string
  type: 'add' | 'edit'
}
const schema = Joi.object({
  title: Joi.string().min(2).max(40).required(),
  desc: Joi.string().min(10).max(100),
  cover: Joi.string(),
  content: Joi.string().min(5).max(40000).required(),
  type: Joi.string().valid('add').valid('edit').required()
})

router.post('/', async (req: Request, res) => {
  const { title, desc, cover, content, type }: Body = req.body

  const validate = schema.validate(req.body)
  if (validate.error) {
    return res.send({
      status: 403
    })
  }

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
