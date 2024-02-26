/**
 * 权限列表
 */

export type PermissioKey =
  /**
   * 发布文章
   */
  | 'creator.publish_article'
  /**
   * 发布文章允许跳过审核
   */
  | 'creator.publish_article_skip_audit'
  /**
   * 上传图片
   */
  | 'creator.upload_image'
  /**
   * 保存草稿
   */
  | 'creator.save_draft'
  /**
   * 删除自己作品下用户的评论
   */
  | 'creator.delete_user_comment'

export interface Permission<T = PermissioKey> {
  key: T
}

export const PERMISSIONS: { [key in PermissioKey]: Permission<key> } = {
  /**
   * 发布文章
   */
  'creator.publish_article': {
    key: 'creator.publish_article'
  },
  /**
   * 发布文章允许跳过审核
   */
  'creator.publish_article_skip_audit': {
    key: 'creator.publish_article_skip_audit'
  },
  /**
   * 上传图片
   */
  'creator.upload_image': {
    key: 'creator.upload_image'
  },
  /**
   * 保存草稿
   */
  'creator.save_draft': {
    key: 'creator.save_draft'
  },
  /**
   * 删除自己作品下用户的评论
   */
  'creator.delete_user_comment': {
    key: 'creator.delete_user_comment'
  }
}
