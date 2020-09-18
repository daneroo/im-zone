const path = require('path')
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
})
module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'mdx'],
  webpack (config, { buildId, dev, isServer, defaultLoaders, webpack }) {
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm'
    config.plugins = [
      ...config.plugins,
      // copied from wasm-rust dev setup
      // docs: https://github.com/wasm-tool/wasm-pack-plugin
      new WasmPackPlugin({
        crateDirectory: path.resolve(__dirname, '.'),
        // disable forceMode for hot reload to work for the wasm
        // recompilation is triggered, module is not replaced
        forceMode: 'production'
      })
    ]
    return config
  },
  // Fixes going directly to a page on exported site:
  // https://nextjs.org/docs/api-reference/next.config.js/exportPathMap#adding-a-trailing-slash
  exportTrailingSlash: true
})
