import { Users, UsersTable } from '@ltfei-blog/service-db'

/**
 * 整体登录逻辑，使用不同登录方式在不同路由获取用户信息后，调用该函数用于在数据库查找/注册
 * todo: 允许登录/允许注册判断
 */
export const findOrCreateUser = async (
  where: Partial<UsersTable>,
  defaults: Partial<UsersTable>
) => {
  const res = await Users.findOrCreate({
    where: where,
    defaults: defaults
  })

  return res
}
