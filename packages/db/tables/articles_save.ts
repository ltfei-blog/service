import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

type Table = {
  id: number
  title: string
  content: string
  cover: string
  desc: string
  /**
   * 1 普通草稿
   * 2 提交审核
   * 3 审核通过
   * 4 审核不通过
   *
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
      type: DataTypes.CHAR(16)
    },
    last_edit_time: {
      type: DataTypes.CHAR(16)
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
        fields: ['id', 'author', 'create_time', 'last_edit_time', 'articles_id'],
        unique: true
      }
    ]
  }
)
