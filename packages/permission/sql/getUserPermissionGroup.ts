import { PermissionUserGroup, PermissionUserGroupTable } from '@ltfei-blog/service-db'

const cach = new Map<number, number[]>()

/**
 * 获取用户所在的权限组
 */
export const getUserPermissionGroup = async (id: number) => {
  const cachData = cach.get(id)
  if (cachData) {
    return cachData
  }

  const permissionGroupResult = await PermissionUserGroup.findAll({
    where: {
      user: id
      // todo: 限制过期时间
      // expire_time: {}
    }
  })
  if (permissionGroupResult.length == 0) {
    cach.set(id, [1])
    return [1]
  }

  const permissionGroup = permissionGroupResult.map((e) => e.toJSON().group)

  cach.set(id, permissionGroup)

  return permissionGroup
}

/**
 * 更新缓存
 */
export const updateUserPermissionGroup = (id: number) => {
  cach.delete(id)
}
