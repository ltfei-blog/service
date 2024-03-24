import { BrowsingHistory } from '@ltfei-blog/service-db'

export const insertBrowsingHistory = async (userId: number, articleId: number) => {
  const [browsingHistory] = await BrowsingHistory.findOrCreate({
    where: {
      user_id: userId,
      article_id: articleId
    },
    defaults: {
      user_id: userId,
      article_id: articleId,
      create_time: Date.now()
    }
  })

  await browsingHistory.update({
    last_edit_time: Date.now()
  })
}
