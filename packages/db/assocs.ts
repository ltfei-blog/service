/**
 * 定义表之间的关联
 */
import { Likes, Articles, Users, Uploads, Comments } from './'

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

Comments.hasOne(Articles, {
  as: 'comment_data',
  sourceKey: 'article_id',
  foreignKey: 'id'
})
Comments.hasOne(Users, {
  as: 'sender',
  sourceKey: 'user_id',
  foreignKey: 'id'
})
Comments.hasMany(Comments, {
  foreignKey: 'comment_id'
})
Comments.belongsTo(Comments, {
  as: 'reply_data',
  foreignKey: 'id',
  targetKey: 'comment_id'
})
