import axios from 'axios'
import { getConfig } from '@ltfei-blog/service-config'

// todo: 调用时检查配置是否开启微信登录
const { appid, secret } = await getConfig('login_method', 'wx_miniprogram')

/**
 * 微信登录凭证校验
 * 通过 wx.login 接口获得临时登录凭证 code 后传到开发者服务器调用此接口完成登录流程
 * @param code 登录时获取的 code，可通过wx.login获取
 * @doc https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
 */
export const codeToSession = async (code: string) => {
  const { data: res } = await axios<{
    openid: string
    session_key: string
    unionid: string
    errcode: number
    errmsg: string
  }>({
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    params: {
      appid,
      secret,
      js_code: code,
      grant_type: 'authorization_code'
    }
  })
  return res
}
