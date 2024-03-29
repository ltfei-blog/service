import { Config as ConfigType, GetConfig } from './types'
import localConfig from './local'
import defaultConfig from './defaultConfig'
import { queryConfig } from './sql'
import { getLocalConfig } from './getLocalConfig'

export const getConfig: GetConfig = async <
  T extends keyof ConfigType,
  K extends keyof ConfigType[T]
>(
  key: T,
  name?: K
): Promise<ConfigType[T][K] | ConfigType[T]> => {
  // 匹配数据库
  const sqlValue = await queryConfig(key, name)
  if (!sqlValue) {
    return getLocalConfig(key, name)
  }

  if (!name) {
    // 配置项不一定完整，需要按照优先级整合为完整配置项
    return { ...defaultConfig[key], ...localConfig[key], ...sqlValue }
  }
  return sqlValue
}
