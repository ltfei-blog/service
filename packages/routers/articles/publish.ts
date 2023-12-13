import { Router } from 'express'
import { ArticlesAudit, Articles, ArticlesSave } from '@ltfei-blog/service-db'
import type { Request } from '@ltfei-blog/service-app/types'

const router = Router()

interface Body {
  title: string
  desc: string
  cover: string
  content: string
  type: 'add' | 'edit'
  articlesId?: number
}
/**
 * 将文章插入到审核表，并将当前草稿作废
 */
router.post('/', async (req: Request, res) => {
  const { title, desc, cover, content, type, articlesId = null }: Body = req.body
  const auth = req.auth

  /**
   * 验证参数
   * todo: 使用joi验证参数
   */
  if (!title || !content || !desc) {
    return res.send({
      status: 403
    })
  }

  if (type != 'edit' && type != 'add') {
    return res.send({
      status: 403
    })
  }
  // 传递了多余的文章id
  if (type == 'add' && articlesId != null) {
    return res.send({
      status: 403
    })
  }

  /**
   * 如果是编辑的文章，需要验证是否为作者
   */
  if (type == 'edit') {
    const article = await Articles.findOne({
      where: {
        id: articlesId
      }
    })

    if (article.toJSON().author != auth.id) {
      return res.send({
        status: 403
      })
    }
  }

  /**
   * 如果修改文章时有待审核的内容，应先将之前的作废，避免提交的同时审核通过
   */
  await ArticlesSave.update(
    {
      status: 2
    },
    {
      where: {
        type,
        author: auth.id,
        articles_id: articlesId
      }
    }
  )

  /**
   * 加入审核表
   */
  const result = await ArticlesAudit.create({
    title,
    desc,
    cover,
    content,
    type,
    articles_id: articlesId,
    status: 0,
    author: auth.id
  })

  const auditId = result.toJSON().id

  /**
   * 如果设置无需审核，或用户有 无需审核 权限，则自动通过审核
   */
  // todo: dev环境暂时全部直接通过
  if (true) {
    let id = articlesId
    if (type == 'add') {
      const result = await Articles.create({
        title,
        desc,
        cover,
        content,
        author: auth.id,
        create_time: Date.now(),
        status: 1
      })

      id = result.toJSON().id
    } else if (type == 'edit') {
      await Articles.update(
        {
          title,
          desc,
          cover,
          content,
          last_edit_time: Date.now()
        },
        {
          where: {
            id: articlesId
          }
        }
      )
    }
    // 修改审核表的审核状态和审核人id
    ArticlesAudit.update(
      {
        status: 1,
        articles_id: id,
        audit_id: -1,
        cause: '自动通过'
      },
      {
        where: {
          id: auditId
        }
      }
    )
    // 直接返回文章id
    return res.send({
      status: 200,
      data: {
        audit: false,
        id
      }
    })
  }

  res.send({
    status: 200,
    data: {
      auditId: auditId
    }
  })
})

export default router
