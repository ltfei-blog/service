import { getLocalConfig } from '@ltfei-blog/service-config/getLocalConfig'
import { Sequelize } from 'sequelize'
import { db as logger } from '@ltfei-blog/service-utils/log'

const sqlType = await getLocalConfig('sql', 'type')

const connect = async () => {
  if (sqlType == 'mysql') {
    const { database, host, password, port, username } = await getLocalConfig('mysql')
    return new Sequelize({
      dialect: 'mysql',
      database,
      host,
      password,
      port,
      username,
      timezone: '+08:00',
      logging: logger.info.bind(logger)
    })
  } else if (sqlType == 'sqlite') {
    const storage = await getLocalConfig('sqlite', 'storage')
    return new Sequelize({
      dialect: 'sqlite',
      storage
    })
  }
}

export const sequelize = await connect()
