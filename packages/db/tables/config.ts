import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

type Table = {
  id: number
  key: string
  name: string
  value: string
  create_time: number
  last_edit_time: number
}

export const Config = sequelize.define<Model<Table, Table>>(
  'config',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      type: DataTypes.CHAR
    },
    name: {
      type: DataTypes.CHAR
    },
    value: {
      type: DataTypes.CHAR
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
        fields: ['key', 'name', 'create_time', 'last_edit_time']
      }
    ]
  }
)
