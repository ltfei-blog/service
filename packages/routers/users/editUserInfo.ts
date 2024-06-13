import { Router } from 'express'
import type { Request } from '@ltfei-blog/service-app/types'
import Joi from 'joi'
import { Users } from '@ltfei-blog/service-db'

const router = Router()

interface Body {
  username: string
  avatar: string
  city: string
  gender: 0 | 1
  desc: string
}

const schema = Joi.object({
  username: Joi.string().min(2).max(32),
  avatar: Joi.string(),
  city: Joi.string().max(5),
  gender: Joi.number().allow(1).allow(0).allow(2),
  desc: Joi.string().min(1).max(50).allow(null)
})

router.post('/editUserInfo', async (req: Request, res) => {
  const validate = schema.validate(req.body)

  if (validate.error) {
    return res.send({
      status: 403
    })
  }
  const auth = req.auth
  const { username, avatar, city, gender, desc } = req.body as Body

  await Users.update(
    {
      username,
      avatar,
      city,
      gender,
      desc
    },
    {
      where: {
        id: auth.id
      }
    }
  )

  return res.send({
    status: 200
  })
})

export default router
