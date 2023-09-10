import { Config } from './types'

export default <Config>{
  app: {
    port: 3000,
    baseUrl: '/'
  },
  login_method: {
    qq_connect: {
      enable: false
    },
    wx_open: {
      enable: false
    },
    wx_miniprogram: {
      enable: false
    }
  },
  sql: {
    type: 'sqlite'
  },
  sqlite: {
    storage: 'db/main.db'
  },
  upload: {
    type: 'local',
    baseUrl: 'upload'
  }
}
