import { Config } from './types'
import localConfig from './local'

export const getConfig = <T extends keyof Config, K extends keyof Config[T]>(
  key: T,
  name: K
): Config[T][K] => {
  if (localConfig[key][name]) {
    return localConfig[key][name]
  }
}
