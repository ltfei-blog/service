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
  // 创作中心
  /**
   * 发布文章
   */
  creator_publishArticle: permission('creator_publishArticle', 1),
  /**
   * 发布文章允许跳过审核
   */
  creator_publishArticleSkipAudit: permission('creator_publishArticleSkipAudit', 2),
  /**
   * 上传图片
   */
  creator_uploadImage: permission('creator_uploadImage', 1),
  /**
   * 保存草稿
   */
  creator_saveDraft: permission('creator_saveDraft', 1),
  /**
   * 删除自己作品下用户的评论
   */
  creator_deleteUserComment: permission('creator_deleteUserComment', 1),

  // 用户登录
  /**
   * 允许登录
   */
  userLogin_login: permission('userLogin_login', 1),
  /**
   * 允许使用微信登录
   * todo: 先拒绝
   */
  userLogin_wxLogin: permission('userLogin_wxLogin', 2),

  // 用户文章操作板块
  /**
   * 点赞文章
   */
  contentOperation_like: permission('contentOperation_like', 1),
  /**
   * 发布评论
   */
  contentOperation_publishComment: permission('contentOperation_publishComment', 1),
  /**
   * 点赞评论
   */
  contentOperation_likeComment: permission('contentOperation_likeComment', 1),

  /**
   * 回复评论
   */
  contentOperation_replyComment: permission('contentOperation_replyComment', 1),
  /**
   * 收藏
   */
  contentOperation_favorite: permission('contentOperation_favorite', 1),
  /**
   *
   */

  // 用户操作模块
  /**
   * 黑名单操作
   */
  userOperation_blackList: permission('userOperation_blackList', 1),
  /**
   * 修改资料
   */
  userOperation_updateUserinfo: permission('userOperation_updateUserinfo', 1),
  /**
   * 修改用户名
   */
  userOperation_updateUsername: permission('userOperation_updateUsername', 1),
  /**
   * 修改简介
   */
  userOperation_usersign: permission('userOperation_usersign', 1),
  /**
   * 修改头像（上传头像）
   */
  userOperation_updateAvatar: permission('userOperation_updateAvatar', 1),
  /**
   * 关注
   */
  userOperation_follow: permission('userOperation_follow', 1)
}
