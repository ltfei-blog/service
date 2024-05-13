const paths: string[] = [
  // '/login/login/init',
  // '/login/login/getQqConnectUrl',
  // '/login/login/qqConnectLogin',
  // '/login/login/getStatus',
  // '/login/wxLogin/',
  // '/login/member/get',
  '/login',
  // '/users/member/getPost',
  '/articles/list',
  '/articles/details',
  '/articles/search',
  '/comment/list'
]

export default paths.map((e) => {
  return new RegExp(`^${e}`)
})
