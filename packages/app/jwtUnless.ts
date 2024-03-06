const paths: string[] = [
  '/users/login/init',
  '/users/login/getQqConnectUrl',
  '/users/login/qqConnectLogin',
  '/users/wxLogin/',
  '/articles/list',
  '/articles/details',
  '/comment/list'
]

export default paths.map((e) => {
  return new RegExp(`^${e}`)
})
