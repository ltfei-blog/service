import { Permission } from './permissionsList'
import { checkPermission } from './checkPermission'
import { getUserPermissionGroup } from '../sql/getUserPermissionGroup'

/**
 * 匹配用户的某个权限
 * todo: 缓存
 */

export const getUserPermission = async (user: number, permissionKey: Permission) => {
  const permissionGroups = await getUserPermissionGroup(user)
  for (const group of permissionGroups) {
    const permission = await checkPermission(group, permissionKey)
    if (permission != null) {
      return permission
    }
  }
  // 所有权限组均没有找到，使用默认权限
  return permissionKey.defaultValue
}
