import { sequelize } from '../index'
import { DataTypes } from 'sequelize'

export const Users = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.CHAR,
      primaryKey: true
    },
    password: DataTypes.CHAR,
    avatar: DataTypes.CHAR,
    city: DataTypes.CHAR(50),
    gender: DataTypes.INTEGER,
    register_date: DataTypes.TIME,
    last_login_date: DataTypes.TIME,
    register_ip: DataTypes.CHAR,
    status: DataTypes.INTEGER,
    avatar_pendant: DataTypes.CHAR,
    // 第三方平台登录
    wx_openid: {
      type: DataTypes.CHAR,
      primaryKey: true
    },
    wx_unionid: {
      type: DataTypes.CHAR,
      primaryKey: true
    },
    qq_openid: {
      type: DataTypes.CHAR,
      primaryKey: true
    }
  },
  {
    timestamps: false
  }
)
