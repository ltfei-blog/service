import { getConfig } from '@ltfei-blog/service-config/index'
import express from 'express'

const { port, baseUrl } = await getConfig('app')
const app = express()

app.use(baseUrl, (req, res) => {
  req.res.send({ status: 200, msg: 'ltfei-blog service is running' })
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
