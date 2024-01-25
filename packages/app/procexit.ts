import readline from 'node:readline/promises'
import { stdin as input, stdout as output, exit } from 'node:process'
import { sequelize } from '@ltfei-blog/service-db'

/**
 * https://nodejs.cn/api/readline.html#readline_event_sigint
 */
const rl = readline.createInterface({ input, output })

rl.on('SIGINT', async () => {
  await sequelize.close()
  exit()
})
