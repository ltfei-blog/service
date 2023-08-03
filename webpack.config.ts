import { resolve } from 'node:path'
import { readdirSync } from 'node:fs'
import { Configuration } from 'webpack'
import nodeExternals from 'webpack-node-externals'

const paths = readdirSync(resolve(__dirname, 'src'))

export default <Configuration>{
  mode: 'production',
  entry: resolve(__dirname, 'src', 'app', 'app.ts'),
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: paths.reduce(
      (target, key) => {
        target[key] = resolve(__dirname, 'src', key)
        return target
      },
      {} as { [key: string]: string }
    )
  }
}
