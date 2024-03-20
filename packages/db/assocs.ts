/**
 * 定义表之间的关联
 */
import { Likes, Articles, Users, Uploads, Comments, CommentLikes } from './'

/**
 * 文章点赞
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
Likes.hasOne(Articles, {
  as: 'user_likes_data',
  sourceKey: 'articles',
  foreignKey: 'id'
})

/**
 * 文章作者信息
 */
Articles.hasOne(Users, {
  as: 'author_data',
  sourceKey: 'author',
  foreignKey: 'id'
})

/**
 * 上传文件的用户
 */
Uploads.hasOne(Users, {
  as: 'user_data',
  sourceKey: 'user',
  foreignKey: 'id'
})

/**
 * 文章评论数量
 */
Comments.hasMany(Articles, {
  as: 'comment_count_data',
  foreignKey: 'article_id'
})
Articles.belongsTo(Comments, {
  as: 'comment_count',
  foreignKey: 'id',
  targetKey: 'article_id'
})

/**
 * 文章评论
 */
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

/**
 * 评论点赞
 */
CommentLikes.hasMany(Comments, {
  as: 'like_data',
  foreignKey: 'comment'
})
Comments.belongsTo(CommentLikes, {
  as: 'likes_data',
  foreignKey: 'id',
  targetKey: 'comment'
})
Comments.belongsTo(CommentLikes, {
  as: 'liked_data',
  foreignKey: 'id',
  targetKey: 'comment'
})
