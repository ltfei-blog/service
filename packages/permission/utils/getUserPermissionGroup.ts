import { PermissionUserGroup } from '@ltfei-blog/service-db'

/**
 * 获取用户所在的权限组
 */
export const getUserPermissionGroup = async (id: number) => {
  const permissionGroup = await PermissionUserGroup.findAll({
    where: {
      user: id
      // todo: 限制过期时间
      // expire_time: {}
    }
  })
  if (permissionGroup.length == 0) {
    return [1]
  }
  return permissionGroup.map((e) => e.toJSON().group)
}
