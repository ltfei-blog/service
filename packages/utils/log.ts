import log4js from 'log4js'

log4js.configure({
  appenders: {
    current: {
      type: 'file',
      filename: 'logs/current.log'
    },
    app: {
      type: 'file',
      filename: 'logs/app.log'
    },
    db: {
      type: 'file',
      filename: 'logs/db.log'
    },
    out: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '[%d{MM/dd hh:mm:ss}] [%[%p%]] %c - %m'
      }
    }
  },
  categories: {
    default: {
      appenders: ['current', 'out'],
      level: 'all'
    },
    app: {
      appenders: ['current', 'out', 'app'],
      level: 'info'
    },
    db: {
      appenders: ['db'],
      level: 'all'
    }
  }
})

export const app = log4js.getLogger('app')
export const db = log4js.getLogger('db')
export const defaultLogger = log4js.getLogger()
export const getLogger = (type?: string) => log4js.getLogger(type)
export { log4js }
