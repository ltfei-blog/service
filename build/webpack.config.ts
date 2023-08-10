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
  externals: [
    nodeExternals(),
    (data, cb) => {
      const { request, context, getResolve } = data
      // 仅判断 node: 开头,可能会有问题,引入时需要node:fs
      if (request.indexOf('node:') == 0) {
        return cb()
      }
      getResolve()(context, request, (err, result) => {
        if (err) {
          return cb()
        }
        if (result.includes('node_modules')) {
          return cb(null, 'commonjs ' + request)
        }
        cb()
      })
    }
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  target: 'node',
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader' }]
  }
}
