import { Router } from 'express'
import { ArticlesSave } from '@ltfei-blog/service-db'
import type { Request } from '@ltfei-blog/service-app/types'
import joi from 'joi'

const router = Router()

interface Body {
  type: 'edit' | 'add'
}
router.post('/', async (req: Request, res) => {
  const { type } = req.body as Body
  const auth = req.auth
  const editing = await ArticlesSave.findOne({
    where: {
      status: 1,
      author: auth.id
    }
  })
  if (editing) {
    // 有草稿的情形
    return
  }

  res.send({
    status: 200
  })
})

export default router
