import { sequelize } from '../connect'
import { DataTypes, Model } from 'sequelize'

// todo: 添加注册来源

type Table = {
  id: number
  username: string
  password: string
  avatar: string
  city: string
  /**
   * 0 女
   * 1 男
   * 2 保密
   */
  gender: 0 | 1 | 2
  register_date: number
  last_login_date: number
  register_ip: string
  status: number
  avatar_pendant: string
  desc: string
  wx_openid: string
  wx_unionid: string
  qq_openid: string
}

export const Users = sequelize.define<Model<Table>>(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.CHAR
    },
    password: DataTypes.CHAR,
    avatar: DataTypes.CHAR,
    city: DataTypes.CHAR(50),
    gender: {
      type: DataTypes.INTEGER,
      defaultValue: 2
    },
    register_date: DataTypes.BIGINT,
    last_login_date: DataTypes.BIGINT,
    register_ip: DataTypes.CHAR,
    status: DataTypes.INTEGER,
    avatar_pendant: DataTypes.CHAR,
    desc: DataTypes.CHAR,
    // 第三方平台登录
    wx_openid: {
      type: DataTypes.CHAR
    },
    wx_unionid: {
      type: DataTypes.CHAR
    },
    qq_openid: {
      type: DataTypes.CHAR
    }
  },
  {
    timestamps: false,
    indexes: [
      {
        fields: ['id', 'wx_openid', 'wx_unionid', 'qq_openid'],
        unique: true
      }
    ]
  }
)

export { Table as UsersTable }
