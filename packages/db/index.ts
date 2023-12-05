import { sequelize } from './connect'

await sequelize.sync({ alter: true })
export { sequelize }

export * from './tables/users'
export * from './tables/login_queue'
export * from './tables/articles'
export * from './tables/articles_save'
