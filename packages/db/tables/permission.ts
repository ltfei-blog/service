/**
 * permission
 * 权限
 */

import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

type Table = {
  id: number
  // user: string
  key: string
  /**
   * - 0 未设置
   * - 1 允许
   * - 2 拒绝
   */
  value: number
  group: number
  // 开始时间
  create_time: number
  // 结束时间
  expire_time: number
  // 持续时间
  duration_time: number
}

export const Permissions = sequelize.define<Model<Table, Table>, Table>(
  'permissions',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // user: DataTypes.INTEGER,
    key: DataTypes.CHAR,
    value: DataTypes.INTEGER,
    group: DataTypes.INTEGER,
    create_time: DataTypes.BIGINT,
    expire_time: DataTypes.BIGINT,
    duration_time: DataTypes.BIGINT
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

export { Table as PermissionsTable }
