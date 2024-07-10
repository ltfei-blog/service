import { Config } from './types'

export default <Config>{
  app: {
    port: 3000,
    cors: '*',
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
      enable: false,
      env_version: 'release'
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
  },
  articles: {
    exception: {
      version: '\\w\\b\\w',
      data: '{status: 200, data: []}'
    }
  }
}
