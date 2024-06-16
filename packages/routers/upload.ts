import { Router } from 'express'
import dayjs from 'dayjs'
import multer from 'multer'
import { putObject } from '@ltfei-blog/service-utils/tencentCos'
import type { Request } from '@ltfei-blog/service-app/types'
import { Uploads } from '@ltfei-blog/service-db'
import { keys } from '@ltfei-blog/service-config'

const router = Router()

const upload = multer({
  fileFilter(req, file, cb) {
    if (['image/jpeg', 'image/png'].indexOf(file.mimetype) == -1) {
      // 文件类型有误
      return cb(new Error('文件类型有误'))
    }
    cb(null, true)
  },
  limits: {
    // 1024B*1024B = 1M
    // 5M
    fileSize: 1024 * 1024 * 5
  }
}).single('file')

/**
 * 图片上传，多个上传位置使用相同逻辑
 * todo: 防止用户恶意多次上传
 */
const paths: { type: 'cover' | 'articles' | 'avatar'; path: string }[] = [
  { type: 'cover', path: '/articles/cover/upload' },
  { type: 'articles', path: '/articles/upload' },
  { type: 'avatar', path: '/users/avatar' }
]
router.post(
  paths.map((e) => e.path),
  async (req: Request, res) => {
    upload(req, res, async (err) => {
      if (!req.file?.buffer) {
        return res.send({
          status: 403
        })
      }
      if (err) {
        return res.send({
          status: 403
        })
      }

      const user = req.auth
      const type = paths.find((e) => {
        return e.path == req.path
      }).type
      const contentType = req.file.mimetype
      const fileNameData = dayjs().format('YYYYMMDDHHmmss')
      const random = Math.floor(Math.random() * 10000)
      const suffix = req.file?.mimetype.split('/')[1]
      const filename = `${fileNameData}${random}.${suffix}`
      const path = `${type}/${filename}`

      await Uploads.create({
        filename,
        path,
        content_type: contentType,
        suffix,
        user: user.id,
        upload_type: type,
        status: keys.status.normal,
        create_time: Date.now()
      })

      const data = await putObject(path, req.file?.buffer)
      if (data.statusCode != 200) {
        return res.send({ status: 500 })
      }
      /**
       * todo: 动态baseUrl
       */
      const baseUrl = 'https://dev-1259453062.cos.ap-beijing.myqcloud.com/'
      res.send({
        status: 200,
        data: {
          filename,
          path,
          url: `${baseUrl}${path}`
        }
      })
    })
  }
)

export default router
