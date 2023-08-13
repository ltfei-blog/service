import { sequelize } from '../connect'
import { DataTypes } from 'sequelize'

export const LoginQueue = sequelize.define(
  'login_queue',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.UUID
    },
    /**
     * - 0: 未登录
     * - 1: 已扫码
     * - 10: 登录成功
     * - 20: 登录失败(用户取消登录)
     * - 21: 登录失败(其他原因)
     * - 22: 登录超时(不在数据库体现，仅返回数据时判断时间)
     */
    status: DataTypes.INTEGER,
    date: DataTypes.DATE
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ['id', 'uuid'],
        unique: true
      }
    ]
  }
)
