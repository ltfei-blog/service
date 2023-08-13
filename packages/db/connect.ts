import { getConfig } from '@ltfei-blog/service-config'
import { Sequelize } from 'sequelize'

const sqlType = await getConfig('sql', 'type')

const connect = async () => {
  if (sqlType == 'mysql') {
    const { database, host, password, port, username } = await getConfig('mysql')
    return new Sequelize({
      dialect: 'mysql',
      database,
      host,
      password,
      port,
      username,
      timezone: '+08:00'
    })
  } else if (sqlType == 'sqlite') {
    const storage = await getConfig('sqlite', 'storage')
    return new Sequelize({
      dialect: 'sqlite',
      storage,
      timezone: '+08:00'
    })
  }
}

export const sequelize = await connect()
