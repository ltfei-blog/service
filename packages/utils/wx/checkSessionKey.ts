import axios from 'axios'
import { createHmac } from 'crypto'

export const checkSessionKey = async (
  access_token: string,
  openid: string,
  session_key: string
) => {
  // 用户登录态签名，用session_key对空字符串签名得到的结果。即 signature = hmac_sha256(session_key, "")
  const hmac = createHmac('sha256', session_key)
  hmac.update('')
  const signature = hmac.digest('hex')

  const { data: res } = await axios<{
    errcode: number
    errmsg: string
  }>({
    url: 'https://api.weixin.qq.com/wxa/checksession',
    params: {
      access_token,
      signature,
      openid,
      sig_method: 'hmac_sha256'
    }
  })

  return res
}
