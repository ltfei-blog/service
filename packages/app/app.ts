import { getConfig } from '@ltfei-blog/service-config'
import express from 'express'
import router from '@ltfei-blog/service-router'
import bodyParser from 'body-parser'
import { expressjwt as jwt } from 'express-jwt'
import jwtUnless from './jwtUnless'
import { app as logger } from '@ltfei-blog/service-utils/log'

const { port, baseUrl, jwtSecret } = await getConfig('app')
const app = express()

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
    }
  }).unless({
    path: jwtUnless
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
      res.send({
        status: 401
      })
    } else {
      next(err)
    }
  }
)

// req.body
app.use(bodyParser.json())

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
