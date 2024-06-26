import { sequelize } from './connect'

await sequelize.sync({ alter: true })
export { sequelize }

export * from './tables/users'
export * from './tables/login_queue'
export * from './tables/articles'
export * from './tables/articles_save'
export * from './tables/articles_audit'
export * from './tables/uploads'
export * from './tables/likes'
export * from './tables/comments'
export * from './tables/comment_likes'
export * from './tables/permission'
export * from './tables/permission_groups'
export * from './tables/permission_user_group'
export * from './tables/follow'
export * from './tables/browsing_history'
export * from './tables/config'
export * from './tables/reports'

import('./assocs')
