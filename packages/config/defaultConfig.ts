import { Config } from './types'
import { v4 as uuidV4 } from 'uuid'

export default <Config>{
  app: {
    port: 3000,
    cors: '*',
    baseUrl: '/',
    jwtSecret: uuidV4(),
    jwtRefreshSecret: uuidV4()
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
