import {
  Articles,
  type ArticlesTable,
  Users,
  Likes,
  sequelize,
  ArticlesAudit,
  ArticlesAuditTable
} from '@ltfei-blog/service-db'
import { Model, WhereOptions } from 'sequelize'
import { keys } from '@ltfei-blog/service-config'

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

const getArticlesAudit = async (id: number) => {
  const articlesAudit = await ArticlesAudit.findOne({
    where: {
      id
    }
  })

  return articlesAudit
}

/**
 * 文章通过审核
 * @param id 审核表的id
 * @param status 要修改的状态
 * @param cause 原因
 * @param auditId 审核人id
 * @param model 已经查询的模型
 * @returns 文章id
 */
export const articlesAudit = async (
  id: number,
  status: number,
  cause: string,
  auditId: number,
  model?: { articlesAuditModel?: Model<ArticlesAuditTable> }
) => {
  const articlesAudit = model?.articlesAuditModel || (await getArticlesAudit(id))
  const { type, title, desc, cover, content, author, articles_id } =
    articlesAudit.toJSON()

  let insertId = articles_id
  if (type == keys.articlesSave.type.add) {
    const result = await Articles.create({
      title,
      desc,
      cover,
      content,
      author,
      create_time: Date.now(),
      status: keys.status.normal
    })

    insertId = result.toJSON().id
  } else if (type == keys.articlesSave.type.edit) {
    await Articles.update(
      {
        title,
        desc,
        cover,
        content,
        last_edit_time: Date.now()
      },
      {
        where: {
          id: articles_id
        }
      }
    )
  }

  // 修改审核表的审核状态和审核人id
  await ArticlesAudit.update(
    {
      status,
      articles_id: insertId,
      audit_id: auditId,
      cause: cause
    },
    {
      where: {
        id
      }
    }
  )

  return insertId
}
