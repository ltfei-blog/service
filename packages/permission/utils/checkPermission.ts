import { Permission } from './permissionsList'
import { recursivePermissionGroup } from './recursivePermissionGroup'
import { getPermissionGroupPermissions } from '../sql/permissionGroupPermissions'

/**
 * 匹配权限
 * 遍历当前权限组以及继承的权限组匹配权限
 * 只返回 1 2 或 null
 */
export const checkPermission = async (
  group: number,
  permission: Permission
): Promise<number | null> => {
  const permissionGroup = await recursivePermissionGroup(group)
  for (const e of permissionGroup) {
    const groupPermissions = await getPermissionGroupPermissions(e.id)

    const groupPermission = groupPermissions.find((e) => {
      return e.key == permission.key
      // todo: 可扩展匹配 xxx.* 的语法
    })

    if (groupPermission && groupPermission.value != 0) {
      return groupPermission?.value
    }
  }
  return null
}
