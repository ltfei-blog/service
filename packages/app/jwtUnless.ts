import { getConfig } from '@ltfei-blog/service-config'

const baseUrl = await getConfig('app', 'baseUrl')

const paths: string[] = [
  '/users/login/init',
  '/users/login/getQqConnectUrl',
  '/users/login/qqConnectLogin',
  '/articles/list',
  '/articles/details'
]

export default paths.map((e) => {
  return new RegExp(`^${baseUrl == '/' ? '' : baseUrl}${e}`)
})
