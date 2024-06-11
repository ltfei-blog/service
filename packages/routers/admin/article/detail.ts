import { Router } from 'express'
import { Articles } from '@ltfei-blog/service-db'

const router = Router()

router.get('/', async (req, res) => {
  const id = req.query.id as string
  if (!id) {
    return res.send({
      status: 403
    })
  }

  const articles = await Articles.findOne({
    where: {
      id
    }
  })

  res.send({
    status: 200,
    data: articles
  })
})

export default router
