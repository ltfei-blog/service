import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

type Table = {
  id: number
  comment: number
  liked: boolean
  user: number
  create_time: number
  last_edit_time: number
}

export const CommentLikes = sequelize.define<Model<Table, Table>>(
  'comment_likes',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    comment: {
      type: DataTypes.INTEGER
    },
    liked: {
      type: DataTypes.BOOLEAN
    },
    user: {
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
        fields: ['comment', 'user', 'create_time', 'last_edit_time']
      }
    ]
  }
)
