import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

type Table = {
  id: number
  content: string
  user_id: number
  article_id: number
  reply_id: number
  comment_id: number
  /**
   * - 1 正常
   */
  status: number
  create_time: number
  last_edit_time: number
}

export const Comments = sequelize.define<
  Model<
    {
      id: number
      content: string
      user_id: number
      article_id: number
      reply_id: number
      comment_id: number
      status: number
      create_time: number
      last_edit_time?: number
      reply_count?: number
      sender?: {
        id: number
        username: string
        avatar: string
        avatar_pendant?: any
      }
    },
    Table
  >
>(
  'comments',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    article_id: {
      type: DataTypes.INTEGER
    },
    reply_id: {
      type: DataTypes.INTEGER
    },
    comment_id: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.INTEGER
    },

    create_time: {
      type: DataTypes.BIGINT
    },
    last_edit_time: {
      type: DataTypes.BIGINT
    }
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ['id'],
        unique: true
      },
      {
        fields: [
          'user_id',
          'article_id',
          'reply_id',
          'comment_id',
          'create_time',
          'last_edit_time'
        ]
      }
    ]
  }
)
