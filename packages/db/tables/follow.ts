import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

type Table = {
  id: number
  user_id: number
  target_user_id: number
  status: boolean
  create_time: number
  last_edit_time: number
}

export const Follow = sequelize.define<Model<Table, Table>>(
  'follow',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    target_user_id: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.BOOLEAN
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
        fields: ['user_id', 'target_user_id', 'last_edit_time']
      }
    ]
  }
)
