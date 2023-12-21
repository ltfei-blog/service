import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

type Table = {
  id: number
  articles: number
  liked: boolean
  user: number
  create_time: number
  last_edit_time: number
}

export const Likes = sequelize.define<Model<Table, Table>>(
  'likes',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    articles: {
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
        fields: ['articles', 'user', 'create_time', 'last_edit_time']
      }
    ]
  }
)
