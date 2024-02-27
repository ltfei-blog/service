import { PermissionGroups, type PermissionGroupsTable } from '@ltfei-blog/service-db'

const cach = new Map<number, PermissionGroupsTable>()

/**
 * 查询权限组
 */
export const getPermissionGroup = async (id: number) => {
  const cachData = cach.get(id)
  if (cachData) {
    return cachData
  }

  const groupResult = await PermissionGroups.findOne({
    where: {
      id
    }
  })

  const group = groupResult.toJSON()

  cach.set(group.id, group)

  return group
}

/**
 * 更新缓存
 */
export const updatePermissionGroup = (id: number, data: PermissionGroupsTable) => {
  cach.delete(id)
}
