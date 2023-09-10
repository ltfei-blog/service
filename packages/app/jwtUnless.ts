import { getConfig } from '@ltfei-blog/service-config'

const baseUrl = await getConfig('app', 'baseUrl')

const paths: string[] = ['/users/login/init', '/users/login/qqConnect']

export default paths.map((e) => {
  return new RegExp(`^${baseUrl == '/' ? '' : baseUrl}${e}`)
})
