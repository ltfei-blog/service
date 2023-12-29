/**
 * 定义表之间的关联
 */
import { Likes, Articles, Users, Uploads } from './'

/**
 * 点赞
 */
Likes.hasMany(Articles, {
  as: 'like_data',
  foreignKey: 'articles'
})
Articles.belongsTo(Likes, {
  as: 'likes_data',
  foreignKey: 'id',
  targetKey: 'articles'
})
Articles.belongsTo(Likes, {
  as: 'liked_data',
  foreignKey: 'id',
  targetKey: 'articles'
})

Articles.hasOne(Users, {
  as: 'author_data',
  sourceKey: 'author',
  foreignKey: 'id'
})

Uploads.hasOne(Users, {
  as: 'user_data',
  sourceKey: 'user',
  foreignKey: 'id'
})
