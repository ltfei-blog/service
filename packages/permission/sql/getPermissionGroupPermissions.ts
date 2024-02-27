import { Permissions, PermissionsTable } from '@ltfei-blog/service-db'

const cach = new Map<number, PermissionsTable[]>()

/**
 * 获取权限组的权限
 */
export const getPermissionGroupPermissions = async (group: number) => {
  const cachData = cach.get(group)
  if (cachData) {
    return cachData
  }

  const permissionsResult = await Permissions.findAll({
    where: {
      group
    }
  })

  const permissions = permissionsResult.map((e) => e.toJSON())

  cach.set(group, permissions)

  return permissions
}

/**
 * 更新缓存
 */
export const updatePermissionGroupPermissions = (group: number) => {
  cach.delete(group)
}
