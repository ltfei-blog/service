import { PermissionGroups } from '@ltfei-blog/service-db'

/**
 * 查询权限组
 */
export const getPermissionGroup = async (id: number) => {
  const group = await PermissionGroups.findOne({
    where: {
      id
    }
  })

  return group.toJSON()
}
