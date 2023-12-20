import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'
import { Users } from '..'

type Table = {
  id: number
  filename: string
  path: string
  content_type: string
  suffix: string
  user: number
  upload_type: 'cover' | 'avatar' | 'articles'
  /**
   * - 1 正常
   */
  status: number
  create_time: number
}

export const Uploads = sequelize.define<Model<Table, Table>>(
  'uploads',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    filename: {
      type: DataTypes.CHAR(255)
    },
    path: {
      type: DataTypes.CHAR(255)
    },
    content_type: {
      type: DataTypes.CHAR(255)
    },
    suffix: {
      type: DataTypes.CHAR(20)
    },
    user: {
      type: DataTypes.INTEGER
    },
    upload_type: {
      type: DataTypes.CHAR(20)
    },
    status: {
      type: DataTypes.INTEGER
    },
    create_time: {
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
        fields: ['create_time', 'user']
      }
    ]
  }
)

Uploads.hasOne(Users, {
  as: 'user_data',
  sourceKey: 'user',
  foreignKey: 'id'
})
