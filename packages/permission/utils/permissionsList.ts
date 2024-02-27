/**
 * 权限列表
 */

export type Permission = {
  key: string
  defaultValue: 1 | 2
}

const permission = (key: string, defaultValue: 1 | 2): Permission => {
  return {
    key,
    defaultValue
  }
}

export const PERMISSIONS = {
  /**
   * 发布文章
   */
  creator_publishArticle: permission('creator.publish_article', 1),
  /**
   * 发布文章允许跳过审核
   */
  creator_publishArticleSkipAudit: permission('creator.publish_article_skip_audit', 2),
  /**
   * 上传图片
   */
  creator_uploadImage: permission('creator.upload_image', 1),
  /**
   * 保存草稿
   */
  creator_saveDraft: permission('creator.save_draft', 1),
  /**
   * 删除自己作品下用户的评论
   */
  creator_deleteUserComment: permission('creator.delete_user_comment', 1)
}
