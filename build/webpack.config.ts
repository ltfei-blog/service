import { resolve } from 'path'
// import { readdirSync } from 'node:fs'
import { Configuration } from 'webpack'
import nodeExternals from 'webpack-node-externals'

const path = resolve(__dirname, '..', 'packages')
// const packages = readdirSync(path)

export default <Configuration>{
  mode: 'production',
  entry: resolve(path, 'app', 'app.ts'),
  output: {
    path: resolve(__dirname, '..', 'dist')
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  target: 'node',
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader' }]
  }
}
