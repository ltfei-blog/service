import axios from 'axios'
import { getConfig } from '@ltfei-blog/service-config'

const { appid, secret } = await getConfig('login_method', 'wx_miniprogram')

interface AccessTokenData {
  access_token: string
  expires_in: number
}

const cach: {
  access_token: string
  expire: number
} = {
  access_token: '',
  expire: 0
}

export const getAccessToken = async () => {
  // 缓存在有效期内
  if (cach.expire > Date.now()) {
    return cach.access_token
  }
  // 有效期外重新获取
  const { data: res } = await axios<AccessTokenData>({
    url: 'https://api.weixin.qq.com/cgi-bin/token',
    params: {
      grant_type: 'client_credential',
      appid,
      secret
    }
  })
  // 更新缓存
  cach.access_token = res.access_token
  cach.expire = Date.now() + res.expires_in * 1000 - 1000 * 60
  return res.access_token
}
