/**
 * 权限列表
 */

export type Permission = {
  key: string
  /**
   * 1 允许
   * 2 拒绝
   */
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
  userOperation_follow: permission('userOperation_follow', 1),

  // 后台
  /**
   * 后台登录权限
   */
  admin_login: permission('admin_login', 2),

  /**
   * 后台文章管理
   * - 添加文章
   * - 修改文章
   * - 删除文章
   * - 查询文章
   * - 审核文章
   */
  admin_article: permission('admin_article', 2),
  admin_articleAdd: permission('admin_articleAdd', 2),
  admin_articleEdit: permission('admin_articleEdit', 2),
  admin_articleDelete: permission('admin_articleDelete', 2),
  admin_articleList: permission('admin_articleList', 2),
  admin_articleAudit: permission('admin_articleAudit', 2),

  /**
   * 后台评论管理
   * - 删除评论
   * - 修改评论
   * - 查询评论
   * - 审核评论
   */
  admin_comment: permission('admin_comment', 2),
  admin_commentEdit: permission('admin_commentEdit', 2),
  admin_commentList: permission('admin_commentList', 2),
  admin_commentAudit: permission('admin_commentAudit', 2),

  /**
   * 后台用户管理
   * - 添加用户
   * - 删除用户
   * - 修改用户
   * - 查询用户
   */
  admin_user: permission('admin_user', 2),
  admin_userAdd: permission('admin_userAdd', 2),
  admin_userDelete: permission('admin_userDelete', 2),
  admin_userEdit: permission('admin_userEdit', 2),
  admin_userList: permission('admin_userList', 2),

  /**
   * 后台系统设置
   * - 查看设置项
   * - 修改设置项
   */
  admin_setting: permission('admin_setting', 2),
  admin_settingList: permission('admin_settingList', 2),
  admin_settingEdit: permission('admin_settingEdit', 2)
}
