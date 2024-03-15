import axios from 'axios'
import type { QqConnectUserInfo } from '@ltfei-blog/service-router/types'
import type { LoginRequest } from '@ltfei-blog/service-router/types'
import type { RequestHandler } from 'express'
import { LoginQueue, loginStatus } from '@ltfei-blog/service-db'

/**
 * 验证 `uuid` 的中间件
 * 验证 `uuid` 当前状态是否正确，并将登录信息放在 `req.LoginQueue`
 * @param checkStatus 要验证的状态，如果不传递，则仅验证时间，允许所有状态
 */
export const checkUuid = (checkStatus?: number): RequestHandler => {
  return async (req: LoginRequest, res, next) => {
    const { uuid } = req.body
    if (!uuid) {
      return res.send({
        status: 403
      })
    }
    const data = await LoginQueue.findOne({
      where: {
        uuid,
        ineffective: false
      }
    })
    if (!data) {
      return res.send({
        status: 403
      })
    }
    const { status, date } = data.toJSON()
    // todo: 过期时间配置项
    // todo: 标记为作废
    if (Date.now() > date.valueOf() + 1000 * 60) {
      data.update({
        ineffective: true
      })
      return res.send({
        status: 200,
        data: {
          status: loginStatus.loginFailedTimeout
        }
      })
    }
    if (checkStatus && status != checkStatus) {
      return res.send({
        status: 403
      })
    }
    req.LoginQueue = data.toJSON()
    req.UpdataLoginQueue = data.update
    next()
  }
}

/**
 * 使用Authorization_Code获取Access_Token
 * https://wiki.connect.qq.com/%e4%bd%bf%e7%94%a8authorization_code%e8%8e%b7%e5%8f%96access_token
 */

export const getAccessToken = async (
  appid: string,
  appkey: string,
  authorizationCode: string,
  redirect_uri: string
) => {
  const { data } = await axios<{
    access_token: string
    openid: string
    error: number
    error_description: string
  }>({
    url: 'https://graph.qq.com/oauth2.0/token',
    method: 'GET',
    params: {
      grant_type: 'authorization_code',
      client_id: appid,
      client_secret: appkey,
      code: authorizationCode,
      redirect_uri,
      fmt: 'json',
      need_openid: 1
    }
  })
  return data
}

/**
 * get_user_info 获取用户信息
 * https://wiki.connect.qq.com/get_user_info
 */
export const getUserInfo = async (accessToken: string, appid: string, openid: string) => {
  const { data } = await axios<QqConnectUserInfo>({
    url: 'https://graph.qq.com/user/get_user_info',
    method: 'GET',
    params: {
      access_token: accessToken,
      oauth_consumer_key: appid,
      openid
    }
  })
  return data
}
