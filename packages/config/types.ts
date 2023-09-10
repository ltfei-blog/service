export interface Config {
  app: {
    port: number
    host: string
    cros: string
    baseUrl: string
    jwtSecret: string
  }
  login_method: {
    qq_connect: {
      enable: boolean
      appid: string
      appkey: string
      redirect_uri: string
    }
    wx_open: {
      enable: boolean
    }
    wx_miniprogram: {
      enable: boolean
    }
  }
  sql: {
    type: 'mysql' | 'sqlite'
  }
  mysql: {
    database: string
    host: string
    password: string
    port: number
    username: string
  }
  sqlite: {
    storage: string
  }
  upload: {
    type: 'local' | 'ali_oss' | 'tencent_cos'
    baseUrl: string
  }
  ali_oss: {}
  tencent_cos: {}
}
