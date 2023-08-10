import { Config } from './types'

export default <Config>{
  app: {
    port: 3000,
    baseUrl: '/'
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
