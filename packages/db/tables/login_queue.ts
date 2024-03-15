import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

export const loginStatus = {
  /**
   * 未登录
   */
  notLogin: 0,
  /**
   * 已扫码
   */
  scanCode: 1,
  /**
   * 已获取qq互联登录url 已创建登录地址
   */
  getQqConnectUrl: 2,
  /**
   * 登录成功
   */
  loginSucceed: 10,
  /**
   * 登录失败(用户取消登录)
   */
  loginFailedUserCancel: 20,
  /**
   * 登录失败(其他原因)
   */
  loginFailedOtherCause: 21,
  /**
   * 登录失败(登录超时) (不在数据库体现，仅返回数据时判断时间)
   */
  loginFailedTimeout: 22
}

export type Table = {
  id: number
  uuid: string
  url: string
  status: number
  date: number
  user_id: number
  ineffective: boolean
}
/**
 * todo: 添加 生成端 和 登录端 和 是否完成
 */

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
    date: DataTypes.BIGINT,
    user_id: DataTypes.INTEGER,
    /**
     * 是否失效
     */
    ineffective: DataTypes.BOOLEAN
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
