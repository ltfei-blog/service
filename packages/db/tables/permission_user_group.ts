/**
 * permission_user_group
 * 用户所在的权限组
 */

import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

type Table = {
  id: number
  user: string
  group: number
  // 开始时间
  create_time: number
  // 结束时间
  expire_time: number
  // 持续时间
  duration_time: number
}

export const PermissionUserGroup = sequelize.define<Model<Table, Table>, Table>(
  'permission_user_group',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user: DataTypes.INTEGER,
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

export { Table as PermissionUserGroupTable }
