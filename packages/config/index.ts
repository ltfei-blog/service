import { Config } from './types'
import localConfig from './local'
import defaultConfig from './defaultConfig'

type GetConfig = {
  <T extends keyof Config, K extends keyof Config[T]>(
    key: T,
    name: K
  ): Promise<Config[T][K]>
  <T extends keyof Config>(key: T): Promise<Config[T]>
}

export const getConfig: GetConfig = async <
  T extends keyof Config,
  K extends keyof Config[T]
>(
  key: T,
  name?: K
): Promise<Config[T][K] | Config[T]> => {
  if (!name) {
    return { ...defaultConfig[key], ...localConfig[key] }
  }
  // todo: 修改匹配顺序
  if (!localConfig[key] || !localConfig[key][name]) {
    return defaultConfig[key][name]
  }
  if (localConfig[key][name]) {
    return localConfig[key][name]
  }
}
