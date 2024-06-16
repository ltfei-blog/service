import { Router } from 'express'
import { ArticlesSave, Articles } from '@ltfei-blog/service-db'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'
import { keys } from '@ltfei-blog/service-config'

const router = Router()

interface Body {
  type: 'edit' | 'add'
  editId?: number
}
const schema = Joi.object({
  type: Joi.string().valid('add').valid('edit').required(),
  editId: Joi.number().optional().allow(null)
})
router.post('/', async (req: Request, res) => {
  const { type, editId } = req.body as Body
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
      status: keys.status.normal,
      author: auth.id,
      type,
      articles_id: editId
    }
  })
  /**
   * 有草稿
   * 存草稿时会判断作者，因此能查到草稿就是有权限编辑
   */
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
  /**
   * 修改文章，但没有草稿
   * 加载文章内容
   * 加载文章内容时会约束作者
   */
  if (type == 'edit') {
    const article = await Articles.findOne({
      where: {
        author: auth.id,
        id: editId,
        status: keys.status.normal
      }
    })
    if (!article) {
      return res.send({ status: 404 })
    }
    if (article) {
      return res.send({
        status: 200,
        data: {
          article: article.toJSON()
        }
      })
    }
  }

  res.send({
    status: 200
  })
})

export default router
