import axios from 'axios'
import { getAccessToken } from './getAccessToken'
import { getConfig } from '@ltfei-blog/service-config'

const { env_version } = await getConfig('login_method', 'wx_miniprogram')

export const getUnlimited = async (code: string) => {
  // https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html
  const { data: res } = await axios<Buffer>({
    method: 'POST',
    url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
    responseType: 'arraybuffer',
    data: {
      scene: code,
      page: 'subpkg/login/login',
      env_version: env_version,
      check_path: false
    },
    params: {
      access_token: await getAccessToken()
    }
  })

  return res
}
