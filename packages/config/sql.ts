import { Config as ConfigType, GetConfig, DeepPartial } from './types'
import { Config } from '@ltfei-blog/service-db'

// 整组的缓存
const caches_group: DeepPartial<ConfigType> = {}
// 具体选项的缓存
const caches_name: DeepPartial<ConfigType> = {}

export const queryConfig: GetConfig = async <
  T extends keyof ConfigType,
  K extends keyof ConfigType[T]
>(
  key: T,
  name?: K,
  cache = true
): Promise<ConfigType[T][K] | ConfigType[T]> | null => {
  // 查找缓存
  if (cache) {
    if (!name && caches_group[key]) {
      return caches_group[key] as ConfigType[T]
    }
    if (caches_name[key] && caches_name[key][name]) {
      return caches_name[key][name] as ConfigType[T][K]
    }
  }

  // 查询大类
  if (!name) {
    const configs = await Config.findAll({
      where: {
        key
      }
    })
    const results = configs.map((e) => e.toJSON())
    const result: { [key: string]: object } = {}
    results.forEach((e) => {
      result[e.name] = JSON.parse(e.value)
    })

    cache && (caches_group[key] = result)

    return result as ConfigType[T]
  }
  // 查询具体配置项
  const config = await Config.findOne({
    where: {
      key,
      name: name as string
    }
  })
  if (!config) {
    return null
  }
  const value = JSON.parse(config.toJSON().value)
  // 写入缓存
  if (cache) {
    if (caches_name[key]) {
      caches_name[key][name] = value
    } else {
      caches_name[key] = {}
      caches_name[key][name] = value
    }
  }
  return value
}
