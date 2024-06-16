import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

type Table = {
  id: number
  title: string
  content: string
  cover: string
  desc: string
  /**
   * - 1 正常
   * - 10 锁定
   * - 100 删除
   */
  status: number
  author: number
  create_time: number
  last_edit_time: number
}

export const Articles = sequelize.define<Model<Table, Table>>(
  'articles',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.CHAR(100),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    cover: {
      type: DataTypes.CHAR(200)
    },
    desc: {
      type: DataTypes.CHAR(100),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER
    },
    author: {
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
        fields: ['author', 'create_time', 'last_edit_time']
      }
    ]
  }
)

export { Table as ArticlesTable }
