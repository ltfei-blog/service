import { getConfig } from '@ltfei-blog/service-config/index'
import express from 'express'
import '@ltfei-blog/service-db'
import router from '@ltfei-blog/service-router'
import bodyParser from 'body-parser'

const { port, baseUrl } = await getConfig('app')
const app = express()

app.use(bodyParser.json())

app.get(baseUrl, (req, res) => {
  res.send({ status: 200, msg: 'ltfei-blog service is running' })
})

app.use(baseUrl, router)

app.all(baseUrl, (req, res) => {
  res.send({ status: 404 })
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
