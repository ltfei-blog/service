import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

type Table = {
  id: number
  title: string
  content: string
  cover: string
  desc: string
  /**
   * - 0 待审核
   * - 1 审核通过
   * - 2 审核不通过
   * - 3 撤回审核(取消投稿)
   * - 4
   */
  status: number
  author: number
  create_time: number
  last_edit_time: number
  type: 'edit' | 'add'
  /**
   * 文章id
   * 修改时直接设置为文章id，发布时在审核通过后设置为文章id
   */
  articles_id: number
  /**
   * 审核人id
   */
  audit_id: number
  cause: string
}

export { Table as ArticlesAuditTable }

export const ArticlesAudit = sequelize.define<Model<Table, Table>>(
  'articles_audit',
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
    },
    audit_id: {
      type: DataTypes.INTEGER
    },
    cause: {
      type: DataTypes.CHAR(200)
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
