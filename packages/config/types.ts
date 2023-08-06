export interface Config {
  app: {
    port: number
    host: string
    cros: string
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
