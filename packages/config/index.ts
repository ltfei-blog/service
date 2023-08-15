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
    return { ...localConfig[key], ...defaultConfig[key] }
  }
  if (localConfig[key][name]) {
    return localConfig[key][name]
  } else if (defaultConfig[key][name]) {
    return defaultConfig[key][name]
  }
}
