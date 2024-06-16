import {
  Comments,
  CommentLikes,
  Users,
  sequelize,
  type CommentTable
} from '@ltfei-blog/service-db'
import { WhereOptions } from 'sequelize'

export const getComments = (where: WhereOptions<CommentTable>, userId = 0) => {
  return Comments.findAll({
    attributes: [
      'id',
      'content',
      'user_id',
      'article_id',
      'reply_id',
      'comment_id',
      'status',
      'create_time',
      'last_edit_time',
      [sequelize.fn('count', sequelize.col('reply_data.id')), 'reply_count'],
      [sequelize.fn('count', sequelize.col('likes_data.liked')), 'likes_count'],
      [sequelize.col('liked_data.liked'), 'liked']
    ],
    where,
    include: [
      {
        model: Users,
        as: 'sender',
        attributes: ['id', 'username', 'avatar', 'avatar_pendant']
      },
      {
        model: Comments,
        as: 'reply_data',
        attributes: [],
        required: false
      },
      {
        model: CommentLikes,
        as: 'likes_data',
        attributes: [],
        where: {
          liked: 1
        },
        required: false
      },
      {
        model: CommentLikes,
        as: 'liked_data',
        attributes: [],
        required: false,
        where: {
          user: userId
        }
      }
    ],
    group: ['comments.id', 'liked_data.id'],
    order: [['create_time', 'DESC']]
    // todo: 先获取全部评论
    // limit: 20
  })
}
