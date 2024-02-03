import type { Request } from 'express'
import type { Table } from '@ltfei-blog/service-db'

export interface QqConnectUserInfo {
  ret: number
  msg: string
  is_lost: number
  nickname: string
  gender: string
  gender_type: number
  /**
   * @deprecated
   */
  province: string
  /**
   * @deprecated
   */
  city: string
  /**
   * @deprecated
   */
  year: string
  /**
   * @deprecated
   */
  constellation: string
  figureurl?: string
  figureurl_1?: string
  figureurl_2?: string
  figureurl_qq_1: string
  figureurl_qq_2?: string
  figureurl_qq?: string
  figureurl_type: string
  is_yellow_vip: string
  vip: string
  yellow_vip_level: string
  level: string
  is_yellow_year_vip: string
}

export interface LoginRequest extends Request {
  LoginQueue: Table
}

/**
 * comment
 * 引用于 @ltfei-blog/blogui-components/comment/src/types.ts
 */
type ID = number | string

export interface CommentContent {
  id: ID
  content: string
  date: Date | string | number
  userId: ID
  avatar: string
  username: string
  likeCount: number
  liked: boolean
  isAuthor?: boolean
  [key: string]: any
}

export interface CommentReply extends CommentContent {
  // 回复的主评论的id
  replyCommentId: ID
  // 在回复里面回复的评论的id
  replyToReplyId: ID
  // 回复数量
  replyCount: number
}

export interface Comment extends CommentContent {
  reply: CommentReply[]
}

export interface CommentReplyEvent {
  id: number | string
  content: string
}
