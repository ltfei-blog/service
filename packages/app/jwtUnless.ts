const paths: string[] = [
  '/users/login/init',
  '/users/login/getQqConnectUrl',
  '/users/login/qqConnectLogin',
  '/users/login/getStatus',
  '/users/wxLogin/',
  '/users/member/get',
  // '/users/member/getPost',
  '/articles/list',
  '/articles/details',
  '/articles/search',
  '/comment/list'
]

export default paths.map((e) => {
  return new RegExp(`^${e}`)
})
