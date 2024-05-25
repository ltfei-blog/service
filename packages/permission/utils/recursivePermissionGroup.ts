import type { PermissionGroupsTable } from '@ltfei-blog/service-db'
import { getPermissionGroup } from '../sql/getPermissionGroup'

/**
 * 递归查询权限组(包含继承的权限组)
 */
export const recursivePermissionGroup = async (id: number) => {
  const res: PermissionGroupsTable[] = []
  const group = await getPermissionGroup(id)
  res.push(group)

  if (group.extends) {
    const groups = await recursivePermissionGroup(group.extends)
    res.push(...groups)
  }

  return res
}
