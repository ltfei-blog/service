/**
 * permission_groups
 * 权限组
 */
import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

type Table = {
  id: number
  name: string
  /**
   * 当前权限组继承哪个权限组
   */
  extends: number
  /**
   * 类型
   * 用户权限 or 权限组
   * - 1 group
   * - 2 user
   */
  type: number
}

export const PermissionGroups = sequelize.define<Model<Table, Table>, Table>(
  'permission_groups',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.CHAR
    },
    extends: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    type: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
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

export type { Table as PermissionGroupsTable }
