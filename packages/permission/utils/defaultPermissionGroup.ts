import { PermissioKey } from './permissionsList'
/**
 * 默认权限组
 * 所有权限组未能匹配时使用此配置
 */
export const defaultPermission: { [key in PermissioKey]: 1 | 2 } = {
  'creator.publish_article': 1,
  'creator.publish_article_skip_audit': 2,
  'creator.upload_image': 1,
  'creator.save_draft': 1,
  'creator.delete_user_comment': 1
}
