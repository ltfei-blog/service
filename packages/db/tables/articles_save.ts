import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

type Table = {
  id: number
  title: string
  content: string
  cover: string
  desc: string
  /**
   * - 1 普通草稿
   * - 2 已提交审核
   */
  status: number
  author: number
  create_time: number
  last_edit_time: number
  type: 'edit' | 'add'
  articles_id: number
}

export const ArticlesSave = sequelize.define<Model<Table, Table>>(
  'articles_save',
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
      allowNull: true
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
    },
    type: {
      type: DataTypes.CHAR(50)
    },
    articles_id: {
      type: DataTypes.INTEGER
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
        fields: ['author', 'create_time', 'last_edit_time', 'articles_id']
      }
    ]
  }
)
