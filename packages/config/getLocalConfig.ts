import { Config as ConfigType, GetConfig } from './types'
import localConfig from './local'
import defaultConfig from './defaultConfig'

export const getLocalConfig: GetConfig = async <
  T extends keyof ConfigType,
  K extends keyof ConfigType[T]
>(
  key: T,
  name?: K
): Promise<ConfigType[T][K] | ConfigType[T]> => {
  if (!name) {
    return { ...defaultConfig[key], ...localConfig[key] }
  }
  if (!localConfig[key] || !localConfig[key][name]) {
    return defaultConfig[key][name]
  }
  // 匹配本地字段
  if (localConfig[key][name]) {
    return localConfig[key][name]
  }
}
