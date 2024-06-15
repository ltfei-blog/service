import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

type Table = {
  id: number
  /**
   * 举报内容的类型
   */
  type: 'article' | 'comment' | 'user'
  /**
   * 举报的原因
   */
  cause: number
  /**
   * 举报的详细描述(由举报人填写)
   */
  desc: string
  /**
   * 举报人id
   */
  originator_id: number
  /**
   * 被举报内容id
   */
  report_id: number
  /**
   * 处理状态
   * - 0 未处理
   * - 1 已处理-举报成功
   * - 2 已处理-举报失败
   */
  status: number
  /**
   * 处理人id
   */
  audit_user_id: number
  /**
   * 备注(由审核人员填写，会向用户展示)
   */
  remarks: string
  /**
   * 举报发起时间
   */
  create_time: number
  /**
   * 举报处理时间
   */
  processing_time: number
}

export const causeType = [
  { label: '色情低俗', key: 1 },
  { label: '违法犯罪', key: 2 },
  { label: '造谣传谣', key: 3 },
  { label: '垃圾广告', key: 4 },
  { label: '人身攻击', key: 7 },
  { label: '非原创内容', key: 5 },
  { label: '骚扰', key: 6 },
  { label: '引战', key: 8 },
  { label: '诈骗', key: 9 },
  { label: '其他', key: 0 }
]

export const Reports = sequelize.define<Model<Table, Table>, Table>(
  'reports',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: DataTypes.CHAR(64),
    cause: DataTypes.INTEGER,
    desc: DataTypes.CHAR(255),
    originator_id: DataTypes.INTEGER,
    report_id: DataTypes.INTEGER,
    remarks: DataTypes.CHAR(255),
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    audit_user_id: DataTypes.INTEGER,
    create_time: DataTypes.BIGINT,
    processing_time: DataTypes.BIGINT
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ['id'],
        unique: true
      }
    ]
  }
)

export { Table as ReportsTable }
