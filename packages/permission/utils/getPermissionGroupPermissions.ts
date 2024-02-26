import { Permissions } from '@ltfei-blog/service-db'

/**
 * 获取权限组的权限
 * todo: 添加缓存
 */
export const getPermissionGroupPermissions = async (group: number) => {
  const permissions = await Permissions.findAll({
    where: {
      group
    }
  })

  return permissions.map((e) => e.toJSON())
}
