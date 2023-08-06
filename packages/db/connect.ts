import { getConfig } from '@ltfei-blog/service-config'
import { Sequelize } from 'sequelize'

const sqlType = await getConfig('sql', 'type')

const connect = async () => {
  if (sqlType == 'mysql') {
    const database = await getConfig('mysql', 'database')
    const host = await getConfig('mysql', 'host')
    const password = await getConfig('mysql', 'password')
    const port = await getConfig('mysql', 'port')
    const username = await getConfig('mysql', 'username')
    return new Sequelize({
      dialect: 'mysql',
      database,
      host,
      password,
      port,
      username
    })
  } else if (sqlType == 'sqlite') {
    const storage = await getConfig('sqlite', 'storage')
    return new Sequelize({
      dialect: 'sqlite',
      storage
    })
  }
}

export const sequelize = await connect()
