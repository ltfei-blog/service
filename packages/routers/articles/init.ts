import { Router } from 'express'
import { ArticlesSave } from '@ltfei-blog/service-db'
import type { Request } from '@ltfei-blog/service-app/types'
import joi from 'joi'
import Joi from 'joi'

const router = Router()

interface Body {
  type: 'edit' | 'add'
}
const schema = Joi.object({
  type: Joi.string().valid('add').valid('edit').required()
})
router.post('/', async (req: Request, res) => {
  const { type } = req.body as Body
  /**
   * 验证参数
   */
  const validate = schema.validate(req.body)
  if (validate.error) {
    return res.send({
      status: 403
    })
  }

  const auth = req.auth
  const editing = await ArticlesSave.findOne({
    where: {
      status: 1,
      author: auth.id
    }
  })
  if (editing) {
    const {
      articles_id,
      author,
      content,
      cover,
      create_time,
      desc,
      last_edit_time,
      title,
      type
    } = editing.toJSON()
    // 有草稿的情形
    return res.send({
      status: 200,
      data: {
        edit: {
          articles_id,
          author,
          content,
          cover,
          create_time,
          desc,
          last_edit_time,
          title,
          type
        }
      }
    })
  }

  res.send({
    status: 200
  })
})

export default router
