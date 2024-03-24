import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

type Table = {
  id: number
  user_id: number
  article_id: number
  create_time: number
  last_edit_time: number
}

export const BrowsingHistory = sequelize.define<Model<Table, Table>>(
  'browsing_history',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    article_id: {
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
        fields: ['user_id', 'article_id', 'create_time', 'last_edit_time']
      }
    ]
  }
)
