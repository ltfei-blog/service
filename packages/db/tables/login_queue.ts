import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

/**
 * - 0: 未登录
 * - 1: 已扫码
 * - 2: 已创建登录地址
 * - 10: 登录成功
 * - 20: 登录失败(用户取消登录)
 * - 21: 登录失败(其他原因)
 * - 22: 登录超时(不在数据库体现，仅返回数据时判断时间)
 */
export const loginStatus = {
  notLogin: 0,
  scanCode: 1,
  getQqConnectUrl: 2,
  loginSucceed: 10,
  loginFailedUserCancel: 20,
  loginFailedOtherCause: 21,
  loginFailedTimeout: 22
}

export type Table = {
  id: number
  uuid: string
  url: string
  status: number
  date: Date
}

export const LoginQueue = sequelize.define<Model<Table, Table>, Table>(
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
     * 登录后的回调地址
     * todo: 增加验证域名是否合法
     */
    url: DataTypes.CHAR,
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
