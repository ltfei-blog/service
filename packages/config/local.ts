import { parse } from 'yaml'
import { readFileSync, existsSync, writeFileSync } from 'node:fs'

const CONFIG_PATH = 'config.yml'
const DEFAULT_CONFIG_TEXT = `app:
  port: 3000
`

if (!existsSync(CONFIG_PATH)) {
  writeFileSync(CONFIG_PATH, DEFAULT_CONFIG_TEXT)
}

const file = readFileSync(CONFIG_PATH, 'utf-8')
const config = parse(file)

export default config
