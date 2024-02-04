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

export interface SqlResult {
  id: number
  content: string
  user_id: number
  article_id: number
  reply_id?: number
  comment_id: number
  status?: any
  create_time: number
  last_edit_time?: any
  reply_count?: number
  likes_count?: number
  liked?: number
  sender?: {
    id: number
    username: string
    avatar: string
    avatar_pendant?: any
  }
}

export const mapComments = (comments: SqlResult[]): Comment[] => {
  const results: Comment[] = []

  const replys: SqlResult[] = []

  // 先处理主评论
  // 回复id不为0的是回复
  comments.forEach((e) => {
    if (e.reply_id != 0 && e.reply_id != null) {
      return replys.push(e)
    }
    results.push({ ...mapKeys(e), reply: [] })
  })

  // 处理回复
  // 回复为倒序
  replys.reverse().forEach((e) => {
    const result = results.find((result) => {
      return result.id == e.comment_id
    })
    if (!result) {
      return
    }

    result.reply?.push(mapKeys(e))
    return
  })

  return results
}

export const mapKeys = (data: SqlResult): CommentReply => {
  return {
    id: data.id,
    content: data.content,
    date: data.create_time,
    userId: data.sender.id,
    avatar: data.sender.avatar,
    username: data.sender.username,
    likeCount: data.likes_count,
    liked: Boolean(data.liked),
    isAuthor: false,
    replyCommentId: data.comment_id,
    replyToReplyId: data.reply_count,
    replyCount: data.reply_count
  }
}
