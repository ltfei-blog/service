/**
 * 定义表之间的关联
 */
import { Likes, Articles } from './'

Likes.hasMany(Articles, {
  as: 'likes_data',
  foreignKey: 'articles'
})
Articles.belongsTo(Likes, {
  foreignKey: 'id'
})
