import { createHash } from 'crypto'

export const encrypion = (password: string) => {
  const hash = createHash('sha256')
  hash.update(password)
  return hash.digest('hex')
}
