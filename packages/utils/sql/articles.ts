import {
  Articles,
  type ArticlesTable,
  Users,
  Likes,
  sequelize
} from '@ltfei-blog/service-db'
import { WhereOptions } from 'sequelize'

export const findAll = async (
  where: WhereOptions<ArticlesTable>,
  offset: number,
  limit: number
) => {
  const results = await Articles.findAll({
    attributes: [
      'id',
      'title',
      'cover',
      'desc',
      'status',
      'author',
      'create_time',
      'last_edit_time',
      [sequelize.fn('count', sequelize.col('likes_data.liked')), 'likes_count'],
      [
        sequelize.literal(
          `(select count(comments.id) from comments where comments.article_id = articles.id)`
        ),
        'comments_count'
      ]
    ],

    order: [['create_time', 'DESC']],
    where: where,
    include: [
      {
        model: Users,
        as: 'author_data'
      },
      {
        model: Likes,
        as: 'likes_data',
        attributes: [],
        where: {
          liked: 1
        },
        required: false
      }
    ],
    group: ['articles.id'],
    offset,
    limit
  })

  return results
}
