import { codeToSession } from './codeToSession'
import { checkSessionKey } from './checkSessionKey'
import { getAccessToken } from './getAccessToken'

export const checkLogin = async (
  code: string
): Promise<
  | {
      err: number
    }
  | {
      err: false
      openid: string
      unionid: string
    }
> => {
  const { errcode, openid, session_key, unionid } = await codeToSession(code)
  if (errcode) {
    return { err: errcode }
  }
  const accessToken = await getAccessToken()

  const { errcode: sessionKeyErrCode } = await checkSessionKey(
    accessToken,
    openid,
    session_key
  )
  if (sessionKeyErrCode) {
    return { err: sessionKeyErrCode }
  }
  return {
    err: false,
    openid,
    unionid
  }
}
