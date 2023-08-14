import { parse } from 'yaml'
import { readFileSync, existsSync, writeFileSync } from 'node:fs'
import { v4 as uuidV4 } from 'uuid'

const CONFIG_PATH = 'config.yml'
const jwtSecret = uuidV4()
const DEFAULT_CONFIG_TEXT = `app:
  port: 3000
  jwtSecret: "${jwtSecret}"
`

if (!existsSync(CONFIG_PATH)) {
  writeFileSync(CONFIG_PATH, DEFAULT_CONFIG_TEXT)
}

const file = readFileSync(CONFIG_PATH, 'utf-8')
const config = parse(file)

export default config
