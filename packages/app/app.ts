import { getConfig } from '@ltfei-blog/service-config'
import express from 'express'
import router from '@ltfei-blog/service-router'
import bodyParser from 'body-parser'
import { expressjwt as jwt } from 'express-jwt'
import jwtUnless from './jwtUnless'
import { app as logger } from '@ltfei-blog/service-utils/log'
import cors from 'cors'
import { Request } from './types'
import './procexit'

const { port, baseUrl, jwtSecret, cors: corsOrigin } = await getConfig('app')
const app = express()

// cors
app.use(
  cors({
    origin: corsOrigin
  })
)

// jwt
app.use(
  baseUrl,
  jwt({
    secret: jwtSecret,
    algorithms: ['HS256'],
    getToken: (req) => {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
      ) {
        return req.headers.authorization.split(' ')[1]
      }
      return null
    },
    credentialsRequired: false
  })
)

// jwt error
app.use(
  (
    err: express.Errback,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.name === 'UnauthorizedError') {
      // token验证失败，放在下个身份验证路由处理
      next()
    } else {
      next(err)
    }
  }
)

// 身份验证
app.use(baseUrl, (req: Request, res, next) => {
  const auth = req.auth

  const unlessIndex = jwtUnless.findIndex((e) => {
    return e.test(req.path)
  })
  const isUnless = unlessIndex != -1

  if (!auth && !isUnless) {
    return res.send({
      status: 4001
    })
  }
  next()
})

// req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// status message
app.get(baseUrl, (req, res) => {
  res.send({ status: 200, msg: 'ltfei-blog service is running' })
})

// routers
app.use(baseUrl, router)

// 404
app.all(baseUrl, (req, res) => {
  res.send({ status: 404 })
})

app.listen(port, () => {
  logger.info(`http://localhost:${port}`)
})
